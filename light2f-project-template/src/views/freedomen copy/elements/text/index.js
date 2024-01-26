"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var antd_1 = require("antd");
var base_1 = require("../../utils/base");
var react_2 = require("react");
var util_1 = require("../../utils/util");
var useBase_1 = require("../../hooks/useBase");
var props_1 = require("../../config/props");
var defaultDomName = 'span';
var ridKeys = ['tooltip', 'maxlength'];
function FText(props) {
    var item = props.item;
    var onEvent = (0, useBase_1.useEvent)(props);
    var style = (0, useBase_1.useStyle)(props);
    var className = (0, useBase_1.useClassName)(props);
    var filter = (0, useBase_1.useFilter)(props);
    var config = (0, useBase_1.useConfig)(props);
    var ridKeysConfig = (0, useBase_1.useRidkeyConfig)(config, ridKeys);
    var type = (0, base_1.getOriginalType)(item);
    var maxlength = config.maxlength, tooltip = config.tooltip;
    var domName = (0, react_2.useMemo)(function () {
        var tempType = type.split('-');
        if (tempType.length >= 2)
            return tempType[1];
        return defaultDomName;
    }, [type]);
    var subText = (0, react_2.useMemo)(function () {
        var filterLen = (0, util_1.getStringLen)(filter);
        if (maxlength && filterLen && maxlength < filterLen) {
            return (0, util_1.getSubString)(filter, maxlength);
        }
    }, [filter, maxlength]);
    return (0, react_2.useMemo)(function () {
        var Element = react_1.default.createElement(domName, __assign({ style: style, className: className, onClick: function () {
                onEvent(props_1.clickType, item.value);
            } }, ridKeysConfig), subText || filter);
        if (subText && tooltip !== false) {
            return react_1.default.createElement(antd_1.Tooltip, { title: filter }, Element);
        }
        else {
            return Element;
        }
    }, [domName, style, item.value, className, onEvent, subText, filter, tooltip, ridKeysConfig]);
}
exports.default = FText;
