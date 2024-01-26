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
exports.useListComponent = exports.useOptionIOValue = exports.useOptionNames = exports.useOptions = exports.useRidkeyConfig = exports.useConfig = exports.useChildren = exports.useFilter = exports.useAddCallbackValue = exports.useItemStyle = exports.useStyle = exports.useClassName = exports.useDisabled = exports.useEvent = exports.useChange = void 0;
var react_1 = require("react");
var base_1 = require("../utils/base");
var props_1 = require("../config/props");
var util_1 = __importStar(require("../utils/util"));
var useUpdateEffect_1 = __importDefault(require("./useUpdateEffect"));
var antd_1 = require("antd");
var permission_1 = require("../config/permission");
var context_1 = require("../context");
function useChange(props) {
    var onChange = props.onChange, item = props.item;
    var innerRef = (0, react_1.useRef)({ onChange: onChange, item: item });
    (0, react_1.useEffect)(function () {
        innerRef.current.onChange = onChange;
        innerRef.current.item = item;
    }, [onChange, item]);
    return (0, react_1.useMemo)(function () {
        var _a = innerRef.current, onChange = _a.onChange, item = _a.item;
        return function (value) {
            onChange && onChange({
                prop: item.prop,
                value: value,
                column: item
            });
        };
    }, []);
}
exports.useChange = useChange;
function useEvent(props) {
    var onEvent = props.onEvent, item = props.item;
    var innerRef = (0, react_1.useRef)({ onEvent: onEvent, item: item });
    (0, react_1.useEffect)(function () {
        innerRef.current.onEvent = onEvent;
        innerRef.current.item = item;
    }, [onEvent, item]);
    return (0, react_1.useMemo)(function () {
        var _a = innerRef.current, onEvent = _a.onEvent, item = _a.item;
        return function (type, value) {
            onEvent && onEvent({
                prop: item.prop,
                type: type,
                value: value,
                column: item
            });
        };
    }, []);
}
exports.useEvent = useEvent;
function useDisabled(props) {
    var _a = props.item, disabled = _a.disabled, data = _a.$data, preData = _a.$preData, value = _a.value;
    var permissionContext = (0, react_1.useContext)(context_1.PermissionContext);
    var makeDisabled = (0, react_1.useCallback)(function () {
        var next = disabled;
        var params = { value: value, data: data, preData: preData };
        var innerIsDisabled = permissionContext.isDisabled || permission_1.isDisabled;
        if (typeof disabled === 'function') {
            next = disabled(params);
        }
        return next || (innerIsDisabled === null || innerIsDisabled === void 0 ? void 0 : innerIsDisabled(__assign(__assign({}, params), { column: props.item })));
    }, [disabled, value, permissionContext.isDisabled, data, preData]);
    var _b = (0, react_1.useState)(function () { return makeDisabled(); }), innerDisabled = _b[0], setInnerDisabled = _b[1];
    (0, useUpdateEffect_1.default)(function () {
        var next = makeDisabled();
        if (util_1.default.notEquals(innerDisabled, next)) {
            setInnerDisabled(next);
        }
    }, [makeDisabled, innerDisabled]);
    return innerDisabled;
}
exports.useDisabled = useDisabled;
function useClassName(props) {
    var _a = props.item, type = _a.type, className = _a.className, data = _a.$data, preData = _a.$preData, value = _a.value;
    var makeClassName = (0, react_1.useCallback)(function () {
        var next = className;
        if (typeof className === 'function')
            next = className({ value: value, data: data, preData: preData });
        else if (!className) {
            next = (0, base_1.getClass)({ type: type, data: data, value: value });
        }
        return next;
    }, [type, className, value, data, preData]);
    var _b = (0, react_1.useState)(function () { return makeClassName(); }), innerClassName = _b[0], setInnerClassName = _b[1];
    (0, useUpdateEffect_1.default)(function () {
        var next = makeClassName();
        if (util_1.default.notEquals(innerClassName, next)) {
            setInnerClassName(next);
        }
    }, [makeClassName, innerClassName]);
    return innerClassName;
}
exports.useClassName = useClassName;
function useStyle(props) {
    var _a = props.item, type = _a.type, style = _a.style, data = _a.$data, preData = _a.$preData, value = _a.value;
    var makeStyle = (0, react_1.useCallback)(function () {
        var next = (0, base_1.getStyle)({ type: type, value: value, data: data });
        if (typeof style === 'function') {
            next = __assign(__assign({}, next), style({ value: value, data: data, preData: preData }));
        }
        else {
            next = __assign(__assign({}, next), style);
        }
        return next;
    }, [type, style, value, data, preData]);
    var _b = (0, react_1.useState)(function () { return makeStyle(); }), innerStyle = _b[0], setInnerStyle = _b[1];
    (0, useUpdateEffect_1.default)(function () {
        var next = makeStyle();
        if (util_1.default.notEquals(innerStyle, next)) {
            setInnerStyle(next);
        }
    }, [makeStyle, innerStyle]);
    return innerStyle;
}
exports.useStyle = useStyle;
function useItemStyle(props, options) {
    var item = props.item;
    var makeStyles = (0, react_1.useCallback)(function () {
        return options.map(function (option) {
            return (0, base_1.getOptionStyle)(option, item);
        });
    }, [options, item]);
    var _a = (0, react_1.useState)(function () { return makeStyles(); }), innerStyles = _a[0], setInnerStyles = _a[1];
    (0, useUpdateEffect_1.default)(function () {
        var next = makeStyles();
        if (util_1.default.notEquals(innerStyles, next)) {
            setInnerStyles(next);
        }
    }, [makeStyles, innerStyles]);
    return innerStyles;
}
exports.useItemStyle = useItemStyle;
function useAddCallbackValue(props, canCallbackValue) {
    var _a = props.item, data = _a.$data, preData = _a.$preData, value = _a.value;
    var makeAddCallbackValue = (0, react_1.useCallback)(function () {
        var next = canCallbackValue;
        if (typeof canCallbackValue === 'function') {
            next = canCallbackValue({ value: value, data: data, preData: preData });
        }
        return next;
    }, [value, data, preData, canCallbackValue]);
    var _b = (0, react_1.useState)(function () { return makeAddCallbackValue(); }), innerCallbackValue = _b[0], setInnerCallbackValue = _b[1];
    (0, useUpdateEffect_1.default)(function () {
        var next = makeAddCallbackValue();
        if (util_1.default.notEquals(innerCallbackValue, next)) {
            setInnerCallbackValue(next);
        }
    }, [makeAddCallbackValue, innerCallbackValue]);
    return innerCallbackValue;
}
exports.useAddCallbackValue = useAddCallbackValue;
function useFilter(props) {
    var _a = props.item, filter = _a.filter, data = _a.$data, preData = _a.$preData, value = _a.value;
    var makeFilter = (0, react_1.useCallback)(function () {
        var next = value;
        if (typeof filter === 'function') {
            next = filter({ value: value, data: data, preData: preData });
        }
        else if (util_1.default.isPlainObject(filter)) {
            next = filter[value] || filter[props_1.filterDefaultKey];
        }
        else if (typeof filter === 'string') {
            if (value === void 0 || value === null)
                next = props_1.defaultFilterVoidText;
            var date = new Date(value);
            if (date.toString() !== 'Invalid Date') {
                next = util_1.default.dateFormat(filter, date);
            }
        }
        return next;
    }, [filter, value, data, preData]);
    var _b = (0, react_1.useState)(function () { return makeFilter(); }), innerFilter = _b[0], setInnerFilter = _b[1];
    (0, useUpdateEffect_1.default)(function () {
        var next = makeFilter();
        if (util_1.default.notEquals(innerFilter, next)) {
            setInnerFilter(next);
        }
    }, [makeFilter, innerFilter]);
    return innerFilter;
}
exports.useFilter = useFilter;
function useChildren(props) {
    return props.children;
}
exports.useChildren = useChildren;
function useConfig(props) {
    var item = props.item;
    var onEvent = useEvent(props);
    var makeConfig = (0, react_1.useCallback)(function () {
        return (0, base_1.getConfig)(item, onEvent);
    }, [item, onEvent]);
    var _a = (0, react_1.useState)(function () { return makeConfig(); }), innerConfig = _a[0], setInnerConfig = _a[1];
    (0, useUpdateEffect_1.default)(function () {
        var next = makeConfig();
        if (util_1.default.notEquals(innerConfig, next)) {
            setInnerConfig(next);
        }
    }, [makeConfig, innerConfig]);
    return innerConfig;
}
exports.useConfig = useConfig;
function useRidkeyConfig(config, ridKeys) {
    if (ridKeys === void 0) { ridKeys = []; }
    var makeRidkeyConfig = (0, react_1.useCallback)(function () {
        var next = __assign({}, config);
        ridKeys.forEach(function (key) {
            delete next[key];
        });
        return next;
    }, [config, ridKeys]);
    var _a = (0, react_1.useState)(function () { return makeRidkeyConfig(); }), innerRidkeyConfig = _a[0], setInnerRidkeyConfig = _a[1];
    (0, useUpdateEffect_1.default)(function () {
        var next = makeRidkeyConfig();
        if (util_1.default.notEquals(innerRidkeyConfig, next)) {
            setInnerRidkeyConfig(next);
        }
    }, [makeRidkeyConfig, innerRidkeyConfig]);
    return innerRidkeyConfig;
}
exports.useRidkeyConfig = useRidkeyConfig;
function useOptions(props, innerValue) {
    var _a = props.item, prop = _a.prop, options = _a.options, data = _a.$data, value = _a.value, preData = _a.$preData, config = _a.config;
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(function () {
        if (typeof options !== 'function') {
            return util_1.default.resetOptions(options);
        }
        return [];
    }), innerOptions = _c[0], setInnerOptions = _c[1];
    var useUpdateRef = (0, react_1.useRef)({ shouldUpdate: null, shouldLoad: undefined });
    var debounceWait = (config === null || config === void 0 ? void 0 : config.debounceWait) || props_1.defaultDebounceWait;
    var debounceFn = (0, react_1.useCallback)((0, util_1.debounce)(function (callback) {
        callback();
    }, debounceWait), [debounceWait]);
    (0, react_1.useEffect)(function () {
        debounceFn(function () {
            var resetOptions = function (next) {
                if (util_1.default.notEquals(innerOptions, next)) {
                    setInnerOptions(next);
                }
            };
            if (typeof options !== 'function') {
                resetOptions(util_1.default.resetOptions(options));
            }
            else {
                var shouldUpdate_1 = function (callback) {
                    useUpdateRef.current.shouldUpdate = callback;
                };
                var calcNeedUpdate = function () {
                    var shouldUpdate = useUpdateRef.current.shouldUpdate;
                    if (innerValue !== undefined && shouldUpdate === null) {
                        return true;
                    }
                    else if (shouldUpdate !== null) {
                        return typeof shouldUpdate === 'boolean' ? shouldUpdate : shouldUpdate(preData, data);
                    }
                    else {
                        return false;
                    }
                };
                //undifined 也是一种
                if (useUpdateRef.current.shouldLoad !== false || calcNeedUpdate()) {
                    if (useUpdateRef.current.shouldLoad === undefined) {
                        useUpdateRef.current.shouldLoad = false;
                    }
                    var promise = new Promise(function (resolve) {
                        setLoading(true);
                        var nextValue = innerValue !== undefined ? innerValue : value;
                        options({ resolve: resolve, data: data, value: nextValue, preData: preData, shouldUpdate: shouldUpdate_1 });
                    });
                    promise.then(function (options) {
                        setLoading(false);
                        resetOptions(util_1.default.resetOptions(options));
                    });
                }
            }
        });
    }, [prop, innerOptions, value, preData, data, options, innerValue]);
    return {
        options: innerOptions,
        loading: loading
    };
}
exports.useOptions = useOptions;
function useOptionNames(config) {
    var labelname = config.labelname, valuename = config.valuename, childrenname = config.childrenname;
    return (0, react_1.useMemo)(function () {
        return {
            labelname: labelname || props_1.names.labelname,
            valuename: valuename || props_1.names.valuename,
            childrenname: childrenname || props_1.names.childrenname
        };
    }, [labelname, valuename]);
}
exports.useOptionNames = useOptionNames;
function notNull(value) {
    return value !== undefined && value !== null;
}
function useOptionIOValue(config, options, value) {
    var valuename = useOptionNames(config).valuename;
    var optionvalue = config[props_1.names.optionvalue];
    return (0, react_1.useMemo)(function () {
        if (optionvalue) {
            var innerValue = value;
            var outerValue = function (next) {
                if (Array.isArray(next)) {
                    return options.filter(function (option) {
                        return next.includes(option[valuename]);
                    });
                }
                else if (notNull(next)) {
                    return options.find(function (option) {
                        return option[valuename] === next;
                    });
                }
                return next;
            };
            if (Array.isArray(value)) {
                innerValue = value.map(function (el) {
                    return util_1.default.isPlainObject(el) ? el[valuename] : el;
                });
            }
            else if (notNull(value)) {
                innerValue = (util_1.default.isPlainObject(value) ? value[valuename] : value);
            }
            return {
                innerValue: innerValue,
                outerValue: outerValue
            };
        }
        else {
            return {
                innerValue: value,
                outerValue: function (next) { return next; }
            };
        }
    }, [value, valuename, optionvalue, options]);
}
exports.useOptionIOValue = useOptionIOValue;
function useListComponent(onChange, onEvent, data) {
    var getResetData = (0, react_1.useCallback)(function (data, $pIndexs, pIndex) {
        if (data === void 0) { data = []; }
        var newData = [];
        for (var i = 0; i < data.length; i++) {
            if (Array.isArray(data[i])) {
                newData.push(getResetData(data[i]));
            }
            else {
                var item = __assign(__assign({}, data[i]), { $index: i });
                if (!item.key) {
                    item.key = util_1.default.getUUID();
                }
                if (pIndex !== undefined) {
                    if ($pIndexs) {
                        item.$pIndexs = __spreadArray(__spreadArray([], $pIndexs, true), [pIndex], false);
                    }
                    else {
                        item.$pIndexs = [pIndex];
                    }
                }
                if (Array.isArray(data[i].children)) {
                    item.children = getResetData(data[i].children, item.$pIndexs, i);
                }
                newData.push(item);
            }
        }
        return newData;
    }, []);
    var _a = (0, react_1.useState)(function () { return getResetData(data); }), innerData = _a[0], setInnerData = _a[1];
    var innerRef = (0, react_1.useRef)({ data: innerData });
    var setNextData = (0, react_1.useCallback)(function (nextData) {
        innerRef.current.data = nextData;
        setInnerData(nextData);
        onChange && onChange(nextData);
    }, [onChange]);
    (0, useUpdateEffect_1.default)(function () {
        if (data && innerRef.current.data !== data) {
            var nextData = getResetData(data);
            setNextData(nextData);
        }
    }, [data, setNextData, getResetData]);
    var innerChange = (0, react_1.useCallback)(function (data) {
        var nextData = __spreadArray([], innerRef.current.data, true);
        var currentData = nextData;
        if (data.$pIndexs) {
            for (var index in data.$pIndexs) {
                if (Array.isArray(currentData)) {
                    currentData = currentData[index];
                }
                else if (Array.isArray(currentData.children)) {
                    currentData = currentData.children[index];
                }
            }
        }
        if (Array.isArray(currentData)) {
            currentData[data.$index] = data;
        }
        else if (Array.isArray(currentData.children)) {
            currentData.children[data.$index] = data;
        }
        setNextData(nextData);
    }, []);
    var innerEvent = (0, react_1.useCallback)(function (params) {
        if ([props_1.deleteProp, props_1.deleteTipProp, props_1.pushProp].includes(params.prop)) {
            var nextData_1 = __spreadArray([], innerRef.current.data, true);
            var deleteRow_1 = function () {
                nextData_1.splice(params.row.$index, 1);
                nextData_1 = nextData_1.map(function (el, index) {
                    //没变化，引用
                    if (el.$index === index)
                        return el;
                    //需要更新换地址
                    return __assign(__assign({}, el), { $index: index });
                });
            };
            //异步
            if (params.prop === props_1.deleteTipProp) {
                antd_1.Modal.confirm({
                    title: '提示',
                    content: '确定要删除行？',
                    onOk: function () {
                        deleteRow_1();
                        setNextData(nextData_1);
                    }
                });
                return;
            }
            if (params.prop === props_1.deleteProp) {
                deleteRow_1();
            }
            else if (params.prop === props_1.pushProp) {
                nextData_1.push({ $index: nextData_1.length, key: util_1.default.getUUID() });
            }
            setNextData(nextData_1);
        }
        return onEvent && onEvent(params);
    }, [onEvent]);
    return { innerData: innerData, innerChange: innerChange, innerEvent: innerEvent };
}
exports.useListComponent = useListComponent;
