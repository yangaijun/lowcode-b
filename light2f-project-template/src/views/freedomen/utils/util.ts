import React from "react";
import { getDefaultClasses } from '../config/class';
import { getDefaultStyles } from '../config/style';

function isReactElement(data: any) {
  return React.isValidElement(data)
}

const activeFnKeys = ['type', 'style', 'className', 'disabled', 'load', 'filter', 'itemStyle', 'options', 'render']

function testActiveFnKeyAndValue(key: string, value: any) {
  return (activeFnKeys.includes(key) && typeof value === 'function')
}

function stringify(val: any, testActiveFnKey: boolean, ...skipKeys: string[]) {
  return JSON.stringify(val, function (key, value) {
    if (skipKeys?.includes(key)) return null;

    if (testActiveFnKey && testActiveFnKeyAndValue(key, value)) {
      return getUUID()
    }
    //react 对象, 比较props
    if (isReactElement(value)) {
      return value.props
    }
    return value
  })
}

function notEquals(val1: any, val2: any, ...skipKeys: string[]) {
  try {
    return stringify(val1, false, ...skipKeys) !== stringify(val2, false, ...skipKeys);
  } catch (e) {
    return false;
  }
}

function notEqualsArr(val1: any[] = [], val2: any[] = [], keyName: string) {
  if (val1?.length !== val2?.length) {
    return true
  }
  for (let i = 0; i < val1.length; i++) {
    if (val1[i]?.[keyName] !== val2[i]?.[keyName]) {
      return true
    }
  }
  return false
}

function notEqualsChildren(val1: any, val2: any, ...skipKeys: string[]) {
  try {
    return stringify(val1, true, ...skipKeys) !== stringify(val2, true, ...skipKeys);
  } catch (e) {
    return false;
  }
}

function hasFunctionObj(obj: any = {}) {
  for (let key in obj) {
    if (typeof obj[key] === 'function') return true

    if (isPlainObject(obj[key])) {
      let res = hasFunctionObj(obj[key])
      if (res) return true
    }
  }
  return false
}

function isPlainObject(obj: any) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function getUUID() {
  const rand = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return rand() + rand() + rand() + rand() + rand() + rand() + rand() + rand();
}

function getKey(key: string) {
  if (/^\d+$/.test(key)) return parseInt(key);
  else return key;
}

function resetOptions(options: any) {
  let newOptions = [];
  if (isPlainObject(options)) {
    for (let key in options as Record<any, any>) {
      newOptions.push({
        value: getKey(key),
        label: options[key]
      });
    }
    return newOptions;
  } else if (typeof options === 'string') {
    let tempOptions = options.split(',');
    for (let key of tempOptions) {
      newOptions.push({
        value: getKey(key),
        label: key
      });
    }
  } else {
    newOptions = options as any[] || [];
  }
  return newOptions;
}
/**
 * 只支持数组与Object
 * @param {要拷贝的数据} data 
 * @returns 新的对象
 */
function clone(data: any): any {
  if (Array.isArray(data)) {
    let newArr = [];
    for (let value of data) {
      newArr.push(clone(value));
    }
    return newArr;
  } else if (isPlainObject(data)) {
    let model: any = {};
    for (let item in data) {
      if (data[item] instanceof Array) {
        model[item] = clone(data[item])
        //react element不copy
      } else if (isPlainObject(data[item]) && !isReactElement(data[item])) {
        model[item] = clone(data[item])
      } else {
        model[item] = data[item];
      }
    }
    return model;
  } else {
    return data
  }
}

function dateFormat(fmt: string, date: Date) {
  let ret;
  const opt: any = {
    'y+': date.getFullYear().toString(),
    'M+': (date.getMonth() + 1).toString(),
    'd+': date.getDate().toString(),
    'h+': date.getHours().toString(),
    'm+': date.getMinutes().toString(),
    's+': date.getSeconds().toString()
  };
  for (let k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'));
    }
  }
  return fmt;
}

export function splitConfig(config: any = {}, ridKeys: string[] = []) {
  let newConfig: any = {};
  ridKeys.forEach(key => {
    if (config[key] !== void 0) {
      newConfig[key] = config[key];
      delete config[key];
    }
  });
  return newConfig;
}

