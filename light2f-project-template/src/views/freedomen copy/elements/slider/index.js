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
var useBase_1 = require("../../hooks/useBase");
var types = {
    'slider': false,
    'slider-range': true
};
function FSlider(props) {
    var item = props.item;
    var style = (0, useBase_1.useStyle)(props);
    var className = (0, useBase_1.useClassName)(props);
    var onChange = (0, useBase_1.useChange)(props);
    var filter = (0, useBase_1.useFilter)(props);
    var disabled = (0, useBase_1.useDisabled)(props);
    var config = (0, useBase_1.useConfig)(props);
    var type = (0, base_1.getOriginalType)(item);
    var rType = types[type];
    return (0, react_2.useMemo)(function () {
        return react_1.default.createElement(antd_1.Slider, __assign({ range: rType, value: filter, style: style, className: className, disabled: disabled, onChange: onChange }, config));
    }, [rType, filter, style, className, disabled, onChange, config]);
}
exports.default = FSlider;
