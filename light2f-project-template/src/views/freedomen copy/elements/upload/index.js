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
var util_1 = __importDefault(require("../../utils/util"));
var base_1 = require("../../utils/base");
var icons_1 = require("@ant-design/icons");
var useBase_1 = require("../../hooks/useBase");
var Dragger = antd_1.Upload.Dragger;
var ridKeys = ['fileexts', 'filetypes', 'filesize', 'maxcount', 'text', 'filter', 'onSuccess', 'onError'];
var types = {
    upload: 'upload',
    primary: 'upload-primary',
    img: 'upload-img',
    imgs: 'upload-imgs',
    dragger: 'upload-dragger',
};
var texts = {
    upload: '点击上传',
    dragger: '点击或将文件拖拽到此区域进行上传'
};
function getBase64(img, callback) {
    var reader = new FileReader();
    reader.addEventListener('load', function () { return callback(reader.result); });
    reader.readAsDataURL(img);
}
function isRejectUploadFile(file) {
    return file.name !== void 0 && file.size !== void 0 && file.status === void 0;
}
/**
 * items 是否包含 item (不区分大小写)
 * @param {string} item
 * @param {string/number} uid
 * @param {string/array[string]} items
 * @returns
 */
function isIncludes(item, items) {
    return items.toString().toUpperCase().includes(item.toUpperCase());
}
function getItemValue(value, uid, data, filter) {
    if (typeof value === 'number' || typeof value === 'string') {
        var url = filter({ value: value, data: data });
        return { url: url, name: url, uid: uid };
    }
    else if (util_1.default.isPlainObject(value)) {
        var url = filter({ value: value, data: data });
        return __assign(__assign({}, value), { url: url, name: value.name || url, uid: uid });
    }
    else {
        return value;
    }
}
var imgContainerStyle = {
    width: "100%",
    height: "100%",
    display: "flex",
    position: "relative",
    alignItems: "center",
    justifyContent: "center"
};
var imgInnerStyle = {
    position: 'absolute',
    background: "rgba(0,0,0,0.45)",
    color: 'white',
    fontSize: 16
};
function FUpload(props) {
    var item = props.item;
    var _a = (0, react_1.useState)(false), loading = _a[0], setLoading = _a[1];
    var _b = (0, react_1.useState)(false), hover = _b[0], setHover = _b[1];
    var _c = (0, react_1.useState)(), innerValue = _c[0], setInnerValue = _c[1];
    var _d = (0, react_1.useState)(), imageUrl = _d[0], setImageUrl = _d[1];
    var innerRef = (0, react_1.useRef)({ value: null });
    var onChange = (0, useBase_1.useChange)(props);
    var style = (0, useBase_1.useStyle)(props);
    var className = (0, useBase_1.useClassName)(props);
    var disabled = (0, useBase_1.useDisabled)(props);
    var type = (0, base_1.getOriginalType)(item);
    var config = (0, useBase_1.useConfig)(props);
    var ridKeysConfig = (0, useBase_1.useRidkeyConfig)(config, ridKeys);
    //重设value
    var resetValue = (0, react_1.useCallback)(function (value) {
        var onSuccess = config.onSuccess;
        if (Array.isArray(value)) {
            var nextValue_1 = [];
            value.forEach(function (el) {
                var res = el;
                if (onSuccess && (el === null || el === void 0 ? void 0 : el.response)) {
                    res = onSuccess(el.response);
                }
                if (Array.isArray(res)) {
                    nextValue_1.push.apply(nextValue_1, res);
                }
                else {
                    nextValue_1.push(res);
                }
            });
            value = nextValue_1;
        }
        else {
            value = (onSuccess && (value === null || value === void 0 ? void 0 : value.response)) ? onSuccess(value.response) : value;
        }
        return value;
    }, [config]);
    (0, react_1.useEffect)(function () {
        var nextValue = resetValue(item.value);
        if (nextValue) {
            var tempValue = nextValue;
            if (!Array.isArray(nextValue)) {
                tempValue = [nextValue];
            }
            if (util_1.default.notEquals(tempValue, resetValue(innerRef.current.value))) {
                var filter_1 = config.filter;
                if (filter_1) {
                    if (Array.isArray(item.value)) {
                        //uid  不能为 0
                        nextValue = nextValue.map(function (v, index) { return getItemValue(v, index + 1, item.$data, filter_1); });
                    }
                    else {
                        nextValue = getItemValue(nextValue, 1, item.$data, filter_1);
                    }
                }
                //type === img
                if (!Array.isArray(nextValue)) {
                    setImageUrl(nextValue.url);
                }
                setInnerValue(nextValue);
            }
        }
        if (!nextValue && imageUrl) {
            setImageUrl(null);
        }
    }, [item.value, item.$data, config, imageUrl, resetValue]);
    var handleChange = (0, react_1.useCallback)(function (_a) {
        var _b;
        var file = _a.file, fileList = _a.fileList;
        fileList = fileList.filter(function (f) { return !isRejectUploadFile(f); });
        setInnerValue(fileList);
        if (file.status === 'removed') {
            if (Array.isArray(item.value)) {
                var nextValue = __spreadArray([], item.value, true);
                //下标从1开始的
                nextValue.splice(file.uid - 1, 1);
                innerRef.current.value = nextValue;
                onChange(nextValue);
            }
            else {
                onChange(null);
            }
        }
        else if (file.status === 'uploading') {
            setLoading(true);
        }
        else if (file.status === 'done') {
            setLoading(false);
            if (type === types.img) {
                getBase64(file.originFileObj, function (imageUrl) {
                    setHover(false);
                    setImageUrl(imageUrl);
                    onChange(resetValue(file));
                });
            }
            else {
                var nextValue = __spreadArray([], (item.value || []), true);
                nextValue.push(file);
                nextValue = resetValue(nextValue);
                innerRef.current.value = nextValue;
                onChange(nextValue);
            }
        }
        else if (file.status === 'error') {
            (_b = config.onError) === null || _b === void 0 ? void 0 : _b.call(config, file.response);
            setLoading(false);
        }
    }, [item.value, resetValue, type, config.onError, onChange]);
    //onerror ({type: 'fileSize', size: 1})
    //config addition: filetypes: 文件类型['image/png', 'video/mp4'], fileexts['png', 'jpg', 'jpeg'...], filesize,
    var beforeUpload = (0, react_1.useCallback)(function (file, fileList) {
        //file maxcount
        var fileLength = ((innerValue === null || innerValue === void 0 ? void 0 : innerValue.length) || 0) + fileList.length;
        if (config.maxcount && fileLength > config.maxcount) {
            if (fileList[fileList.length - 1] === file) {
                antd_1.message.error("\u6587\u4EF6\u6700\u591A\u4E0D\u80FD\u8D85\u8FC7".concat(config.maxcount, "\u4E2A"));
            }
            return false;
        }
        if (typeof config.beforeUpload === 'function') {
            return config.beforeUpload(file);
        }
        var size = file.size, type = file.type, name = file.name;
        var extIndex = name.lastIndexOf('.');
        if (config.fileexts && extIndex + 1 < name.length) {
            var ext = name.substring(extIndex + 1);
            if (!isIncludes(ext, config.fileexts)) {
                antd_1.message.error("\u4EC5\u652F\u6301".concat(config.fileexts, "\u6587\u4EF6\u683C\u5F0F"));
                return false;
            }
        }
        //filetypes
        if (config.filetypes) {
            if (!config.filetypes.includes(type)) {
                antd_1.message.error("\u4EC5\u652F\u6301".concat(config.filetypes, "\u6587\u4EF6\u683C\u5F0F"));
                return false;
            }
        }
        //filesize, to extends
        if (config.filesize) {
            var sizeM = size / 1024 / 1024;
            if (sizeM > config.filesize) {
                antd_1.message.error("\u6587\u4EF6\u5927\u5C0F\u4E0D\u80FD\u8D85\u8FC7".concat(config.filesize, "M"));
                return false;
            }
        }
        return true;
    }, [config, innerValue]);
    var uploadChildren = (0, react_1.useMemo)(function () {
        if (config.maxcount && (innerValue === null || innerValue === void 0 ? void 0 : innerValue.length) >= config.maxcount) {
            return null;
        }
        else if (config.content) {
            return config.content;
        }
        else if (type === types.imgs || type === types.img) {
            if (imageUrl) {
                return react_1.default.createElement("div", { style: imgContainerStyle, onMouseLeave: function () { setHover(false); }, onMouseEnter: function () { setHover(true); } },
                    loading && react_1.default.createElement("div", { style: __assign(__assign({}, imgContainerStyle), imgInnerStyle) },
                        react_1.default.createElement(icons_1.LoadingOutlined, { style: { color: "white" } })),
                    !loading && hover && react_1.default.createElement("div", { style: __assign(__assign({}, imgContainerStyle), imgInnerStyle) },
                        react_1.default.createElement(icons_1.EyeOutlined, { style: { marginRight: 16 }, onClick: function (e) {
                                e.stopPropagation();
                                window.open(imageUrl, '_blank');
                            } }),
                        react_1.default.createElement(icons_1.DeleteOutlined, { onClick: function (e) {
                                e.stopPropagation();
                                onChange(null);
                            } })),
                    react_1.default.createElement("img", { src: imageUrl, alt: "", style: { width: "100%" } }));
            }
            return loading
                ? react_1.default.createElement(icons_1.LoadingOutlined, null)
                : react_1.default.createElement(icons_1.PlusOutlined, null);
        }
        else if (type === types.dragger) {
            return react_1.default.createElement("div", null,
                react_1.default.createElement(icons_1.UploadOutlined, null),
                react_1.default.createElement("div", { style: { color: 'rgba(0,0,0,.45)', marginTop: 10 } }, config.text || texts.dragger));
        }
        else {
            return react_1.default.createElement(antd_1.Button, { icon: react_1.default.createElement(icons_1.UploadOutlined, null), type: type === types.primary ? "primary" : undefined }, config.text || texts.upload);
        }
    }, [type, hover, imageUrl, config, loading, onChange, innerValue]);
    var everyProps = (0, react_1.useMemo)(function () {
        var fileList = innerValue;
        if (fileList) {
            fileList = Array.isArray(fileList) ? fileList : [fileList];
        }
        return __assign({ disabled: loading || disabled, className: className, style: style, fileList: fileList, onChange: handleChange, beforeUpload: beforeUpload }, ridKeysConfig);
    }, [disabled, className, style, loading, innerValue, handleChange, beforeUpload, ridKeysConfig]);
    var uploadProps = (0, react_1.useMemo)(function () {
        switch (type) {
            case types.imgs:
                return __assign(__assign({ accept: 'image/*' }, everyProps), { multiple: true, listType: "picture-card" });
            case types.img:
                return __assign(__assign({ accept: 'image/*' }, everyProps), { showUploadList: false, listType: "picture-card" });
            default:
                return everyProps;
        }
    }, [type, everyProps]);
    return (0, react_1.useMemo)(function () {
        var Element = type === types.dragger ? Dragger : antd_1.Upload;
        return react_1.default.createElement(Element, __assign({}, uploadProps), uploadChildren);
    }, [uploadProps, type, uploadChildren]);
}
exports.default = FUpload;
