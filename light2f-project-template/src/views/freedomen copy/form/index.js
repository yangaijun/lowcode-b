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
var region_1 = __importDefault(require("../region"));
var util_1 = require("../utils/util");
var util_2 = require("./util");
var props_1 = require("../config/props");
var config_1 = require("../config/config");
var keyName = 'Form';
function getSubmitItem(innerColumns) {
    var _a;
    for (var _i = 0, innerColumns_1 = innerColumns; _i < innerColumns_1.length; _i++) {
        var item = innerColumns_1[_i];
        if (Array.isArray(item)) {
            var result = getSubmitItem(item);
            if (result) {
                return result;
            }
        }
        else if (((_a = item.prop) === null || _a === void 0 ? void 0 : _a.indexOf(props_1.submitProp)) === 0) {
            return item;
        }
    }
    return null;
}
function isLoadingSubmit(columnItem) {
    var _a;
    if (columnItem === null) {
        return false;
    }
    else {
        return ((_a = columnItem.config) === null || _a === void 0 ? void 0 : _a.loading) === true;
    }
}
function isOnSubmit(params, columnItem) {
    var _a, _b;
    return ((_a = params.prop) === null || _a === void 0 ? void 0 : _a.indexOf(props_1.submitProp)) === 0
        || (((_b = params.column.config) === null || _b === void 0 ? void 0 : _b[props_1.submitEventType]) === params.type && !isLoadingSubmit(columnItem));
}
var FForm = function (props, ref) {
    var className = props.className, style = props.style, data = props.data, columns = props.columns, onSubmit = props.onSubmit, onEvent = props.onEvent, onChange = props.onChange, config = props.config;
    var _a = (0, react_1.useState)(null), validateField = _a[0], setValidateField = _a[1];
    var innerRef = (0, react_1.useRef)({ data: {}, submitInfo: { column: undefined, params: undefined } });
    var form = antd_1.Form.useForm()[0];
    var region = (0, react_1.useRef)();
    var innerColumns = (0, react_1.useMemo)(function () {
        if (!Array.isArray(columns))
            return [];
        var nextColumns = (0, util_2.setColumns)(innerRef.current.data, columns);
        innerRef.current.submitInfo.column = getSubmitItem(nextColumns);
        return nextColumns;
    }, [columns]);
    var reset = (0, react_1.useCallback)(function () {
        form.resetFields();
        region.current.reset(null);
    }, [form]);
    var submit = (0, react_1.useCallback)(function () { return form.submit(); }, [form]);
    (0, react_1.useImperativeHandle)(ref, function () {
        var _a = region.current || {}, get = _a.get, set = _a.set;
        return { submit: submit, reset: reset, set: set, get: get };
    });
    (0, react_1.useEffect)(function () {
        (0, util_1.resetToOtherObject)(innerRef.current.data, data);
    }, [data]);
    (0, react_1.useEffect)(function () {
        if (validateField) {
            form.validateFields(validateField);
        }
    }, [form, validateField]);
    var innerEvent = (0, react_1.useCallback)(function (params) {
        var _a;
        if (params.type === props_1.changeType && params.prop) {
            setValidateField([params.prop]);
        }
        else if (isOnSubmit(params, innerRef.current.submitInfo.column)) {
            innerRef.current.submitInfo.params = params;
            submit();
        }
        else if ((_a = params.prop) === null || _a === void 0 ? void 0 : _a.includes(props_1.resetProp)) {
            form.resetFields();
        }
        return onEvent && onEvent(params);
    }, [form, submit, onEvent]);
    var innerChange = (0, react_1.useCallback)(function (data) {
        (0, util_1.resetToOtherObject)(innerRef.current.data, data);
        onChange && onChange(data);
    }, [onChange]);
    var onFinish = (0, react_1.useCallback)(function () {
        var back = onSubmit && onSubmit(region.current.get(), innerRef.current.submitInfo.params);
        //onSubmit return null 可以重置表单
        if (back === null) {
            reset();
        }
    }, [onSubmit, reset]);
    var innerConfig = (0, react_1.useMemo)(function () {
        var DefaultConfigs = (0, config_1.getDefaultConfigs)()[0];
        return (0, util_1.objectMerge)({}, ['labelCol', 'wrapperCol'], DefaultConfigs.Form, config);
    }, [config]);
    var _style = (0, react_1.useMemo)(function () { return (0, util_1.getStyle)(keyName, style); }, [style]);
    var _className = (0, react_1.useMemo)(function () { return (0, util_1.getClass)(keyName, className); }, [className]);
    return react_1.default.createElement(antd_1.Form, __assign({ form: form, onFinish: onFinish, className: _className, style: _style }, innerConfig, { validateTrigger: "none" }),
        react_1.default.createElement(region_1.default, { data: data, ref: region, columns: innerColumns, onEvent: innerEvent, onChange: innerChange }));
};
var F = (0, react_1.forwardRef)(FForm);
var InnerF = F;
InnerF[props_1.isRenderComponent] = true;
exports.default = InnerF;
