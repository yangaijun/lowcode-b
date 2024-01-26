import { useCallback, useEffect, createElement, useMemo, useState, useRef, isValidElement } from 'react'
import Freedomen, { Form, FormList, Search, Table, Dialog, Drawer, Region, List, PermissionContext } from 'freedomen'
import { getFnContainer, isComponent, isContainer, isPlainObject, addParamsKeyPrefix, getSplitParams, getEventItemString, getPreviewData, getPreviewValue, toFirstUpperCase } from 'views/light/utils/util'
import { ConfigProvider, Divider, message, Modal, Spin, Tabs } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { axiosCall } from 'views/light/utils/iapi'
import { DesignType, InitCodeType } from 'views/light/types'
import { replaceInstructStr, toInitCodeStates, toPageLess } from 'views/light/utils/icode'
import { createPreviewStyleFromLessString, deletePreviewStyle } from './lessUtil'
import { getConstNameByStr, loadComponents, parseURLParams, replaceOrAddQuery } from 'libs/utils'
import { setPageInfo, setSelectPage, setUserProjectMenuPaths } from 'slices/pageSlice'
import { useDebounceEffect } from 'ahooks';
import { getIconByValue } from '../../panel/component/icons'
import { currentChooseKeys } from 'views/light/config'
import Bus, { BUS_KEYS } from 'views/light/bus'
import Name from 'views/light/utils/models/name'
import update from 'immutability-helper'
import history from 'libs/history'
import { uniqueId } from 'lodash'
import * as util from './utils'
import cn from 'classnames'
import user from 'libs/user'
import './index.less'

const defaultHistoryKey = "dpreviewh"
const excuteErrorTip = '代码执行失败，请查看控制台：'
const $localStorage = user.getUserStorage()
//util use in eval
const $util = util,
    //项目的全局数据 put in here
    $global = {},
    //页面api
    $api = {},
    //项目母版配置数据,只有setFreedomenConfig时会用到
    $current = {},
    //与系统交互，如获取页面信息
    $sys = {}

/** 第一层的  ~less 不能去， 去掉的是config中的 ~ */
function resetData(data, isNext) {
    let obj = {}
    for (let key in data) {
        if (isPlainObject(data[key])) {
            obj[key] = resetData(data[key], true)
        } else if (isNext && key.indexOf('~') === 0) {
            continue
        } else {
            obj[key] = data[key]
        }
    }
    return obj
}


function setFreedomenGlobalData(project) {
    const masterplateProjectData = project?.masterplateProject?.masterplateProjectData

    if (masterplateProjectData) {
        const constNames = getConstNameByStr(masterplateProjectData)
        //挂载到 $global
        let fnAppend = ''
        for (let item of constNames) {
            fnAppend += `$global.${item} = ${item};`
        }
        if (fnAppend) {
            new Function('$global', masterplateProjectData + ";" + fnAppend)($global)
        }
    }
}

function setCurrentConfig(project) {
    $current.baseURL = project?.masterplateProject?.masterplateProjectBaseUrl
    $current.tokenName = project?.masterplateProject?.masterplateProjectTokenName
    $current.contentType = project?.masterplateProject?.masterplateProjectContentType
    $current.projectName = project?.projectName
}
//freedomen风格组件  
const freedomenMaps = { Form, Search, Table, Region, List, FormList }
//其他组件
const originMaps = { "DIV": 'div' }

const allMaps = {
    ...freedomenMaps,
    ...originMaps
}

