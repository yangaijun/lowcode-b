import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiPage from 'services/page'
import ApiService from 'services/service'
import ApiInitCode from 'services/initcode'
import ApiComponent from 'services/component'
import Bus, { BUS_KEYS } from 'views/light/bus';
import { designListToDataList, getPageRouteIdPathMap, getPageMenuOption, getPageRouteMap } from 'views/light/utils/util';
import { message, Modal } from 'antd';
import { resetRightAndDesignChange } from './eventSlice';
import { setLight } from './loadingSlice';
import { setDefaultRouterCompletions } from 'views/light/components/panel/component/renders';
import { replaceOrAddQuery } from 'libs/utils';
import { currentChooseKeys } from 'views/light/config';
import history from 'libs/history';
import user from 'libs/user';
//重置页面数据时，跳过的key
const resetPageSkipKeys = ["model"]

const initialState = {
    initCodes: [],
    services: [],
    //理论上应该是项目下的
    model: {
        customs: [],
        systems: []
    },
    nestedList: [],
    loginPage: {},
    selectPage: {
        selectedKeys: []
    },
    //当前项目的页面权限 项目预览时
    userPreviewProjectMenuPaths: user.getUserProjectMenuPaths(true),
    userDevProjectMenuPaths: user.getUserProjectMenuPaths(false)
}

export const pageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {
        setPage(state, { payload }) {
            for (let key in payload) {
                if (key.indexOf('page') === 0) {
                    state[key] = payload[key]
                }
            }
        },
        setInitCodes(state, { payload }) {
            state.initCodes = payload
        },
        setServices(state, { payload }) {
            state.services = payload
        },
        setModel(state, { payload }) {
            state.model = payload
        },
        setLoginPage(state, { payload }) {
            state.loginPage = payload
        },
        resetLoginPage(state) {
            state.loginPage = null
        },
        setNestedList(state, { payload }) {
            const routeMap = getPageRouteMap(payload)

            Bus.set(BUS_KEYS.routeMap, routeMap)

            const pageRouteIdPathMap = getPageRouteIdPathMap(routeMap)
            Bus.set(BUS_KEYS.routeIdPath, pageRouteIdPathMap)
            //系统 $sys.menuPaths 
            Bus.set(BUS_KEYS.pageMenuOptions, getPageMenuOption(payload, pageRouteIdPathMap))
            //上面是全路由，过滤出可以访问的路由
            const routerCompletions = []
            for (let key in routeMap) {
                if (!(routeMap[key].children?.length)) {
                    routerCompletions.push(routeMap[key])
                }
            }
            setDefaultRouterCompletions(routerCompletions)

            state.nestedList = payload
        },
        resetNestedList(state) {
            state.nestedList = []
        },
        setSelectPage(state, { payload }) {
            state.selectPage = payload
        },
        resetPage(state) { 
            for (let key in state) {
                if (resetPageSkipKeys.includes(key)) continue;
                
                if (key in initialState) {
                    state[key] = initialState[key]
                } else {
                    delete state[key]
                }
            }
        },
        //当前项目的页面权限相关
        setUserProjectMenuPaths(state, { payload }) {
            if (payload.isPreview) {
                user.setUserProjectMenuPaths(payload.menuPaths, true)
                state.userPreviewProjectMenuPaths = payload.menuPaths
            } else {
                user.setUserProjectMenuPaths(payload.menuPaths, false)
                state.userDevProjectMenuPaths = payload.menuPaths
            }
        },
        clearUserProjectMenuPaths(state, { payload }) {
            if (payload) {
                state.userPreviewProjectMenuPaths = null
                user.removeUserProjectMenuPaths(true)
            } else {
                state.userDevProjectMenuPaths = null
                user.removeUserProjectMenuPaths(false)
            }
        }
    }
})
//给models排序和分组
function getResetModels(list) {
    const newList = [], groupMap = {}
    list.sort((a, b) => a.componentSort - b.componentSort)
        .forEach(el => {
            if (el.componentGroup) {
                const list = groupMap[el.componentGroup]
                if (list) {
                    list.push(el)
                } else {
                    groupMap[el.componentGroup] = [el]
                }
            } else {
                newList.push(el)
            }
        })

    return [...Object.values(groupMap), ...newList]
}
//models 
export const setModelInfo = createAsyncThunk(
    'page/setModelInfo',
    async (projectId, { dispatch }) => {
        if (!projectId) return

        dispatch(setLight(true))
        Promise.all([
            ApiComponent.select({ projectId }),
            ApiComponent.select({ componentType: 'sys' })
        ]).then(([res1, res2]) => {
            const customs = getResetModels(res1)
            const systems = getResetModels(res2)

            dispatch(setModel({ customs, systems }))
            dispatch(setLight(false))
        })

    }
)
//services
export const setServiceInfo = createAsyncThunk(
    'page/setServiceInfo',
    async (pageId, { dispatch }) => {
        if (!pageId) return

        dispatch(setLight(true))
        ApiService.select({ pageId }).then(res => {
            dispatch(setServices(res))
            dispatch(setLight(false))
        })
    }
)
//nitCodes
export const setInitCodeInfo = createAsyncThunk(
    'page/setInitCodeInfo',
    async (pageId, { dispatch }) => {
        if (!pageId) return

        dispatch(setLight(true))
        ApiInitCode.select({ pageId }).then(res => {
            res.forEach(el => {
                if (el.initCodeEffect) {
                    el.initCodeEffect = JSON.parse(el.initCodeEffect)
                }
            })
            dispatch(setInitCodes(res))
            dispatch(setLight(false))
        })
    }
)
//page table, init_code table, service table, 三張表 組合成完整的 page 信息 { ...page, initCodes, services }
export const setPageInfo = createAsyncThunk(
    'page/setPageInfo',
    async (page, { dispatch }) => {
        const { pageId } = page
        if (!pageId) return

        dispatch(setLight(true))
        await Promise.all([
            ApiPage.selectOne({ pageId }),
            ApiInitCode.select({ pageId }),
            ApiService.select({ pageId })
        ]).then(res => {
            const [newPage, initCodes, services] = res
            //initCodes
            initCodes.forEach(el => {
                if (el.initCodeEffect) {
                    el.initCodeEffect = JSON.parse(el.initCodeEffect)
                }
            })
            dispatch(setInitCodes(initCodes))
            dispatch(setServices(services))
            dispatch(setPage(newPage))
        })

        dispatch(setLight(false))
    }
)

