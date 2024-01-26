"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArrayLastItem = exports.debounce = exports.getOrderKey = exports.getClass = exports.getStyle = exports.resetToOtherObject = exports.setChainValueByString = exports.getChainValueByString = exports.isUndefined = exports.objectMerge = exports.getSubString = exports.getStringLen = exports.splitConfig = void 0;
var react_1 = __importDefault(require("react"));
var class_1 = require("../config/class");
var style_1 = require("../config/style");
function isReactElement(data) {
    return react_1.default.isValidElement(data);
}
var activeFnKeys = ['type', 'style', 'className', 'disabled', 'load', 'filter', 'itemStyle', 'options', 'render'];
function testActiveFnKeyAndValue(key, value) {
    return (activeFnKeys.includes(key) && typeof value === 'function');
}
function stringify(val, testActiveFnKey) {
    var skipKeys = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        skipKeys[_i - 2] = arguments[_i];
    }
    return JSON.stringify(val, function (key, value) {
        if (skipKeys === null || skipKeys === void 0 ? void 0 : skipKeys.includes(key))
            return null;
        if (testActiveFnKey && testActiveFnKeyAndValue(key, value)) {
            return getUUID();
        }
        //react 对象, 比较props
        if (isReactElement(value)) {
            return value.props;
        }
        return value;
    });
}
function notEquals(val1, val2) {
    var skipKeys = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        skipKeys[_i - 2] = arguments[_i];
    }
    try {
        return stringify.apply(void 0, __spreadArray([val1, false], skipKeys, false)) !== stringify.apply(void 0, __spreadArray([val2, false], skipKeys, false));
    }
    catch (e) {
        return false;
    }
}
function notEqualsArr(val1, val2, keyName) {
    var _a, _b;
    if (val1 === void 0) { val1 = []; }
    if (val2 === void 0) { val2 = []; }
    if ((val1 === null || val1 === void 0 ? void 0 : val1.length) !== (val2 === null || val2 === void 0 ? void 0 : val2.length)) {
        return true;
    }
    for (var i = 0; i < val1.length; i++) {
        if (((_a = val1[i]) === null || _a === void 0 ? void 0 : _a[keyName]) !== ((_b = val2[i]) === null || _b === void 0 ? void 0 : _b[keyName])) {
            return true;
        }
    }
    return false;
}
function notEqualsChildren(val1, val2) {
    var skipKeys = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        skipKeys[_i - 2] = arguments[_i];
    }
    try {
        return stringify.apply(void 0, __spreadArray([val1, true], skipKeys, false)) !== stringify.apply(void 0, __spreadArray([val2, true], skipKeys, false));
    }
    catch (e) {
        return false;
    }
}
function hasFunctionObj(obj) {
    if (obj === void 0) { obj = {}; }
    for (var key in obj) {
        if (typeof obj[key] === 'function')
            return true;
        if (isPlainObject(obj[key])) {
            var res = hasFunctionObj(obj[key]);
            if (res)
                return true;
        }
    }
    return false;
}
function isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}
function getUUID() {
    var rand = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return rand() + rand() + rand() + rand() + rand() + rand() + rand() + rand();
}
function getKey(key) {
    if (/^\d+$/.test(key))
        return parseInt(key);
    else
        return key;
}
function resetOptions(options) {
    var newOptions = [];
    if (isPlainObject(options)) {
        for (var key in options) {
            newOptions.push({
                value: getKey(key),
                label: options[key]
            });
        }
        return newOptions;
    }
    else if (typeof options === 'string') {
        var tempOptions = options.split(',');
        for (var _i = 0, tempOptions_1 = tempOptions; _i < tempOptions_1.length; _i++) {
            var key = tempOptions_1[_i];
            newOptions.push({
                value: getKey(key),
                label: key
            });
        }
    }
    else {
        newOptions = options || [];
    }
    return newOptions;
}
/**
 * 只支持数组与Object
 * @param {要拷贝的数据} data
 * @returns 新的对象
 */
function clone(data) {
    if (Array.isArray(data)) {
        var newArr = [];
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var value = data_1[_i];
            newArr.push(clone(value));
        }
        return newArr;
    }
    else if (isPlainObject(data)) {
        var model = {};
        for (var item in data) {
            if (data[item] instanceof Array) {
                model[item] = clone(data[item]);
                //react element不copy
            }
            else if (isPlainObject(data[item]) && !isReactElement(data[item])) {
                model[item] = clone(data[item]);
            }
            else {
                model[item] = data[item];
            }
        }
        return model;
    }
    else {
        return data;
    }
}
function dateFormat(fmt, date) {
    var ret;
    var opt = {
        'y+': date.getFullYear().toString(),
        'M+': (date.getMonth() + 1).toString(),
        'd+': date.getDate().toString(),
        'h+': date.getHours().toString(),
        'm+': date.getMinutes().toString(),
        's+': date.getSeconds().toString()
    };
    for (var k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'));
        }
    }
    return fmt;
}
function splitConfig(config, ridKeys) {
    if (config === void 0) { config = {}; }
    if (ridKeys === void 0) { ridKeys = []; }
    var newConfig = {};
    ridKeys.forEach(function (key) {
        if (config[key] !== void 0) {
            newConfig[key] = config[key];
            delete config[key];
        }
    });
    return newConfig;
}
exports.splitConfig = splitConfig;
function getStringLen(fullText) {
    if (fullText === void 0 || fullText === null)
        return 0;
    var count = 0;
    for (var i = 0; i < fullText.length; i++) {
        if (fullText.charCodeAt(i) > 127 || fullText.charCodeAt(i) === 94)
            count += 2;
        else
            count++;
    }
    return count;
}
exports.getStringLen = getStringLen;
/**
 * 截职字符串
 * @param fullText 原始字符串
 * @param len 截取的长度，英文为1，中文为2， "12中" => 4; "中方" => 4; "123" => 3
 * @returns {string} //截取字符串
 */
