import React from 'react';
import ReactDOM from 'react-dom'
import { message } from 'antd';
import ApiUser from 'services/user'
import ApiPage from 'services/page';
import ApiInitCode from 'services/initcode';
import ApiService from 'services/service';
import ApiProject from 'services/project';
import ApiPlugUse from 'services/plug_use'
import config from 'config';
import history from './history';
import UserAvatarImg from 'imgs/user.png'
import user, { UserType } from './user';
import Freedomen from 'freedomen';
import axios from 'axios';
import { ComponentType, PropType } from 'views/light/types';
import { dataListToDesignList, getPageMenuOption, getPageRouteIdPathMap, getPageRouteMap } from 'views/light/utils/util';
import { toClass, toHook, toPageLess, toService } from 'views/light/utils/icode';
import qs from 'qs'
import Bus, { BUS_KEYS } from 'views/light/bus';
import { paramsKeyPrefix } from 'views/light/config';

const relativePath = "/dist/index.js"

const packages = {
    'react': React,
    'react-dom': ReactDOM
}

const getParsedModule = (code) => {
    const module = { exports: {} }
    const require = (name) => {
        return packages[name]
    }
    Function('require, exports, module, React', code)(require, module.exports, module, React)

    return module.exports
}

export function getCode(codeName) {
    return axios.get(`${config.componentBaseUrl}/${codeName}`)
}

export function parseURLParams(search = history.location.search) {
    return qs.parse(search, { ignoreQueryPrefix: true })
}

const componentCacheKeys = []
/**
 * 加载并且注册组件, 暂时只能加载非容器类组件
 * @param {[{plugType, plugUid, plugTypeName, plugTname, plugProps}]} components 
 * @param {true} callback, 加载完成，true/false 成功或者失败
 */
export function loadComponents(components = [], callback = () => { }) {
    const gets = []

    for (let i = 0; i < components.length; i++) {
        const { plugUid, plugUseName, plugUseType } = components[i]

        if (!componentCacheKeys.includes(plugUid)) {
            componentCacheKeys.push(plugUid)
            gets.push(axios.get(`${config.componentBaseUrl}/${plugUid}${relativePath}`)
                .catch(_ => {
                    message.error((plugUseName || plugUseType) + "组件加载失败，其相关信息将被跳过，若需要使用，可以联系管理员！", 5)
                }))
        }
    }

    Promise.all(gets).then(res => {
        for (let i = 0; i < res.length; i++) {
            const component = components[i]

            const { default: Component } = getParsedModule(res[i].data);

            Freedomen.registerRender(
                component.plugUseType || component.plugTname,
                ({ value, $base: { placeholder, style, className, onChange, disabled, children, onEvent, config, shouldUpdate, ...rest } }) => {
                    shouldUpdate(() => true)

                    const events = {}
                    if (Array.isArray(component.plugCustomProps)) {
                        for (let i of component.plugCustomProps) {
                            if (i.type === PropType.fn) {
                                events[i.prop] = (value) => onEvent(i.prop, value)
                            }
                        }
                    }

                    return <Component
                        style={style}
                        value={value}
                        config={config}
                        disabled={disabled}
                        className={className}
                        children={children}
                        onChange={onChange}
                        placeholder={placeholder}
                        {...events}
                        {...rest}
                    />
                },
                component.plugType === ComponentType.container
            )
        }
        callback(true)
    }).catch(_ => {
        callback(false)
    })
}

export function isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}
//清除数据中的reactElement对象
export const getUpdateNestedParams = (arr) => {
    let newArr = []
    for (let item of arr) {
        if (isPlainObject(item)) {
            let newItem = {
                pageId: item.pageId
            }
            if (item.children) {
                newItem.children = getUpdateNestedParams(item.children)
            }
            newArr.push(newItem)
        }
    }
    return newArr
}

function needGuest(path) {
    if (user.getToken()) {
        history.push(path)
    } else {
        ApiUser.getGuestToken().then(res => {
            user.setToken(UserType.Guest, res)

            history.push(path)
        })
    }
}

export function toLib() {
    needGuest('/lib')
}
//去示例页面
export function toExample() {
    needGuest('/example')
}
//去示例页面
export function toIssueList() {
    needGuest('/issue/list?pageNo=1')
}
//to doc/freedomen
export function toFreedomenDoc() {
    needGuest('/doc/freedomen/introduce')
}
//到我的项目页面
export function toProject() {
    if (user.getRoleType() === UserType.User) {
        history.push('/project')
    } else {
        message.info('请先登录后继续访问!')
        history.push('/light/in?type=login&from=/project')
    }
}
//到设计页面
export function toDesign(project) {
    history.push(`/light/design?projectId=${project.projectId}&mpId=${project.masterplateProject.masterplateProjectId}`)
}
/**
 * 是否可以下一步
 * @param {没登录操作提示} tipText 
 * @param {登录后去的路径，没有就从来，回哪里去}nextPathName
 * @returns 
 */
