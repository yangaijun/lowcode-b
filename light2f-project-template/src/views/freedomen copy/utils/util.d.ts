import React from "react";
declare function notEquals(val1: any, val2: any, ...skipKeys: string[]): boolean;
declare function notEqualsArr(val1: any[] | undefined, val2: any[] | undefined, keyName: string): boolean;
declare function notEqualsChildren(val1: any, val2: any, ...skipKeys: string[]): boolean;
declare function hasFunctionObj(obj?: any): boolean;
declare function isPlainObject(obj: any): boolean;
declare function getUUID(): string;
declare function resetOptions(options: any): any[];
/**
 * 只支持数组与Object
 * @param {要拷贝的数据} data
 * @returns 新的对象
 */
declare function clone(data: any): any;
declare function dateFormat(fmt: string, date: Date): string;
export declare function splitConfig(config?: any, ridKeys?: string[]): any;
export declare function getStringLen(fullText?: string): number;
/**
 * 截职字符串
 * @param fullText 原始字符串
 * @param len 截取的长度，英文为1，中文为2， "12中" => 4; "中方" => 4; "123" => 3
 * @returns {string} //截取字符串
 */
export declare function getSubString(fullText?: string, len?: number): string | undefined;
/**
 *
 * @param target 目标
 * @param coverKeys 直接覆盖拷贝
 * @param source 资源
 * @returns
 */
export declare function objectMerge(target: any, coverKeys: string[] | null, ...source: any): any;
export declare function isUndefined(data?: any, skey?: string, split?: string): boolean | undefined;
export declare function getChainValueByString(data: any, skey: string, split?: string): any;
export declare function setChainValueByString(data: any, skey: string, value: any, split?: string): void;
export declare function resetToOtherObject(data?: any, nextData?: any): void;
export declare function getStyle(key: string, style?: React.CSSProperties): any;
export declare function getClass(key: string, className?: string): string;
export declare function getOrderKey(level: string | undefined, index: number): string;
export declare function debounce(fn: Function, wait: number, immediate?: boolean): (this: any, ...args: any[]) => void;
export declare function getArrayLastItem(columns: any[]): any;
declare const utils: {
    notEquals: typeof notEquals;
    notEqualsArr: typeof notEqualsArr;
    notEqualsChildren: typeof notEqualsChildren;
    hasFunctionObj: typeof hasFunctionObj;
    dateFormat: typeof dateFormat;
    isPlainObject: typeof isPlainObject;
    resetOptions: typeof resetOptions;
    clone: typeof clone;
    getUUID: typeof getUUID;
};
export default utils;
