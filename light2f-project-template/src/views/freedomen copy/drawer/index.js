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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var antd_1 = require("antd");
var form_1 = __importDefault(require("../form"));
var drawerStack = {};
var ridkeys = ['cancelButtonProps', 'okButtonProps', 'cancelText', 'okText'];
function ridConfig(config, ridkeys) {
    if (config === void 0) { config = {}; }
    var newConfig = __assign({}, config);
    ridkeys.forEach(function (key) {
        delete newConfig[key];
    });
    return newConfig;
}
var FDrawer = function (props) {
    var name = props.name, children = props.children, onOk = props.onOk, onCancel = props.onCancel, noForm = props.noForm, cancelText = props.cancelText, okText = props.okText, config = props.config, restProps = __rest(props, ["name", "children", "onOk", "onCancel", "noForm", "cancelText", "okText", "config"]);
    var innerForm = (0, react_1.useRef)();
    var findForm = (0, react_1.useCallback)(function (content) {
        if (noForm === true)
            return content;
        if (content) {
            return react_1.default.Children.map(content, function (child) {
                var _a, _b;
                if ((child === null || child === void 0 ? void 0 : child.type) === form_1.default) {
                    return react_1.default.cloneElement(child, {
                        ref: function (r) {
                            if (child.ref) {
                                if (typeof child.ref === 'function') {
                                    child.ref(r);
                                }
                                else {
                                    child.ref.current = r;
                                }
                            }
                            innerForm.current = r;
                        }
                    });
                }
                else if ((_a = child === null || child === void 0 ? void 0 : child.props) === null || _a === void 0 ? void 0 : _a.children) {
                    return react_1.default.cloneElement(child, undefined, findForm((_b = child.props) === null || _b === void 0 ? void 0 : _b.children));
                }
                else {
                    return child;
                }
            });
        }
        else {
            return null;
        }
    }, [noForm]);
    var _a = (0, react_1.useState)(), drawerProps = _a[0], setDrawerProps = _a[1];
    var _b = (0, react_1.useState)(), drawerContent = _b[0], setModalContent = _b[1];
    var setProps = (0, react_1.useCallback)(function (props) {
        setDrawerProps(function (dps) {
            return __assign(__assign({}, dps), props);
        });
    }, []);
    var hander = (0, react_1.useCallback)(function (fn) {
        var back = fn && fn();
        if (back === undefined) {
            setProps({ open: false });
        }
    }, [setProps]);
    var handerOnCancel = (0, react_1.useCallback)(function () {
        hander(onCancel);
    }, [hander, onCancel]);
    var handerOnOk = (0, react_1.useCallback)(function () {
        if (innerForm.current) {
            innerForm.current.submit();
            return;
        }
        hander(onOk);
    }, [hander, onOk]);
    var setContent = (0, react_1.useCallback)(function (content) {
        setModalContent(findForm(content));
    }, [findForm]);
    (0, react_1.useEffect)(function () {
        setModalContent(findForm(children));
    }, [children, findForm]);
    (0, react_1.useEffect)(function () {
        if (name) {
            drawerStack[name] = { setContent: setContent, setProps: setProps };
            return function () {
                delete drawerStack[name];
            };
        }
    }, [name, setContent, setProps]);
    (0, react_1.useEffect)(function () {
        if (!(drawerProps === null || drawerProps === void 0 ? void 0 : drawerProps.open)) {
            setProps({ okButtonProps: { loading: false } });
        }
    }, [drawerProps === null || drawerProps === void 0 ? void 0 : drawerProps.open, setProps]);
    var icancelText = cancelText || (config === null || config === void 0 ? void 0 : config.cancelText) || (drawerProps === null || drawerProps === void 0 ? void 0 : drawerProps.cancelText) || '取消';
    var iokText = okText || (config === null || config === void 0 ? void 0 : config.okText) || (drawerProps === null || drawerProps === void 0 ? void 0 : drawerProps.okText) || '确定';
    var ridKeysConfig = ridConfig(restProps, ridkeys);
    return (react_1.default.createElement(antd_1.Drawer, __assign({ destroyOnClose: true, onClose: handerOnCancel, extra: react_1.default.createElement(antd_1.Space, null,
            react_1.default.createElement(antd_1.Button, __assign({ onClick: handerOnCancel }, config === null || config === void 0 ? void 0 : config.cancelButtonProps, drawerProps === null || drawerProps === void 0 ? void 0 : drawerProps.cancelButtonProps), icancelText),
            react_1.default.createElement(antd_1.Button, __assign({ type: "primary", onClick: handerOnOk }, config === null || config === void 0 ? void 0 : config.okButtonProps, drawerProps === null || drawerProps === void 0 ? void 0 : drawerProps.okButtonProps), iokText)) }, ridKeysConfig, drawerProps), drawerContent));
};
FDrawer.open = function (name, props) {
    if (drawerStack[name]) {
        var drawer = drawerStack[name];
        var setContent = drawer.setContent, setProps = drawer.setProps;
        var newProps = typeof props === 'string' ? { title: props } : props;
        setProps(__assign({ open: true }, newProps));
        return Promise.resolve(setContent);
    }
};
FDrawer.close = function (name) {
    if (drawerStack[name]) {
        var drawer = drawerStack[name];
        var setProps = drawer.setProps;
        setProps({ open: false });
    }
};
FDrawer.loading = function (name, loading) {
    if (loading === void 0) { loading = true; }
    if (drawerStack[name]) {
        var drawer = drawerStack[name];
        var setProps = drawer.setProps;
        setProps({ okButtonProps: { loading: loading } });
    }
};
exports.default = FDrawer;