export function canDoNext(tipText, nextPathName) {
    if (user.getRoleType() === UserType.User) {
        if (nextPathName) {
            history.push(nextPathName)
        }
        return true
    } else {
        const { pathname, search } = history.location
        let path = '/light/in?type=login&from=' + (nextPathName || pathname)
        if (search && !nextPathName) {
            path += search
        }
        message.info(tipText)
        history.push(path)
    }
}

export function getUserAvatar(userAvatar) {
    if (userAvatar) {
        return `${config.imageBaseUrl}/${userAvatar}`
    } else {
        return UserAvatarImg
    }
}

export function downloadProject(project, callback) {
    const { projectId } = project

    const getPageCode = (grammer, pageDesignList, page) => {
        if (grammer === 'class') {
            return toClass(pageDesignList, page)
        } else {
            return toHook(pageDesignList, page)
        }
    }

    const getService = (pageDesignList, page) => {
        return toService(page, pageDesignList)
    }

    const getStyle = (page) => {
        return toPageLess(page)
    }

    ApiPage.select({ projectId }).then(res => {
        const pageIds = []
        for (let page of res) {
            pageIds.push(page.pageId)
        }
      
        Promise.all([
            ApiPage.selectNested({ projectId }),
            ApiPlugUse.selectByProjectId(projectId)
        ]).then(([nestedPages, clist]) => {
            //api selectNested
            const pageRouteIdPathMap = getPageRouteIdPathMap(getPageRouteMap(nestedPages))
            Bus.set(BUS_KEYS.pageMenuOptions, getPageMenuOption(nestedPages, pageRouteIdPathMap))
            
            //api selectByProjectId
            Bus.set(BUS_KEYS.componentList, clist)

            Promise.all([
                ApiInitCode.selectByPageIds(pageIds),
                ApiService.selectByPageIds(pageIds)
            ]).then(resp => {
                const [allInitCode, allService] = resp
                allInitCode.forEach(el => {
                    if (el.initCodeEffect) {
                        el.initCodeEffect = JSON.parse(el.initCodeEffect)
                    }
                })
                const pages = res.map(page => {
                    page.initCodes = allInitCode.filter(el => el.pageId === page.pageId)
                    page.services = allService.filter(el => el.pageId === page.pageId)
                    let pageDesignList = page.pageDataList ? dataListToDesignList(JSON.parse(page.pageDataList)) : ''

                    return {
                        pageId: page.pageId,
                        code: getPageCode(project.masterplateProject?.grammer, pageDesignList, page),
                        service: getService(pageDesignList, page),
                        style: getStyle({
                            designList: pageDesignList,
                            pageClass: page.pageClass,
                            pageLess: page.pageLess
                        })
                    }
                })
                Bus.set(BUS_KEYS.componentList, [])
                
                ApiProject.down({ projectId, pages }, project.projectName).then(callback)
            })
        })
    })
}

export const replaceOrAddQuery = (params = {}, clearL2fKey = false, location = history.location) => {
    let query = ''
    const { search, pathname } = location
    const preSearchParams = parseURLParams(search)

    if (clearL2fKey && preSearchParams) {
        for (let key in preSearchParams) {
            if (key.includes(paramsKeyPrefix)) {
                delete preSearchParams[key]
            }
        }
    }
    const newQuery = { ...preSearchParams, ...params }
    if (Object.keys(newQuery).length) {
        query += "?" + qs.stringify(newQuery)
    }
    return pathname + query
};

export const getRouterPath = (params = {}, location = history.location) => {
    let query = ''
    const { pathname } = location

    if (Object.keys(params).length) {
        query += "?" + qs.stringify(params)
    }
    return pathname + query
}

//获取全局数据中的常量名 
export function getConstNameByStr(str = '') {
    const result = []
    if (str) {
        const arr = str.split('const ')

        if (arr.length < 2)
            return result

        for (let item of arr) {
            const [name] = item.split('=')
            if (name) {
                result.push(name.trim())
            }
        }
    }
    return result
}

export function getChannel(key = "channel") {
    return new BroadcastChannel(key)

} 