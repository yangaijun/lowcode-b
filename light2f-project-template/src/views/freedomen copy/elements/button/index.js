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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var antd_1 = require("antd");
var base_1 = require("../../utils/base");
var useBase_1 = require("../../hooks/useBase");
var props_1 = require("../../config/props");
var types = {
    'button-primary': 'primary',
    'button-dashed': 'dashed',
    'button-text': 'text',
    'button-link': 'link'
};
function FButton(props) {
    var item = props.item;
    var onEvent = (0, useBase_1.useEvent)(props);
    var style = (0, useBase_1.useStyle)(props);
    var className = (0, useBase_1.useClassName)(props);
    var disabled = (0, useBase_1.useDisabled)(props);
    var filter = (0, useBase_1.useFilter)(props);
    var config = (0, useBase_1.useConfig)(props);
    var type = (0, base_1.getOriginalType)(item);
    var bType = types[type];
    return (0, react_1.useMemo)(function () {
        return react_1.default.createElement(antd_1.Button, __assign({ type: bType, style: style, className: className, disabled: disabled, onClick: function (_) { return onEvent(props_1.clickType, item.value); } }, config), filter);
    }, [onEvent, bType, style, className, item.value, disabled, filter, config]);
}
exports.default = FButton;
