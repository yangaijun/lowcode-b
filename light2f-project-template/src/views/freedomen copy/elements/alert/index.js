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
var useBase_1 = require("../../hooks/useBase");
var antd_1 = require("antd");
var base_1 = require("../../utils/base");
var types = {
    'alert-success': 'success',
    'alert-info': 'info',
    'alert-warning': 'warning',
    'alert-error': 'error'
};
function FAlert(props) {
    var item = props.item;
    var style = (0, useBase_1.useStyle)(props);
    var className = (0, useBase_1.useClassName)(props);
    var config = (0, useBase_1.useConfig)(props);
    var type = (0, base_1.getOriginalType)(item);
    var aType = types[type];
    return (0, react_1.useMemo)(function () {
        return react_1.default.createElement(antd_1.Alert, __assign({ type: aType, className: className, message: item.value, style: style }, config));
    }, [className, style, aType, item.value, config]);
}
exports.default = FAlert;
