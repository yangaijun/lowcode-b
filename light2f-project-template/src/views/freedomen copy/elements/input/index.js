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
var useBase_1 = require("../../hooks/useBase");
var base_1 = require("../../utils/base");
var type_1 = require("../../config/type");
var ridKeys = ['changeEventType'];
var types = {
    'input': antd_1.Input,
    'input-search': antd_1.Input.Search,
    'input-area': antd_1.Input.TextArea,
    'input-password': antd_1.Input.Password
};
function FInput(props) {
    var item = props.item;
    var _a = (0, react_1.useState)(), value = _a[0], setValue = _a[1];
    var _b = (0, react_1.useState)(null), blurValue = _b[0], setBlurValue = _b[1];
    var innerRef = (0, react_1.useRef)({ value: null, isFocus: false });
    var disabled = (0, useBase_1.useDisabled)(props);
    var className = (0, useBase_1.useClassName)(props);
    var style = (0, useBase_1.useStyle)(props);
    var config = (0, useBase_1.useConfig)(props);
    var ridKeysConfig = (0, useBase_1.useRidkeyConfig)(config, ridKeys);
    var onChange = (0, useBase_1.useChange)(props);
    var onEvent = (0, useBase_1.useEvent)(props);
    var type = (0, base_1.getOriginalType)(item);
    var Element = types[type] || antd_1.Input;
    var _c = config.changeEventType, changeEventType = _c === void 0 ? type_1.EChangeEventType.INPUT : _c;
    (0, react_1.useEffect)(function () {
        if (item.value !== innerRef.current.value) {
            setValue(item.value);
        }
    }, [item.value]);
    (0, react_1.useEffect)(function () {
        if (blurValue !== null) {
            onEvent(type === 'input-search' ? 'search' : 'pressEnter', blurValue);
            setBlurValue(null);
        }
    }, [blurValue, onEvent]);
    var events = (0, react_1.useMemo)(function () {
        var params = {
            onChange: function (_a) {
                var value = _a.target.value;
                innerRef.current.value = value;
                setValue(value);
                if (changeEventType === type_1.EChangeEventType.INPUT || !innerRef.current.isFocus) {
                    onChange(value);
                }
            },
            onPressEnter: function (_a) {
                var value = _a.target.value;
                if (changeEventType === type_1.EChangeEventType.BLUR) {
                    onChange(value);
                    setBlurValue(value);
                }
                else {
                    onEvent(type === 'input-search' ? 'search' : 'pressEnter', value);
                }
            }
        };
        if (type === 'input-search') {
            params.onSearch = function (value) {
                params.onPressEnter({ target: { value: value } });
            };
        }
        return params;
    }, [type, changeEventType, onEvent, onChange]);
    var onBlur = (0, react_1.useCallback)(function () {
        innerRef.current.isFocus = false;
        if (changeEventType === type_1.EChangeEventType.BLUR && innerRef.current.value !== null) {
            onChange(value);
        }
    }, [changeEventType, value, onChange]);
    return (0, react_1.useMemo)(function () {
        return react_1.default.createElement(Element, __assign({ style: style, value: value, onBlur: onBlur, onFocus: function () {
                innerRef.current.isFocus = true;
            }, disabled: disabled, className: className, placeholder: item.placeholder }, events, ridKeysConfig));
    }, [Element, style, value, onBlur, disabled, item.placeholder, className, events, ridKeysConfig]);
}
exports.default = FInput;