function getSubString(fullText, len) {
    if (len === void 0) { len = 0; }
    if (fullText === void 0 || fullText === null)
        return fullText;
    var subText = '';
    for (var i = 0, k = 0; i < len; k++) {
        if (fullText.charCodeAt(i) > 127 || fullText.charCodeAt(i) === 94)
            i += 2;
        else
            i++;
        subText += fullText.charAt(k);
    }
    if (fullText.length !== subText.length)
        subText += '...';
    return subText;
}
exports.getSubString = getSubString;
//a: {c: {a: 12}}, b: {c: {d: 13}}  =>a: {c: {a: 12, d: 13}}
function copyBtoA(a, b, coverKeys) {
    if (a === void 0) { a = {}; }
    if (b === void 0) { b = {}; }
    for (var key in b) {
        if (!(coverKeys === null || coverKeys === void 0 ? void 0 : coverKeys.includes(key)) && isPlainObject(a[key]) && isPlainObject(b[key])) {
            copyBtoA(a[key], b[key], coverKeys);
        }
        else {
            a[key] = b[key];
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
function objectMerge(target, coverKeys) {
    var source = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        source[_i - 2] = arguments[_i];
    }
    for (var _a = 0, source_1 = source; _a < source_1.length; _a++) {
        var item = source_1[_a];
        copyBtoA(target, item, coverKeys);
    }
    return target;
}
exports.objectMerge = objectMerge;
function toObjectData(data) {
    return isPlainObject(data) ? data : {};
}
function isUndefined(data, skey, split) {
    if (data === void 0) { data = {}; }
    if (skey === void 0) { skey = ""; }
    if (split === void 0) { split = '.'; }
    if (!skey || !data)
        return true;
    var keys = skey.split(split);
    var currentData = toObjectData(data);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (i === keys.length - 1) {
            return !Object.keys(currentData).includes(key);
        }
        if (currentData[key] === undefined) {
            return true;
        }
        currentData = currentData[key];
    }
}
exports.isUndefined = isUndefined;
function getChainValueByString(data, skey, split) {
    if (data === void 0) { data = {}; }
    if (split === void 0) { split = '.'; }
    if (!skey || !data)
        return;
    var keys = skey.split(split);
    var currentData = toObjectData(data);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        if (key in currentData) {
            currentData = currentData[key];
        }
        else {
            return;
        }
    }
    return currentData;
}
exports.getChainValueByString = getChainValueByString;
function setChainValueByString(data, skey, value, split) {
    if (data === void 0) { data = {}; }
    if (split === void 0) { split = '.'; }
    if (!skey || !data)
        return;
    var keys = skey.split(split);
    var currentData = data;
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (i === keys.length - 1) {
            currentData[key] = value;
            break;
        }
        if (currentData[key] === undefined) {
            currentData[key] = {};
        }
        currentData = currentData[key];
    }
}
exports.setChainValueByString = setChainValueByString;
//不改引用地址, 将 data 值改为 nextData
function resetToOtherObject(data, nextData) {
    if (data === void 0) { data = {}; }
    if (nextData === void 0) { nextData = {}; }
    if (data === nextData)
        return;
    for (var key in data) {
        delete data[key];
    }
    for (var key in nextData) {
        data[key] = nextData[key];
    }
}
exports.resetToOtherObject = resetToOtherObject;
function getStyle(key, style) {
    var DefaultStyles = (0, style_1.getDefaultStyles)()[0];
    return objectMerge({}, null, DefaultStyles[key], style);
}
exports.getStyle = getStyle;
function getClass(key, className) {
    if (className === void 0) { className = ''; }
    var DefaultClasses = (0, class_1.getDefaultClasses)()[0];
    var clazz = '';
    if (DefaultClasses[key]) {
        clazz = DefaultClasses[key];
    }
    if (className) {
        clazz += (clazz ? ' ' + className : className);
    }
    return clazz;
}
exports.getClass = getClass;
function getOrderKey(level, index) {
    if (level === void 0) { level = 'k'; }
    return level + "_" + index;
}
exports.getOrderKey = getOrderKey;
function debounce(fn, wait, immediate) {
    if (immediate === void 0) { immediate = true; }
    var timer = null;
    return function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (timer) {
            clearTimeout(timer);
        }
        ;
        if (immediate && !timer) {
            fn.apply(this, args);
        }
        timer = setTimeout(function () {
            fn.apply(_this, args);
        }, wait);
    };
}
exports.debounce = debounce;
;
function getArrayLastItem(columns) {
    return columns[columns.length - 1];
}
exports.getArrayLastItem = getArrayLastItem;
var utils = {
    notEquals: notEquals,
    notEqualsArr: notEqualsArr,
    notEqualsChildren: notEqualsChildren,
    hasFunctionObj: hasFunctionObj,
    dateFormat: dateFormat,
    isPlainObject: isPlainObject,
    resetOptions: resetOptions,
    clone: clone,
    getUUID: getUUID
};
exports.default = utils;
