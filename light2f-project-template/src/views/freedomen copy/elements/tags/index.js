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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var antd_1 = require("antd");
var base_1 = require("../../utils/base");
var icons_1 = require("@ant-design/icons");
var util_1 = __importDefault(require("../../utils/util"));
var useBase_1 = require("../../hooks/useBase");
var ridKeys = ['maxcount', 'maxlength'];
var types = {
    'tags-close': 'tags-close',
    'tags-create': 'tags-create'
};
function FTags(props) {
    var item = props.item, _a = props.item, value = _a.value, _b = _a.text, text = _b === void 0 ? "新建" : _b;
    var _c = (0, react_1.useState)(false), inputVisible = _c[0], setInputVisible = _c[1];
    var _d = (0, react_1.useState)(""), inputValue = _d[0], setInputValue = _d[1];
    var inputRef = (0, react_1.useRef)();
    var onChange = (0, useBase_1.useChange)(props);
    var className = (0, useBase_1.useClassName)(props);
    var style = (0, useBase_1.useStyle)(props);
    var type = (0, base_1.getOriginalType)(item);
    var config = (0, useBase_1.useConfig)(props);
    var ridKeysConfig = (0, useBase_1.useRidkeyConfig)(config, ridKeys);
    var _e = config.maxcount, maxcount = _e === void 0 ? 999 : _e, maxlength = config.maxlength;
    var innerValue = (0, react_1.useMemo)(function () {
        return value || [];
    }, [value]);
    var itemStyles = (0, useBase_1.useItemStyle)(props, innerValue);
    var onInputChange = (0, react_1.useCallback)(function (_a) {
        var value = _a.target.value;
        setInputValue(value);
    }, []);
    var onEditInputConfirm = (0, react_1.useCallback)(function () {
        if (inputValue !== '') {
            onChange(__spreadArray(__spreadArray([], innerValue, true), [
                inputValue
            ], false));
        }
        setInputValue("");
        setInputVisible(false);
    }, [inputValue, innerValue, onChange]);
    var showInput = (0, react_1.useCallback)(function () {
        setInputVisible(true);
    }, []);
    var closable = (0, react_1.useMemo)(function () {
        return type === types['tags-close'] || type === types['tags-create'];
    }, [type]);
    var isCreate = (0, react_1.useMemo)(function () {
        return type === types['tags-create'] && innerValue.length < maxcount;
    }, [type, innerValue, maxcount]);
    (0, react_1.useEffect)(function () {
        if (inputVisible) {
            inputRef.current.focus();
        }
    }, [inputVisible]);
    return (0, react_1.useMemo)(function () {
        return react_1.default.createElement("div", { className: className, style: __assign({ display: 'flex' }, style) },
            innerValue.map(function (option, index) { return (react_1.default.createElement(antd_1.Tag, __assign({ key: util_1.default.getUUID(), closable: closable }, ridKeysConfig, { className: className, style: itemStyles[index], onClose: function (_) {
                    var nextValue = __spreadArray([], innerValue, true);
                    nextValue.splice(index, 1);
                    onChange(nextValue);
                } }), option)); }),
            isCreate ? react_1.default.createElement(react_1.default.Fragment, null, inputVisible ? react_1.default.createElement(antd_1.Input, { type: "text", size: "small", value: inputValue, style: { width: 80, verticalAlign: 'top' }, ref: inputRef, onChange: onInputChange, maxLength: maxlength, onBlur: onEditInputConfirm, onPressEnter: onEditInputConfirm }) : react_1.default.createElement(antd_1.Tag, { style: { backgroundColor: 'white', borderStyle: 'dashed' }, onClick: showInput },
                react_1.default.createElement(icons_1.PlusOutlined, null),
                " ",
                text)) : null);
    }, [innerValue, className, style, itemStyles, isCreate, ridKeysConfig, closable, maxlength, inputVisible, inputValue, onInputChange, onEditInputConfirm, showInput, text, onChange]);
}
exports.default = FTags;