export const updatePage = createAsyncThunk(
    'page/updatePage',
    async (pageId, { dispatch }) => {
        return new Promise(resolve => {
            ApiPage.insertOrUpdate({
                pageId,
                pageDataList: JSON.stringify(designListToDataList(Bus.get(BUS_KEYS.designDataList))),
                ...Bus.get(BUS_KEYS.pageData)
            }).then(_ => {
                dispatch(resetRightAndDesignChange())
                message.success("页面保存成功！")
                resolve()
            })
        })
    }
)

export const confirmUpdatePage = createAsyncThunk(
    'page/confirmUpdatePage',
    async (pageId, { dispatch }) => {
        return new Promise(resolve => {
            Modal.confirm({
                content: '检测到数据变化，是否保存？',
                okText: '是',
                cancelText: '否',
                onOk() {
                    dispatch(updatePage(pageId)).then(resolve)
                },
                onCancel() {
                    dispatch(resetRightAndDesignChange())
                    resolve()
                }
            })
        })
    }
)

export const setSelectPageAndReplacePath = (dispatch, page) => {
    history.replace(replaceOrAddQuery({
        [currentChooseKeys.selectPage]: {
            pageId: page.pageId,
            selectedKeys: page.selectedKeys
        }
    }))

    dispatch(setSelectPage(page))
}

export const {
    setPage,
    setModel,
    setInitCodes,
    setServices,
    setLoginPage,
    resetLoginPage,
    setNestedList,
    setSelectPage,
    resetNestedList,
    resetPage,

    //当前项目的页面权限相关
    setUserProjectMenuPaths,
    clearUserProjectMenuPaths
} = pageSlice.actions;

export default pageSlice.reducer;