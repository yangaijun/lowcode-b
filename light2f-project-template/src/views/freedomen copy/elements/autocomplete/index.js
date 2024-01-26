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
var useBase_1 = require("../../hooks/useBase");
var antd_1 = require("antd");
var type_1 = require("../../config/type");
var MarginLoadingOutlined_1 = __importDefault(require("../MarginLoadingOutlined"));
var ridKeys = ['changeEventType'];
function FAutoComplete(props) {
    var item = props.item;
    var _a = (0, react_1.useState)(), value = _a[0], setValue = _a[1];
    var innerRef = (0, react_1.useRef)({ value: null, pre: null });
    var style = (0, useBase_1.useStyle)(props);
    var onChange = (0, useBase_1.useChange)(props);
    var disabled = (0, useBase_1.useDisabled)(props);
    var className = (0, useBase_1.useClassName)(props);
    var config = (0, useBase_1.useConfig)(props);
    var ridKeysConfig = (0, useBase_1.useRidkeyConfig)(config, ridKeys);
    var _b = config.changeEventType, changeEventType = _b === void 0 ? type_1.EChangeEventType.INPUT : _b;
    var _c = (0, useBase_1.useOptions)(props, value), options = _c.options, loading = _c.loading;
    var dropdownRender = (0, react_1.useCallback)(function (menu) {
        return loading ? react_1.default.createElement(MarginLoadingOutlined_1.default, null) : menu;
    }, [loading]);
    (0, react_1.useEffect)(function () {
        if (innerRef.current.value !== item.value) {
            setValue(item.value);
        }
    }, [item.value]);
    return (0, react_1.useMemo)(function () {
        return react_1.default.createElement(antd_1.AutoComplete, __assign({ value: value, style: style, options: options, className: className, dropdownRender: dropdownRender, onBlur: function () {
                if (changeEventType === type_1.EChangeEventType.BLUR && innerRef.current.value !== null) {
                    onChange(value);
                }
            }, placeholder: item.placeholder, disabled: disabled, onChange: function (value) {
                innerRef.current.pre = innerRef.current.value;
                innerRef.current.value = value;
                setValue(value);
                if (changeEventType === type_1.EChangeEventType.INPUT) {
                    onChange(value);
                }
            } }, ridKeysConfig));
    }, [style, value, item.placeholder, disabled, onChange, className, options, dropdownRender, changeEventType, ridKeysConfig]);
}
exports.default = FAutoComplete;