export function getStringLen(fullText?: string) {
  if (fullText === void 0 || fullText === null) return 0;
  let count = 0;
  for (let i = 0; i < fullText.length; i++) {
    if (fullText.charCodeAt(i) > 127 || fullText.charCodeAt(i) === 94) count += 2;
    else count++;
  }
  return count;
}
/**
 * 截职字符串
 * @param fullText 原始字符串
 * @param len 截取的长度，英文为1，中文为2， "12中" => 4; "中方" => 4; "123" => 3
 * @returns {string} //截取字符串
 */
export function getSubString(fullText?: string, len = 0) {
  if (fullText === void 0 || fullText === null) return fullText;
  let subText = '';
  for (let i = 0, k = 0; i < len; k++) {
    if (fullText.charCodeAt(i) > 127 || fullText.charCodeAt(i) === 94) i += 2;
    else i++;

    subText += fullText.charAt(k);
  }
  if (fullText.length !== subText.length) subText += '...';
  return subText;
}
//a: {c: {a: 12}}, b: {c: {d: 13}}  =>a: {c: {a: 12, d: 13}}
function copyBtoA(a: any = {}, b: any = {}, coverKeys: string[] | null) {
  for (let key in b) {
    if (!coverKeys?.includes(key) && isPlainObject(a[key]) && isPlainObject(b[key])) {
      copyBtoA(a[key], b[key], coverKeys)
    } else {
      a[key] = b[key]
    }
  }
}
/**
 * 
 * @param target 目标
 * @param coverKeys 直接覆盖拷贝
 * @param source 资源
 * @returns 
 */
export function objectMerge(target: any, coverKeys: string[] | null, ...source: any) {
  for (let item of source) {
    copyBtoA(target, item, coverKeys)
  }
  return target
}

function toObjectData(data: any) {
  return isPlainObject(data) ? data : {}
}

export function isUndefined(data: any = {}, skey = "", split = '.') {
  if (!skey || !data) return true

  const keys = skey.split(split)
  let currentData = toObjectData(data)
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]
    if (i === keys.length - 1) {
      return !Object.keys(currentData).includes(key)
    }
    if (currentData[key] === undefined) {
      return true
    }
    currentData = currentData[key]
  }
}

export function getChainValueByString(data: any = {}, skey: string, split = '.'): any {
  if (!skey || !data) return

  const keys = skey.split(split)
  let currentData = toObjectData(data)
  for (let key of keys) {
    if (key in currentData) {
      currentData = currentData[key]
    } else {
      return
    }
  }
  return currentData
}

export function setChainValueByString(data: any = {}, skey: string, value: any, split = '.') {
  if (!skey || !data) return

  const keys = skey.split(split)
  let currentData = data

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]

    if (i === keys.length - 1) {
      currentData[key] = value
      break;
    }

    if (currentData[key] === undefined) {
      currentData[key] = {}
    }
    currentData = currentData[key]
  }
}
//不改引用地址, 将 data 值改为 nextData
export function resetToOtherObject(data: any = {}, nextData: any = {}) {
  if (data === nextData) return

  for (let key in data) {
    delete data[key]
  }
  for (let key in nextData) {
    data[key] = nextData[key]
  }
}

export function getStyle(key: string, style?: React.CSSProperties) {
  const [DefaultStyles] = getDefaultStyles()
  return objectMerge({}, null, DefaultStyles[key], style)
}

export function getClass(key: string, className: string = '') {
  const [DefaultClasses] = getDefaultClasses()
  let clazz = ''
  if (DefaultClasses[key]) {
    clazz = DefaultClasses[key]
  }
  if (className) {
    clazz += (clazz ? ' ' + className : className)
  }
  return clazz
}

export function getOrderKey(level = 'k', index: number) {
  return level + "_" + index
}

export function debounce(fn: Function, wait: number, immediate = true) {
  let timer: NodeJS.Timeout | null = null;

  return function (this: any, ...args: any[]) {
    if (timer) {
      clearTimeout(timer);
    };

    if (immediate && !timer) {
      fn.apply(this, args)
    }

    timer = setTimeout(() => {
      fn.apply(this, args)
    }, wait)
  }
};

export function  getArrayLastItem(columns: any[]) {
  return columns[columns.length - 1];
}

const utils = {
  notEquals,
  notEqualsArr,
  notEqualsChildren,
  hasFunctionObj,
  dateFormat,
  isPlainObject,
  resetOptions,
  clone,
  getUUID
}

export default utils;