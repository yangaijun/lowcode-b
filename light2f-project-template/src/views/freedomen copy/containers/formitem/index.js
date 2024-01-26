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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var antd_1 = require("antd");
var util_1 = __importDefault(require("../../utils/util"));
var useBase_1 = require("../../hooks/useBase");
var props_1 = require("../../config/props");
function FFormItem(props) {
    var item = props.item, _a = props.item, label = _a.label, prop = _a.prop, rules = _a.rules, noStyle = _a.noStyle;
    var style = (0, useBase_1.useStyle)(props);
    var className = (0, useBase_1.useClassName)(props);
    var config = (0, useBase_1.useConfig)(props);
    var children = (0, useBase_1.useChildren)(props);
    var name = (0, react_1.useMemo)(function () {
        return prop || util_1.default.getUUID();
    }, [prop]);
    var isRequired = item[props_1.emptyKey];
    var required = (0, react_1.useMemo)(function () {
        return isRequired !== true && rules;
    }, [isRequired, rules]);
    return (0, react_1.useMemo)(function () {
        return (react_1.default.createElement(antd_1.Form.Item, __assign({ name: name, rules: rules, style: style, label: label, noStyle: noStyle, className: className, required: required }, config), children));
    }, [style, className, label, name, required, config, noStyle, rules, children]);
}
exports.default = FFormItem;
