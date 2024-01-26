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
var base_1 = require("../../utils/base");
var props_1 = require("../../config/props");
var useBase_1 = require("../../hooks/useBase");
var icons_1 = require("@ant-design/icons");
var MarginLoadingOutlined_1 = __importDefault(require("../MarginLoadingOutlined"));
var ridKeys = ['content', props_1.names.labelname, props_1.names.valuename];
var types = {
    'dropdown': 1,
    'dropdown-a': 2,
    'dropdown-primary': 3
};
var DEFAULT_TEXT = "请选择";
function FDropdown(props) {
    var item = props.item;
    var onEvent = (0, useBase_1.useEvent)(props);
    var style = (0, useBase_1.useStyle)(props);
    var className = (0, useBase_1.useClassName)(props);
    var disabled = (0, useBase_1.useDisabled)(props);
    var _a = (0, useBase_1.useOptions)(props), options = _a.options, loading = _a.loading;
    var config = (0, useBase_1.useConfig)(props);
    var ridKeysConfig = (0, useBase_1.useRidkeyConfig)(config, ridKeys);
    var _b = (0, useBase_1.useOptionNames)(config), labelname = _b.labelname, valuename = _b.valuename;
    var type = (0, base_1.getOriginalType)(item);
    var dType = types[type];
    var menu = (0, react_1.useMemo)(function () {
        return loading ? {
            items: [{ key: 'loading', label: react_1.default.createElement(MarginLoadingOutlined_1.default, null) }]
        } : {
            items: options.map(function (option, key) {
                return __assign({ key: key, label: option[labelname] }, option);
            }),
            onClick: function (_a) {
                var key = _a.key;
                onEvent(props_1.clickType, options[Number(key)][valuename]);
            }
        };
    }, [options, loading, labelname, valuename]);
    var children = (0, react_1.useMemo)(function () {
        var itemText = react_1.default.createElement("span", null,
            item.text || DEFAULT_TEXT,
            " ",
            react_1.default.createElement(icons_1.DownOutlined, null));
        var content = config.content, size = config.size;
        if (content)
            return content;
        var bType = dType === types['dropdown-a'] ? 'link' : dType === types['dropdown-primary'] ? 'primary' : undefined;
        return react_1.default.createElement(antd_1.Button, { size: size, type: bType },
            " ",
            itemText,
            " ");
    }, [dType, item.text, config]);
    return (0, react_1.useMemo)(function () {
        return react_1.default.createElement(antd_1.Dropdown, __assign({ menu: menu, style: style, className: className, disabled: disabled }, ridKeysConfig), children);
    }, [menu, style, className, disabled, options, onEvent, ridKeysConfig, valuename, children]);
}
exports.default = FDropdown;
