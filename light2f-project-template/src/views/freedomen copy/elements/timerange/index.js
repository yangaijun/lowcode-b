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
var RangePicker = antd_1.TimePicker.RangePicker;
function parseValue(value) {
    if (value) {
        var start = value[0], end = value[1];
        return [start === null || start === void 0 ? void 0 : start.valueOf(), end === null || end === void 0 ? void 0 : end.valueOf()];
    }
    return value;
}
function stringfiyValue(value) {
    if (value) {
        return [value[0] ? (0, dayjs_1.default)(value[0]) : null, value[1] ? (0, dayjs_1.default)(value[1]) : null];
    }
    return value;
}
function FTimeRange(props) {
    var item = props.item;
    var onChange = (0, useBase_1.useChange)(props);
    var style = (0, useBase_1.useStyle)(props);
    var className = (0, useBase_1.useClassName)(props);
    var disabled = (0, useBase_1.useDisabled)(props);
    var config = (0, useBase_1.useConfig)(props);
    var innerValue = (0, react_1.useMemo)(function () {
        return stringfiyValue(item.value);
    }, [item.value]);
    return (0, react_1.useMemo)(function () {
        return react_1.default.createElement(RangePicker, __assign({ style: style, value: innerValue, className: className, placeholder: item.placeholder, disabled: disabled }, config, { onChange: function (value) {
                onChange(parseValue(value));
            } }));
    }, [onChange, item.placeholder, style, className, disabled, config, innerValue]);
}
exports.default = FTimeRange;