const amendRecord = (column) => {
    for (let key in column) {
        if (isValidElement(column[key]) || /^[A-Za-z]+$/.test(column[key])) continue

        if (isPlainObject(column[key])) {
            amendRecord(column[key])
        } else {
            try {
                if (key === 'prop') {
                    column[key] = String(column[key])
                } else if (typeof column[key] === 'string') {
                    column[key] = getPreviewValue(column[key], { $global, $api, $util, $sys, $localStorage })
                }
            } catch (e) { }
        }
    }
}
//对column其进行处理一下
const amendColumns = (columns) => {
    for (let column of columns) {
        //Button 中的icon
        if (column.config?.icon && typeof column.config?.icon === 'string') {
            let Icon = getIconByValue(column.config?.icon)

            column.config.icon = <Icon />
        }
        //Space中的分割线， 暂时只有一个
        if (column.config?.split) {
            column.config.split = <Divider type="vertical" />
        }

        if (Array.isArray(column)) {
            amendColumns(column)
        } else {
            amendRecord(column)
            column.className = column.className || column[`~className`]
        }

    }
}
//保存一下FDialog 的Form
var keyPrefix = 0
var dialogForms = {}
var dialogNames = []
var drawerForms = {}
var drawerNames = []
const mounted = 1

function getEventString(base, data) {
    let events = ""

    const addEvent = (strFn, prop, type) => {
        const content = getFnContainer(strFn)
        if (content) {
            events += getEventItemString({
                ifOrElse: events ? 'else if' : 'if', prop, type, content
            })
        }
    }
    //table 的排序，特殊处理
    if (data['@sorter'] && data.prop) {
        addEvent(data['@sorter'], data.prop, 'sorter')
    }
    //普通事件
    for (let propItem of base) {
        if (propItem.prop?.indexOf('@') === 0) {
            addEvent(data[propItem.prop], data.prop, propItem.prop)
        }
    }
    return events
}
//比较是否相等
function equals(val1, val2) {
    return JSON.stringify(val1) === JSON.stringify(val2)
}

const defaultClearKeys = ['~className', '~less', '~isVertical']
function getClearKeys(obj, ...keys) {
    const newObject = { ...obj }

    keys.forEach(key => {
        delete newObject[key]
    })
    return newObject
}
//将变量挂载到window 的 $var 上
const setWindowState = (virData) => {
    if (!window.$var) {
        window.$var = {}
    }
    for (let key in virData) {
        window.$var[key] = virData[key]
    }
}

export const previewTypes = {
    'design': 1, //设计时预览
}

