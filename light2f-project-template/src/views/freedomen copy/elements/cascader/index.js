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
var MarginLoadingOutlined_1 = __importDefault(require("../MarginLoadingOutlined"));
var props_1 = require("../../config/props");
var ridKeys = [props_1.names.labelname, props_1.names.valuename, props_1.names.childrenname];
function FCascader(props) {
    var item = props.item;
    var style = (0, useBase_1.useStyle)(props);
    var onChange = (0, useBase_1.useChange)(props);
    var disabled = (0, useBase_1.useDisabled)(props);
    var className = (0, useBase_1.useClassName)(props);
    var _a = (0, useBase_1.useOptions)(props), options = _a.options, loading = _a.loading;
    var config = (0, useBase_1.useConfig)(props);
    var ridKeysConfig = (0, useBase_1.useRidkeyConfig)(config, ridKeys);
    var _b = (0, useBase_1.useOptionNames)(config), labelname = _b.labelname, valuename = _b.valuename, childrenname = _b.childrenname;
    var fieldNames = (0, react_1.useMemo)(function () {
        if (ridKeysConfig.fieldNames) {
            return ridKeysConfig.fieldNames;
        }
        return {
            label: labelname,
            value: valuename,
            children: childrenname
        };
    }, [labelname, valuename, childrenname, ridKeysConfig.fieldNames]);
    var dropdownRender = (0, react_1.useCallback)(function (menu) {
        return loading ? react_1.default.createElement(MarginLoadingOutlined_1.default, null) : menu;
    }, [loading]);
    return (0, react_1.useMemo)(function () {
        return react_1.default.createElement(antd_1.Cascader, __assign({ style: style, className: className, options: options, disabled: disabled, value: item.value, onChange: onChange, placeholder: item.placeholder, dropdownRender: dropdownRender }, ridKeysConfig, { fieldNames: fieldNames }));
    }, [style, item.value, item.placeholder, onChange, disabled, className, options, fieldNames, ridKeysConfig, dropdownRender]);
}
exports.default = FCascader;
