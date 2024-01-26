import { IRegionColumnItemProps } from "./type"

export interface permissionParams {
    column: IRegionColumnItemProps,
    value: any,
    data: Record<any, any>
}

export type ParamsType = (params: permissionParams) => boolean

const permissionStack: ParamsType[] = []
const disabledStack: ParamsType[] = []

/**
 * 用户全局设置元素是否加载（权限）
 * @param {函数} fn 
 */
export function setPermission(fn: (params: permissionParams) => boolean) {
    if (typeof fn === 'function' && !permissionStack.find(v => fn === v)) {
        permissionStack.push(fn)
    } else {
        console.error('permission must be function')
    }
};

/**
 * 清楚权限
 */
export function clearPermission(fn: ParamsType) {
    if (!!fn) {
        const index = permissionStack.findIndex(v => v === fn)
        if (index !== -1) {
            permissionStack.splice(index, 1)
        }
    }
}

/**
 * 是否有权限, default true
 */
export function hasPermission(params: permissionParams) {
    return permissionStack.length ? permissionStack[permissionStack.length - 1](params) : true
}

/**
 * 用户全局设置元素是否禁用（权限） 
 */
export function setDisabled(fn: ParamsType) {
    if (typeof fn === 'function' && !disabledStack.find(v => fn === v)) {
        disabledStack.push(fn)
    } else {
        console.error('permission must be function')
    }
};

/**
 * 清楚禁用
 */
export function clearDisabled(fn: ParamsType) {
    if (!!fn) {
        const index = disabledStack.findIndex(v => v === fn)
        if (index !== -1) {
            disabledStack.splice(index, 1)
        }
    }
}

/**
 * 是否禁用
 */
export function isDisabled(params: permissionParams) {
    return disabledStack.length ? disabledStack[disabledStack.length - 1](params) : false
}