export default function Preview(props) {
    const [messageApi, msgContextHolder] = message.useMessage();
    const [modalApi, modalContextHolder] = Modal.useModal();

    function showError(text, e) {
        if (e?.message) {
            messageApi.error(text + e.message, 6)
        } else {
            console.log("失败信息：", e)
            messageApi.error(text + "请打开控制台查看")
        }
    }

    function setFreedomenConfigs(project) {
        const masterplateProjectFreedomenConfig = project?.masterplateProject?.masterplateProjectFreedomenConfig
        if (masterplateProjectFreedomenConfig) {
            let clazz, config, style, rule, isDisabled, hasPermission

            const freedomen = {
                setDefaultConfigs(c) {
                    config = c
                    Freedomen.setDefaultConfigs(config)
                },
                setDefaultStyles(s) {
                    style = s
                    Freedomen.setDefaultStyles(style)
                },
                setDefaultClasses(c) {
                    clazz = c
                    Freedomen.setDefaultClasses(clazz)
                },
                registerRules(r) {
                    rule = r
                    Freedomen.registerRules(rule)
                },
                setDisabled(fn) {
                    isDisabled = fn
                },
                setPermission(fn) {
                    hasPermission = fn
                }
            }
            try {
                new Function('Freedomen', '$util', '$current', '$sys', '$localStorage', masterplateProjectFreedomenConfig)(freedomen, $util, $current, $sys, $localStorage)
            } catch (e) {
                messageApi.error('Freedomen 配置失败：' + e)
            }

            return { clazz, config, style, rule, isDisabled, hasPermission }
        }
        return {}
    }

    //"{backgroundColor: 'white'}" => { backgroundColor: 'white' }
    const getStyleFromString = (type, styleString) => {
        let style = void 0
        try {
            style = eval('(' + styleString + ')')
        } catch (error) {
            messageApi.error(type + '样式格式解析出错！')
        }
        return style;
    }

    const getElementType = (type) => {
        let elType = allMaps[type]
        if (!elType) {
            messageApi.error('不存在的类型：' + type)
        }
        return elType
    }

    const $modal = {
        message: {
            success(msg) { messageApi.success(msg) },
            error(msg) { messageApi.error(msg) },
            warning(msg) { messageApi.warning(msg) },
            info(msg) { messageApi.info(msg) },
            loading(msg) { messageApi.loading(msg) }
        },
        confirm(params) { modalApi.confirm(params) },
        warning(params) { modalApi.warning(params) },
        error(params) { modalApi.error(params) },
        success(params) { modalApi.success(params) },
        info(params) { modalApi.info(params) }
    }



    const { designList, className, historyKey, type } = props
    const virHistoryKey = historyKey || defaultHistoryKey
    const { rightFormChange, designListChange } = useSelector(state => state.event)
    const { hasPermission } = useSelector(state => state.temporary)
    const page = useSelector(selector => selector.page)
    const project = useSelector(state => state.project)
    const routerState = parseURLParams();
    const { designType } = routerState;
    const { initCodes, services } = page
    const { pageClass, pageStyle, pageLess } = page
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [pageLoading, setPageLoading] = useState(false)
    const [virData, setVirData] = useState({})
    const [virEffect, setVirEffect] = useState([])
    const [virCallback, setVirCallback] = useState([])
    const [permissionValue, setPermissionValue] = useState({})
    const [reload, setReload] = useState()

    const shouldSave = useMemo(() => designListChange.uuid !== null && hasPermission, [designListChange.uuid, hasPermission])

    const classPrefix = useMemo(() => {
        if (page.pageId) {
            return `preiview_${page.pageId}_`
        }
    }, [page.pageId])

    const dispatch = useDispatch()
    //用户设置菜单权限
    $util.setUserMenuPaths = (menuPaths) => {
        if (Array.isArray(menuPaths)) {
            dispatch(setUserProjectMenuPaths({ menuPaths, isPreview: !!props.historyPush }))
        } else {
            showError("setUserMenuPaths的参数应该为字符串数组！", menuPaths)
        }
    }
    //设计页面加载中
    $util.setPageLoading = (loading = true) => {
        setPageLoading(loading)
    }
    //系统
    $sys.pageMenuOptions = Bus.get(BUS_KEYS.pageMenuOptions)

    const domRefs = useRef({})
    const dataRef = useRef({
        loading: true,
        lock: false,
        //$set后可能会执行effect，对应变化的name
        willEffectName: mounted,
        virEffect: null,
        currentPath: null,
        timeouts: [],
        intervals: [],
        isFromHistory: false,
        isUpdate: false,
    })
    dataRef.current.shouldSave = shouldSave
    //页面className
    const pvPageClass = useMemo(() => {
        return pageClass && classPrefix ? classPrefix + pageClass : null
    }, [pageClass, classPrefix]) 
    //设计中小窗口预览时，数据更改要时时更新
    useDebounceEffect(() => {
        if (dataRef.current.isUpdate && type === previewTypes.design) {
            setReload(rightFormChange)
        } else {
            dataRef.current.isUpdate = true
        }
    }, [type, rightFormChange], { wait: 600 })

    useEffect(() => {
        const rjction = (event) => {
            showError("预览提示：捕获到异步函数异常：", event.reason)
            console.log(event.reason)
            event.preventDefault();
        }
        window.addEventListener('unhandledrejection', rjction);
        return () => {
            window.removeEventListener('unhandledrejection', rjction)
        }
    }, [])

    /************************************************ eval 中使用 ***************************************************/
    const { vir } = getSplitParams(routerState)
    const $history = {
        state: vir,
        push(path, params, isBack = false) {
            if (dataRef.current.shouldSave) {
                messageApi.error("页面跳转失败，请先保存页面！")
                return
            }

            dataRef.current.isFromHistory = true
            const addHistory = () => {
                //不是后退
                if (!isBack) {
                    user.pushVirHistory(virHistoryKey, { path: dataRef.current.currentPath, params: this.state })
                }
            }
            //项目预览体系
            if (props.historyPush) {
                addHistory()
                return props.historyPush(path, params)
            }

            const nextPage = Bus.get(BUS_KEYS.routeMap)?.[path]
            if (nextPage) {
                modalApi.confirm({
                    content: '是否跳转到 ' + nextPage.pageName,
                    onOk() {
                        addHistory()

                        dispatch(setPageInfo(nextPage))
                        const selectPage = {
                            pageId: nextPage.pageId,
                            selectedKeys: [nextPage.pageId]
                        }
                        dispatch(setSelectPage(selectPage))
                        history.replace(
                            replaceOrAddQuery({
                                ...routerState,
                                ...addParamsKeyPrefix(params),
                                [currentChooseKeys.selectPage]: selectPage
                            }, true)
                        )
                    }
                })
            } else {
                modalApi.confirm({
                    content: '跳转失败，未发现此路由： ' + path
                })
            }
        },
        replace(path, params) {
            $history.push(path, params)
        },
        go(n) {
            let hs = user.getVirHistory(virHistoryKey)

            if (typeof n === 'number') {
                if (hs) {
                    let index = hs.length + n;
                    let next = hs[index]
                    if (next) {
                        const resetHistory = () => {
                            hs.splice(index, Math.abs(n))
                            user.setVirHistory(virHistoryKey, hs)
                        }

                        let promise = $history.push(next.path, next.params, true)
                        if (promise instanceof Promise) {
                            promise.then(resetHistory)
                        } else {
                            resetHistory()
                        }
                        return
                    }
                }
                messageApi.info("后退失败！可能原因：没有可后退页面、页面被手动刷新、手动重新选择了菜单");
            } else {
                messageApi.info("参数错误，请使用负整数！" + n);
            }
        }
    }
    //設置數據
    const $set = useCallback((name, data) => {
        setVirData((pre) => {
            if (name && !(name in pre)) {
                messageApi.error("set" + toFirstUpperCase(name) + "方法不存在，建议检查代码")
            }

            const newVirData = update(pre, {
                [name]: { $set: data }
            })
            dataRef.current.willEffectName = name
            setWindowState(newVirData)
            return newVirData
        })
    }, [])

    const $ref = domRefs.current
    const $dialog = {
        open(name, props, data) {
            if (!dialogNames.includes(name)) {
                modalApi.confirm({
                    type: 'error',
                    title: '系统提示',
                    content: '未找到对话框' + name + '，请检查是否拼写错误！'
                })
                return
            }
            if (dialogForms[name]) {
                Dialog.open(name, props).then(s => {
                    s(dialogForms[name](data))
                })
            } else {
                Dialog.open(name, props)
            }
        },
        close(name) {
            Dialog.close(name)
        },
        loading(name, l) {
            Dialog.loading(name, l)
        }
    }
    const $drawer = {
        open(name, props, data) {
            if (!drawerNames.includes(name)) {
                modalApi.confirm({
                    type: 'error',
                    title: '系统提示',
                    content: '未找到对话框' + name + '，请检查是否拼写错误！'
                })
                return
            }
            if (drawerForms[name]) {
                Drawer.open(name, props).then(s => {
                    s(drawerForms[name](data))
                })
            } else {
                Drawer.open(name, props)
            }
        },
        close(name) {
            Drawer.close(name)
        },
        loading(name, l) {
            Drawer.loading(name, l)
        }
    }
    /******************************* eval 中使用结束 *********************************/
    const getPrecode = (initCodes, designList) => {
        const data = {}, effect = [], callback = [], ref = {}

        const resetInitCodeValueTemp = (value) => {
            let temp = window.$temp
            if (!value || !temp || !isPlainObject(temp)) return value
            const structs = []
            for (let key in temp) {
                structs.push([`$temp.${key}`, temp[key]])
            }

            return replaceInstructStr(value, structs)
        }
        const getItemValue = (value) => {
            return getPreviewValue(value || '', { $global, $api, $util, $sys, $history, $localStorage })
        }

        for (let code of initCodes.concat(toInitCodeStates(designList))) {
            const iCode = { ...code, initCodeValue: resetInitCodeValueTemp(code.initCodeValue) }

            if (iCode.initCodeType === InitCodeType.VAR) {
                data[iCode.initCodeName] = getItemValue(iCode.initCodeValue)
            } else if (iCode.initCodeType === InitCodeType.FN) {
                callback.push(iCode)
            } else if (iCode.initCodeType === InitCodeType.REF) {
                ref[iCode.initCodeName] = getItemValue(iCode.initCodeValue)
            } else {
                effect.push(iCode)
            }
        }
        return { data, effect, callback, ref }
    }
    //in string function
    const setTimeout = (...params) => {
        let id = window.setTimeout(...params)
        dataRef.current.timeouts.push(id)

        return id
    }
    const setInterval = (...params) => {
        let id = window.setInterval(...params)
        dataRef.current.intervals.push(id)

        return id
    }
    //执行字符串
    const excuteStringFunction = (funString) => {
        try {

            const fn = eval('(' + funString + ')')
            fn();

        } catch (e) {
            showError(excuteErrorTip, e)
            console.log('[in]::' + funString)
        }
    }
    //初始化下数据
    useEffect(() => {
        dataRef.current.willEffectName = mounted
        //清空一下Form
        dialogNames = []
        dialogForms = {}
        drawerNames = []
        drawerForms = {}
        //更新keyPrefix
        keyPrefix = uniqueId()
        //当前页面路径
        dataRef.current.currentPath = Bus.get(BUS_KEYS.routeIdPath)?.[page.pageId]

        for (let i of dataRef.current.timeouts) {
            clearTimeout(i)
        }
        dataRef.current.timeouts.length = 0

        for (let i of dataRef.current.intervals) {
            clearInterval(i)
        }
        dataRef.current.intervals.length = 0

        if (dataRef.current.isFromHistory) {
            dataRef.current.isFromHistory = false
        } else {
            user.clearVirHistory(virHistoryKey)
        }
    }, [page.pageId])
    //更新访问接口API
    useEffect(() => {
        const mp = project.masterplateProject
        const newApis = {}, baseUrl = mp?.masterplateProjectBaseUrl, tokenName = mp?.masterplateProjectTokenName, contentType = mp?.masterplateProjectContentType
        const mock = (info, show) => {
            return (new Promise(resolve => {
                window.setTimeout(() => {
                    show && messageApi.info(info)
                    resolve({})
                }, 100);
            }))
        }

        for (let service of services) {
            newApis[service.serviceName] = function (params) {
                if (Number(designType) === DesignType.MASTERPLATE) {
                    return mock("母版模式接口无法访问，访问的接口自动返回空对象 {}", true)
                } else if (!baseUrl) {
                    return mock("请在项目母版中配置 服务器基本路径 后api才可以使用，当前返回空对象 {}", user.getUserProjectBaseUrlTip())
                }
                return axiosCall(baseUrl + "/" + service.serviceUrl, params, { tokenName, contentType, responseType: service.serviceResponseType }, service.serviceMethod, messageApi)
            }
        }
        Object.assign($api, newApis)
    }, [services, designType, project.masterplateProject])
    //useEffect(() => {}, [all var])
    useEffect(() => {
        if (dataRef.current.lock || loading) return

        const willEffectName = dataRef.current.willEffectName
        //需要重新更新的callback
        const willEffectCallBackNames = virCallback.filter(el => el.initCodeEffect?.includes(willEffectName))
            .map(el => el.initCodeName)

        if (willEffectName || willEffectCallBackNames.length) {
            const excuteVirEffect = virEffect.filter(el => el.initCodeEffect?.some(name => {
                return willEffectName === name || willEffectCallBackNames.includes(name)
            }))
            dataRef.current.lock = true
            for (let item of excuteVirEffect) {
                excuteStringFunction(item.initCodeValue)
            }
            dataRef.current.lock = false
        }
    }, [virEffect, virCallback, virData, loading])

    useEffect(() => {
        //设计全局数据
        setFreedomenGlobalData(project)
        setCurrentConfig(project)
        //Freedomen 设置清除相关
        const { clazz, config, style, rule, isDisabled, hasPermission } = setFreedomenConfigs(project)
        setPermissionValue({ isDisabled, hasPermission })

        return () => {
            deletePreviewStyle()

            Freedomen.removeRules(rule)
            Freedomen.clearDefaultClasses(clazz)
            Freedomen.clearDefaultConfigs(config)
            Freedomen.clearDefaultStyles(style)
        }
    }, [project])

    useEffect(() => {
        const loadComp = () => {
            //加载自定义组件
            loadComponents(Bus.get(BUS_KEYS.componentList), () => {
                if (!dataRef.current.loading) {
                    setList(list => [...list])
                } else {
                    setLoading(false)
                    dataRef.current.loading = false
                }
            })
        }

        loadComp()
        const key = Bus.on(BUS_KEYS.componentList, loadComp)
        return () => { Bus.remove(key) }
    }, [])
    //将函数挂载到window的 $fn 上，位置不能到上面，因为以 eval 执行，会用到上面很多函数、变量
    const setWindowCallback = (virCallback) => {
        if (!window.$fn) {
            window.$fn = {}
        }
        for (let item of virCallback) {
            window.$fn[item.initCodeName] = eval('(' + item.initCodeValue + ')')
        }
    }
    //更新设计器
    useEffect(() => {
        if (!classPrefix) return
        //将less转成css, 来加载显示 , designList 每项中的 data 司时会加 ~className，此处并不合理，如有机会重构 
        createPreviewStyleFromLessString(toPageLess({ designList, pageClass, pageLess }, classPrefix), classPrefix, reload)
        //加载数据
        const { data, effect, callback, ref } = getPrecode(initCodes, designList)
        //将数据挂载到虚拟机
        setVirData(data)
        //將數據放到window.$var上;
        setWindowState(data)
        //影响函数挂载到虚拟机上 
        if (!equals(effect, dataRef.current.virEffect)) {
            dataRef.current.virEffect = effect
            setVirEffect(effect)
        }
        //设计列表
        setList(designList)
        //将函数挂载到虚拟机
        setVirCallback(callback)
        //ref 挂载
        Object.keys(ref).forEach(key => {
            domRefs.current[key] = ref[key]
        })
        //将函数挂载到window.$fn上
        setWindowCallback(callback)
        //设计预览数据更新，修改初始key使用重新加载
        if (type === previewTypes.design) {
            keyPrefix = uniqueId()
        }
        //不要加上其它依赖，会多执行一次，导致很多问题，只要执行一次这里切记
        //designList 变化，那么其它一定已经先变化过了，设计上的缺陷。将page和designList 都合成 props 传过来，成为同步，不然多执行一次。
    }, [designList, reload, type])
    //将虚拟数据挂载到windown上。访问直接访问变量名 undefined, 因为多了一层虚拟机, useEffect(() => {}, [])
    useEffect(() => {
        if (loading) return

        const excuteEffect = virEffect => {
            for (let i of virEffect) {
                excuteStringFunction(i.initCodeValue)
            }
        }
        window.setTimeout(() => {
            //取出没有依赖的，要全部执行，相当于mounted 
            if (dataRef.current.willEffectName === mounted) {
                excuteEffect(virEffect)
            } else {
                excuteEffect(virEffect.filter(el => !el.initCodeEffect))
            }
        });
    }, [virEffect, loading])

    const resolveChildren = useCallback(({ children = [], type }) => {
        let columns = [], event = ''
        for (let i = 0; i < children.length; i++) {
            const child = children[i]
            const data = resetData(getPreviewData(child.data, { $global, $api, $util, $sys, $history, $localStorage }))

            if (isComponent(child)) {
                columns.push({
                    ...data,
                    render({ value }) {
                        let _value = value
                        if (_value === void 0 && data.data) {
                            _value = data.data
                        }

                        return createElement(
                            getElementType(child.type),
                            getProps({ ...child, type: child.type, data: data }, _value)
                        )
                    }
                })
            } else if (isContainer(child)) {
                const childrenInfo = resolveChildren({ children: child.children, type: child.type })
                childrenInfo.columns.push({ type: data.type || child.type, ...data })
                event += getEventString(child.props.base, data)

                if (type === 'Table' && child.type !== 'tablecolgroup' || type === 'tablecolgroup' && child.type !== 'tablecolgroup') {
                    amendColumns(childrenInfo.columns)

                    columns.push({
                        ...data,
                        render: () => childrenInfo.columns
                    })
                    event += childrenInfo.event
                } else {
                    columns.push(childrenInfo.columns)
                    event += childrenInfo.event
                }
            } else {
                const column = {
                    ...data,
                    type: data.type || child.type
                }
                event += getEventString(child.props.base, data)
                columns.push(column)
            }
        }
        //"function () {}..." => () => {} 
        amendColumns(columns)
        return { columns, event }
    }, [virData])
    /**
     * item.type: 组件类型DIV, Form, ... 
     */
    const getProps = useCallback((item, sourceData, key) => {
        const { type, data } = item
        const props = {}
        //都有的属性
        if (key !== void 0) {
            props.key = keyPrefix + "_" + key
        }
        if (data.ref) {
            props.ref = (ref) => {
                domRefs.current[data.ref] = ref
            }
        }
        //Tabs
        if (data.activeKey) {
            props.activeKey = item.data.activeKey
        }
        props.className = item.data.className || item.data['~className']
        props.style = getStyleFromString(type, data.style)
        //DIV 只有上面的属性 
        if (type !== "DIV" && type !== 'Tabs') {
            let { columns, event } = resolveChildren(item)

            //data里的 event 目前主要是搞table里的
            for (let key of Object.keys(data)) {
                if (key.indexOf('@') === 0) {
                    event += getEventItemString({
                        prop: key,
                        content: getFnContainer(data[key]),
                        ifOrElse: event ? 'else if' : 'if'
                    })
                }
            }
            //共有的
            props.columns = columns
            props.data = sourceData
            props.onEvent = (params) => {
                try {
                    const result = eval(`() => {${event}}`)()
                    return result
                } catch (e) {
                    showError('事件 执行失败：', e)
                }
            }
            if (data.onChange) {
                //不要用data.onChange, 有局部变量data
                const { onChange } = data
                props.onChange = (data) => {
                    try {
                        eval(getFnContainer(onChange, "(data)=>{"))
                    } catch (e) {
                        showError('change事件 执行失败：', e)
                    }
                }
            }
            if (data.config) {
                props.config = data.config
            }
            //table 分页
            if ('isPagination' in data) {
                props.pagination = data.isPagination ? data.pagination : false
            }
            //表单提交
            if ('submit' in data) {
                //不要用data.onChange, 有局部变量data
                const { submit } = data
                props.onSubmit = (data, column) => {
                    let fns = getFnContainer(submit, '(data)=>{')
                    if (!fns) {
                        fns = getFnContainer(submit, '(data,column)=>{')
                    }

                    try {
                        const result = eval(`() => {${fns}}`)()
                        return result
                    } catch (e) {
                        showError('提交事件 执行失败：', e)
                    }
                }
            }
        }
        return props;
    }, [keyPrefix, resolveChildren])
    //解析设计器为页面元素
    const createElements = useCallback((children, getName, virData) => {
        return children?.map((item, index) => {
            const data = getPreviewData(item.data, { $global, $api, $util, $sys, $history, $localStorage })

            delete data['~isVertical']
            const type = item.type

            if (['FDialog', 'Dialog', 'FDrawer', 'Drawer'].includes(type)) {
                const { name } = data
                let currentNames, currentForms, Dom

                if (['FDialog', 'Dialog'].includes(type)) {
                    currentNames = dialogNames
                    currentForms = dialogForms
                    Dom = Dialog
                } else {
                    currentNames = drawerNames
                    currentForms = drawerForms
                    Dom = Drawer
                }

                currentNames.push(name)

                if (data.footer === 'null') {
                    data.footer = null
                } else if (data.footer === '') {
                    delete data.footer
                }
                const events = {}
                //ok事件
                if (data.onOk) {
                    events.onOk = () => {
                        try {
                            const result = eval(`() => {${getFnContainer(data.onOk, '()=>{')}}`)()
                            return result
                        } catch (e) {
                            showError('提交事件 执行失败：', e)
                        }
                    }
                }
                //取消事件
                if (data.onCancel) {
                    events.onCancel = () => {
                        try {
                            const result = eval(`() => {${getFnContainer(data.onCancel, '()=>{')}}`)()
                            return result
                        } catch (e) {
                            showError('取消事件 执行失败：', e)
                        }
                    }
                }

                if (['FDialog', 'FDrawer'].includes(type)) {
                    //把dialog 中的 from 保存起来
                    currentForms[name] = (_data) => {
                        const innerType = 'Form'

                        const form = createElement(
                            getElementType(innerType),
                            getProps({ ...item, data, type: innerType }, _data)
                        )
                        return form
                    }
                }

                return <Dom key={index} name={name} {...getClearKeys(data, 'ref', ...defaultClearKeys)} {...events}>
                    {['FDialog', 'FDrawer'].includes(type) ? void 0 : createElements(item.children, getName, virData)}
                </Dom>
            } else if (type === 'Tabs') {
                const { children = [] } = item
                const events = {}

                if (data.onChange) {
                    events.onChange = (next) => {
                        try {
                            eval(getFnContainer(data.onChange, '(next)=>{'))
                        } catch (e) {
                            showError('提交事件 执行失败：', e)
                        }
                    }
                }

                const items = children.map((el, index) => {
                    const { label, tab, key, forceRender } = el.data

                    return {
                        key: key || index,
                        label: label || tab,
                        forceRender,
                        children: createElements([el], getName, virData)
                    }
                })
                return <Tabs {...getProps({ ...item, data, type: type }, data, index)} items={items} {...getClearKeys(data, ...defaultClearKeys)}  {...events} />

            } else {
                let innerData
                if (data.data || data.dataName) {
                    innerData = virData[getName(data.dataName || type.toLowerCase() + 'Data')]
                }
                const props = getProps({ ...item, data, type: type }, innerData, index)
                return createElement(
                    getElementType(item.type),
                    props,
                    Object.keys(freedomenMaps).includes(item.type)
                        ? void 0
                        : createElements(item.children, getName, virData)
                )
            }
        })
    }, [])

    if (loading) return null
    //登录页面白色背景
    const style = page?.pageType === 1 ? { background: 'white' } : {}
    //id不要去掉，项目预览有用
    return <div id="pvp" style={{ ...style, ...pageStyle }} className={cn('freedomen-page', pvPageClass, 'freedomen-layout', className)}>
        <ConfigProvider getPopupContainer={() => document.getElementById("pvp") || document.body}>
            {msgContextHolder}
            {modalContextHolder}

            <PermissionContext.Provider value={permissionValue} >
                <Spin spinning={pageLoading}>
                    {createElements(list, (new Name()).get, virData)}
                </Spin>
            </PermissionContext.Provider>
        </ConfigProvider>
    </div>
}