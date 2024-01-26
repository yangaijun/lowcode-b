import { IRegionColumnItemProps } from "./type";
export interface permissionParams {
    column: IRegionColumnItemProps;
    value: any;
    data: Record<any, any>;
}
export declare type ParamsType = (params: permissionParams) => boolean;
/**
 * 用户全局设置元素是否加载（权限）
 * @param {函数} fn
 */
export declare function setPermission(fn: (params: permissionParams) => boolean): void;
/**
 * 清楚权限
 */
export declare function clearPermission(fn: ParamsType): void;
/**
 * 是否有权限, default true
 */
export declare function hasPermission(params: permissionParams): boolean;
/**
 * 用户全局设置元素是否禁用（权限）
 */
export declare function setDisabled(fn: ParamsType): void;
/**
 * 清楚禁用
 */
export declare function clearDisabled(fn: ParamsType): void;
/**
 * 是否禁用
 */
export declare function isDisabled(params: permissionParams): boolean;
