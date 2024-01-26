"use strict";
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
exports.removeRender = exports.registerRender = exports.customRenders = exports.renderTypes = exports.renderContainerType = exports.renderType = void 0;
var react_1 = __importStar(require("react"));
var useBase_1 = require("../hooks/useBase");
var base_1 = require("../utils/base");
var util_1 = __importStar(require("../utils/util"));
var props_1 = require("../config/props");
function Render(props) {
    var children = props.children, item = props.item;
    var prop = item.prop, value = item.value, placeholder = item.placeholder, render = item.render, data = item.$data, preData = item.$preData;
    var useUpdateRef = (0, react_1.useRef)({ shouldUpdate: null, cache: null, effectPre: {}, effectCurrent: {} });
    var onChange = (0, useBase_1.useChange)(props);
    var onEvent = (0, useBase_1.useEvent)(props);
    var style = (0, useBase_1.useStyle)(props);
    var className = (0, useBase_1.useClassName)(props);
    var disabled = (0, useBase_1.useDisabled)(props);
    var config = (0, useBase_1.useConfig)(props);
    var type = (0, base_1.getFullType)(item);
    var getRenderCache = function () {
        var _a, _b;
        var shouldUpdate = function (callback) {
            useUpdateRef.current.shouldUpdate = callback;
        };
        //防止注册进来没法每个update,所以config中也可以使用
        if (config.shouldUpdate) {
            useUpdateRef.current.shouldUpdate = config.shouldUpdate;
            delete config.shouldUpdate;
        }
        var cache = render && render({
            value: value,
            preData: preData,
            data: data,
            children: children,
            $base: { style: style, className: className, placeholder: placeholder, disabled: disabled, onChange: onChange, onEvent: onEvent, config: config, shouldUpdate: shouldUpdate }
        });
        if ((_a = cache === null || cache === void 0 ? void 0 : cache.type) === null || _a === void 0 ? void 0 : _a[props_1.isRenderComponent]) {
            var _c = cache.props, _d = _c.data, cacheData = _d === void 0 ? value : _d, _e = _c.onChange, cacheOnChange = _e === void 0 ? function (data) { return onChange(data); } : _e, _f = _c.config, cacheConfig = _f === void 0 ? config : _f;
            cache = react_1.default.cloneElement(cache, {
                name: ((_b = cache === null || cache === void 0 ? void 0 : cache.type) === null || _b === void 0 ? void 0 : _b[props_1.hasNameProp]) ? prop : undefined,
                data: cacheData,
                onChange: cacheOnChange,
                config: cacheConfig,
            }, null);
        }
        return cache;
    };
    var renderd = (0, react_1.useMemo)(function () {
        useUpdateRef.current.effectPre = useUpdateRef.current.effectCurrent;
        useUpdateRef.current.effectCurrent = { style: style, className: className, disabled: disabled, placeholder: placeholder, config: config };
        var _a = useUpdateRef.current, shouldUpdate = _a.shouldUpdate, cache = _a.cache;
        if (cache === null ||
            util_1.default.notEquals(useUpdateRef.current.effectPre, useUpdateRef.current.effectCurrent) ||
            (prop && util_1.default.notEquals((0, util_1.getChainValueByString)(preData, prop), (0, util_1.getChainValueByString)(data, prop))) ||
            type.indexOf(exports.renderContainerType) === 0 ||
            shouldUpdate === true ||
            (shouldUpdate && shouldUpdate(preData, data))) {
            useUpdateRef.current.cache = getRenderCache();
        }
        return useUpdateRef.current.cache;
    }, [type, getRenderCache, prop, preData, data, style, className, disabled, placeholder, config, children]);
    return renderd;
}
exports.default = Render;
exports.renderType = 'render';
exports.renderContainerType = 'render-c';
exports.renderTypes = [exports.renderType, exports.renderContainerType];
exports.customRenders = {};
function registerRender(type, render, isContainer) {
    if (isContainer === void 0) { isContainer = false; }
    if (type && render) {
        exports.customRenders[type] = { render: render, isContainer: isContainer };
    }
    else {
        console.warn('registerRender, type and render are required');
    }
    return { registerRender: registerRender };
}
exports.registerRender = registerRender;
/**
 * 删除注册的组件，不传type 删除全部
 * @param type string
 */
function removeRender(type) {
    if (type) {
        delete exports.customRenders[type];
    }
    else {
        for (var i in exports.customRenders) {
            delete exports.customRenders[i];
        }
    }
}
exports.removeRender = removeRender;
