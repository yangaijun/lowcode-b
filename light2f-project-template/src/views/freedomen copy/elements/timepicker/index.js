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
var dayjs_1 = __importDefault(require("dayjs"));
var useBase_1 = require("../../hooks/useBase");
function FTimePicker(props) {
    var item = props.item;
    var onChange = (0, useBase_1.useChange)(props);
    var style = (0, useBase_1.useStyle)(props);
    var className = (0, useBase_1.useClassName)(props);
    var disabled = (0, useBase_1.useDisabled)(props);
    var config = (0, useBase_1.useConfig)(props);
    var innerValue = (0, react_1.useMemo)(function () {
        return item.value ?
            (0, dayjs_1.default)(item.value)
            : null;
    }, [item.value]);
    return (0, react_1.useMemo)(function () {
        return react_1.default.createElement(antd_1.TimePicker, __assign({ style: style, className: className, placeholder: item.placeholder, value: innerValue, disabled: disabled, onChange: function (value) {
                if (value === null) {
                    onChange(null);
                }
                else {
                    onChange(value === null || value === void 0 ? void 0 : value.valueOf());
                }
            } }, config));
    }, [onChange, innerValue, item.placeholder, style, className, disabled, config]);
}
exports.default = FTimePicker;
