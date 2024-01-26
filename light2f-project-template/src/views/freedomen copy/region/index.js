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
exports.isContainer = void 0;
var react_1 = __importStar(require("react"));
var render_1 = __importStar(require("../render"));
var containers_1 = require("../containers");
var props_1 = require("../config/props");
var util_1 = __importStar(require("../utils/util"));
var permission_1 = require("../config/permission");
var elements_1 = require("../elements");
var base_1 = require("../utils/base");
var useUpdateEffect_1 = __importDefault(require("../hooks/useUpdateEffect"));
var context_1 = require("../context");
var keyName = 'Region';
function isResetProp(prop) {
    if (prop === void 0) { prop = ''; }
    return prop.indexOf(props_1.resetProp) === 0;
}
function getType(column) {
    var columnType = (0, base_1.getFullType)(column);
    if (columnType.includes('@')) {
        columnType = columnType.split('@')[0];
    }
    return columnType.split('-')[0];
}
function isContainer(column) {
    if (column === void 0) { column = {}; }
    var regionType = (0, base_1.getFullType)(column);
    return regionType.indexOf(render_1.renderContainerType) === 0 || containers_1.CONTAINER_NAMES.includes(getType(column));
}
exports.isContainer = isContainer;
function getResetColumn(column, data, preData) {
    var newColumn = __assign({}, column);
    newColumn.value = (0, util_1.isUndefined)(data, newColumn.prop) ? newColumn.value : (0, util_1.getChainValueByString)(data, newColumn.prop);
    newColumn.$data = data;
    newColumn.$preData = preData;
    var type = getType(newColumn);
    //use register render
    if (type && render_1.customRenders[type]) {
        newColumn.render = render_1.customRenders[type].render;
        newColumn[props_1.customTypeProp] = newColumn.type;
        //delete type key
        newColumn.type = render_1.customRenders[type].isContainer ? render_1.renderContainerType : render_1.renderType;
    }
    return newColumn;
}
function getResetColumns(columns, data, preData) {
    var newColumns = [];
    for (var i = 0; i < columns.length; i++) {
        var column = columns[i];
        if (Array.isArray(column)) {
            newColumns.push(getResetColumns(column, data, preData));
        }
        else {
            newColumns.push(getResetColumn(column, data, preData));
        }
    }
    return newColumns;
}
var cloneData = function (data) {
    return util_1.default.clone(data);
};
var FRegion = function (props, ref) {
    var data = props.data, columns = props.columns, className = props.className, style = props.style, onEvent = props.onEvent, onChange = props.onChange;
    //内部维护数据
    var _a = (0, react_1.useState)(function () { return data || {}; }), innerData = _a[0], setInnerData = _a[1];
    //preData: 上一次的数据，data: 当前的数据
    var innerRef = (0, react_1.useRef)({ preData: {}, data: innerData, onEvent: onEvent, onChange: onChange });
    //第一次放入的初始化数据，用户使用 reset 方法回到此数据
    var initialData = (0, react_1.useState)(function () { return data ? cloneData(data) : {}; })[0];
    var _b = (0, react_1.useState)(null), eventParams = _b[0], setEventParams = _b[1];
    var permissionContext = (0, react_1.useContext)(context_1.PermissionContext);
    //将当前的数据放到上一次数据对象，将下一步的数据放入当前数据数据
    var setPreDataAndCurrentData = (0, react_1.useCallback)(function (nextData) {
        (0, util_1.resetToOtherObject)(innerRef.current.preData, innerRef.current.data);
        (0, util_1.resetToOtherObject)(innerRef.current.data, nextData);
        setInnerData(nextData);
    }, []);
    var changeInnerData = (0, react_1.useCallback)(function (nextData, params) {
        var _a, _b;
        setPreDataAndCurrentData(nextData);
        (_b = (_a = innerRef.current).onChange) === null || _b === void 0 ? void 0 : _b.call(_a, nextData);
        params && setEventParams(params);
    }, [setPreDataAndCurrentData]);
    var setItemValue = (0, react_1.useCallback)(function (prop, callback) {
        if (!prop)
            return;
        var nextData = cloneData(innerRef.current.data);
        var setValue = function (data, prop, cb) {
            var value = cb;
            if (typeof value === 'function') {
                value = callback((0, util_1.getChainValueByString)(data, prop));
            }
            (0, util_1.setChainValueByString)(data, prop, value);
        };
        if (typeof prop === 'string') {
            setValue(nextData, prop, callback);
            changeInnerData(nextData);
        }
        else {
            for (var key in prop) {
                setValue(nextData, key, prop[key]);
            }
            changeInnerData(nextData);
        }
    }, [changeInnerData]);
    var getItemValue = (0, react_1.useCallback)(function (prop) {
        if (!prop) {
            return cloneData(innerRef.current.data);
        }
        return (0, util_1.getChainValueByString)(cloneData(innerRef.current.data), prop);
    }, []);
    var reset = (0, react_1.useCallback)(function (params) {
        if (params) {
            params.row = cloneData(initialData);
        }
        changeInnerData(cloneData(initialData), params);
    }, [initialData, changeInnerData]);
    var handlerEvent = (0, react_1.useCallback)(function (params) {
        var _a, _b;
        var nextData = (_b = (_a = innerRef.current).onEvent) === null || _b === void 0 ? void 0 : _b.call(_a, params);
        if (nextData) {
            //TODO 要优化么，return 来的值等主线程结束再执行
            setTimeout(function () { changeInnerData(nextData); });
        }
        else if (nextData === null) {
            reset();
        }
    }, [changeInnerData, reset]);
    var innerEvent = (0, react_1.useCallback)(function (params) {
        if (isResetProp(params.prop)) {
            reset(params);
        }
        else {
            params.row = cloneData(innerRef.current.data);
            handlerEvent(params);
        }
    }, [reset, handlerEvent]);
    var innerChange = (0, react_1.useCallback)(function (params) {
        if (params.prop) {
            var nextData = cloneData(innerRef.current.data);
            (0, util_1.setChainValueByString)(nextData, params.prop, params.value);
            var nextParams = __assign(__assign({}, params), { type: props_1.changeType, row: cloneData(nextData) });
            changeInnerData(nextData, nextParams);
        }
    }, [changeInnerData]);
    (0, react_1.useImperativeHandle)(ref, function () {
        return { reset: reset, set: setItemValue, get: getItemValue };
    });
    (0, react_1.useEffect)(function () {
        innerRef.current.onChange = onChange;
    }, [onChange]);
    (0, react_1.useEffect)(function () {
        innerRef.current.onEvent = onEvent;
    }, [onEvent]);
    (0, useUpdateEffect_1.default)(function () {
        data && setPreDataAndCurrentData(data);
    }, [data, setPreDataAndCurrentData]);
    (0, react_1.useEffect)(function () {
        if (eventParams) {
            handlerEvent(eventParams);
            setEventParams(null);
        }
    }, [eventParams, handlerEvent]);
    var getContainer = (0, react_1.useCallback)(function (column, children, key) {
        var type = getType(column);
        var Container = type === render_1.renderType ? render_1.default : (0, containers_1.getContainerDom)(type);
        return react_1.default.createElement(Container, { key: key, onChange: innerChange, onEvent: innerEvent, children: children, item: column });
    }, [innerChange, innerEvent]);
    var getElement = (0, react_1.useCallback)(function (column, key) {
        var type = getType(column);
        var Element = type === render_1.renderType ? render_1.default : (0, elements_1.getElementDom)(type);
        if (!Element) {
            console.error('未发现的元素类型：=>', type);
            return null;
        }
        return react_1.default.createElement(Element, { key: key, onEvent: innerEvent, onChange: innerChange, item: column });
    }, [innerEvent, innerChange]);
    var isLoad = (0, react_1.useCallback)(function (column) {
        var _a;
        var _b = innerRef.current, data = _b.data, preData = _b.preData;
        var params = { column: column, data: data, preData: preData, value: column.value };
        var globalPermission = (_a = (permissionContext.hasPermission || permission_1.hasPermission)) === null || _a === void 0 ? void 0 : _a(params);
        if (typeof column.load === 'function') {
            return column.load(params) && globalPermission;
        }
        return globalPermission;
    }, [permissionContext.hasPermission]);
    var makeJsx = (0, react_1.useCallback)(function (columns, level) {
        if (!columns.length)
            return;
        var container = [], children = [];
        var lastColumn = (0, util_1.getArrayLastItem)(columns);
        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            if (isContainer(lastColumn) && !isLoad(lastColumn))
                break;
            var key = (0, util_1.getOrderKey)(level, i);
            if (isContainer(column)) {
                container.push(getContainer(column, children, key));
                children = [];
            }
            else if (Array.isArray(column)) {
                children.push(makeJsx(column, key));
            }
            else if (!isLoad(column)) {
                continue;
            }
            else {
                children.push(getElement(column, key));
            }
        }
        if (!isContainer(lastColumn)) {
            container.push(children);
        }
        return container;
    }, [isLoad, getContainer, getElement]);
    var _style = (0, react_1.useMemo)(function () { return (0, util_1.getStyle)(keyName, style); }, [style]);
    var _className = (0, react_1.useMemo)(function () { return (0, util_1.getClass)(keyName, className); }, [className]);
    var render = (0, react_1.useMemo)(function () {
        if (!Array.isArray(columns))
            return;
        return makeJsx(getResetColumns(columns, innerData, innerRef.current.preData));
    }, [columns, innerData, makeJsx]);
    if ((_style && Object.keys(_style).length) || _className) {
        return react_1.default.createElement("div", { style: style, className: _className }, render);
    }
    else {
        return react_1.default.createElement(react_1.default.Fragment, null,
            " ",
            render,
            " ");
    }
};
var R = (0, react_1.forwardRef)(FRegion);
var InnerR = R;
InnerR[props_1.isRenderComponent] = true;
exports.default = InnerR;
