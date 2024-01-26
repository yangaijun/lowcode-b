"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDisabled = exports.clearDisabled = exports.setDisabled = exports.hasPermission = exports.clearPermission = exports.setPermission = void 0;
var permissionStack = [];
var disabledStack = [];
/**
 * 用户全局设置元素是否加载（权限）
 * @param {函数} fn
 */
function setPermission(fn) {
    if (typeof fn === 'function' && !permissionStack.find(function (v) { return fn === v; })) {
        permissionStack.push(fn);
    }
    else {
        console.error('permission must be function');
    }
}
exports.setPermission = setPermission;
;
/**
 * 清楚权限
 */
function clearPermission(fn) {
    if (!!fn) {
        var index = permissionStack.findIndex(function (v) { return v === fn; });
        if (index !== -1) {
            permissionStack.splice(index, 1);
        }
    }
}
exports.clearPermission = clearPermission;
/**
 * 是否有权限, default true
 */
function hasPermission(params) {
    return permissionStack.length ? permissionStack[permissionStack.length - 1](params) : true;
}
exports.hasPermission = hasPermission;
/**
 * 用户全局设置元素是否禁用（权限）
 */
function setDisabled(fn) {
    if (typeof fn === 'function' && !disabledStack.find(function (v) { return fn === v; })) {
        disabledStack.push(fn);
    }
    else {
        console.error('permission must be function');
    }
}
exports.setDisabled = setDisabled;
;
/**
 * 清楚禁用
 */
function clearDisabled(fn) {
    if (!!fn) {
        var index = disabledStack.findIndex(function (v) { return v === fn; });
        if (index !== -1) {
            disabledStack.splice(index, 1);
        }
    }
}
exports.clearDisabled = clearDisabled;
/**
 * 是否禁用
 */
function isDisabled(params) {
    return disabledStack.length ? disabledStack[disabledStack.length - 1](params) : false;
}
exports.isDisabled = isDisabled;
