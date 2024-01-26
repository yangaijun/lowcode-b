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
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterNode = exports.getStyle = exports.getClass = exports.getConfig = exports.getOptionStyle = exports.getOriginalType = exports.getTypeOrName = exports.getFullType = void 0;
var props_1 = require("../config/props");
var config_1 = require("../config/config");
var class_1 = require("../config/class");
var style_1 = require("../config/style");
var render_1 = require("../render");
function toRenderType(render) {
    return render ? render_1.renderType : '';
}
//type 全貌
function getFullType(item) {
    if (!item.type) {
        return toRenderType(item.render);
    }
    var columnType = item.type;
    if (typeof columnType === 'function') {
        var data = item.$data || {};
        columnType = columnType({ value: item.value, data: data });
        if (!columnType) {
            throw new Error('function type, return string');
        }
    }
    return columnType || '';
}
exports.getFullType = getFullType;
//button-primary@any => return "button-primary" Or "any"
function getTypeOrName(item, key) {
    if (key === void 0) { key = 0; }
    return getFullType(item).split('@')[key];
}
exports.getTypeOrName = getTypeOrName;
//button-primary@any => return "button-primary" 
function getOriginalType(item) {
    return getTypeOrName(item);
}
exports.getOriginalType = getOriginalType;
function getOptionStyle(option, item) {
    var itemStyle = item.itemStyle, data = item.$data, value = item.value;
    var newItemStyle;
    if (typeof itemStyle === 'function') {
        newItemStyle = itemStyle({ data: data, option: option, value: value });
    }
    else if (itemStyle) {
        newItemStyle = itemStyle;
    }
    return newItemStyle;
}
exports.getOptionStyle = getOptionStyle;
function getGlobalConfig(config, grammar) {
    var globalConfig = {};
    for (var key in config) {
        if (key.indexOf(grammar.global) === 0) {
            globalConfig[key] = config[key];
        }
    }
    return globalConfig;
}
function getWildcardConfig(config, key) {
    var wildcardKey = Object.keys(config).find(function (k) {
        return key.indexOf(k) === 0;
    });
    if (wildcardKey) {
        return config[wildcardKey];
    }
}
var defaultConfigRidkeys = [props_1.submitEventType, props_1.proxyEvents];
function getConfig(item, onEvent) {
    var type = item[props_1.customTypeProp] || getFullType(item), newConfig = {};
    var _a = (0, config_1.getDefaultConfigs)(), DefaultConfigs = _a[0], DefaultWildcardConfigs = _a[1];
    var GlobalConfig = getGlobalConfig(DefaultConfigs, config_1.grammar);
    if (Object.keys(GlobalConfig).length) {
        var configName = getTypeOrName(item, 1);
        for (var key in GlobalConfig) {
            if (key.includes(configName)) {
                newConfig = DefaultConfigs[key];
                break;
            }
        }
    }
    //wildcardConfig upload* button*, ...
    var wildcardConfigs = getWildcardConfig(DefaultWildcardConfigs, type);
    if (wildcardConfigs) {
        newConfig = __assign(__assign({}, newConfig), wildcardConfigs);
    }
    //defaultConfig date-month, date-year, ...
    if (DefaultConfigs[type]) {
        newConfig = __assign(__assign({}, newConfig), DefaultConfigs[type]);
    }
    newConfig = __assign(__assign({}, newConfig), item.config);
    //you can register event in config; exp: onDoubleCilck, onClick...  'onClick'/['onClick']/['onDoubleClick','onClick']
    if (newConfig[props_1.proxyEvents]) {
        var registerEvent_1 = function (key) {
            newConfig[key] = function () {
                onEvent(key, item.value);
            };
        };
        if (Array.isArray(newConfig[props_1.proxyEvents])) {
            newConfig[props_1.proxyEvents].forEach(function (key) {
                registerEvent_1(key);
            });
        }
        else if (typeof newConfig[props_1.proxyEvents] === 'string') {
            registerEvent_1(newConfig[props_1.proxyEvents]);
        }
    }
    defaultConfigRidkeys.forEach(function (key) {
        delete newConfig[key];
    });
    return newConfig;
}
exports.getConfig = getConfig;
;
function getClass(item) {
    var _type = getFullType(item);
    var _a = (0, class_1.getDefaultClasses)(), DefaultClasses = _a[0], DefaultWildcardClasses = _a[1];
    var GlobalClass = getGlobalConfig(DefaultClasses, class_1.grammar);
    if (Object.keys(GlobalClass).length) {
        var configName = getTypeOrName(item, 1);
        for (var key in GlobalClass) {
            if (key.includes(configName)) {
                return DefaultClasses[key];
            }
        }
    }
    if (DefaultClasses[_type]) {
        return DefaultClasses[_type];
    }
    var wildcardClasses = getWildcardConfig(DefaultWildcardClasses, _type);
    if (wildcardClasses)
        return wildcardClasses;
}
exports.getClass = getClass;
;
var widthStr = '@' + style_1.grammar.width;
function getStyle(item) {
    var newStyle = {}, _type = getFullType(item);
    var _a = (0, style_1.getDefaultStyles)(), DefaultStyles = _a[0], DefaultWildcardStyles = _a[1];
    var GlobalStyle = getGlobalConfig(DefaultStyles, style_1.grammar);
    if (Object.keys(GlobalStyle).length) {
        var configName = getTypeOrName(item, 1);
        for (var key in GlobalStyle) {
            if (key.includes(configName)) {
                newStyle = DefaultStyles[key];
                break;
            }
        }
    }
    //wildcardStyle  div* , text-div*
    var wildcardStyles = getWildcardConfig(DefaultWildcardStyles, _type);
    if (wildcardStyles) {
        newStyle = __assign(__assign({}, newStyle), wildcardStyles);
    }
    //defaultStyle  div, text-div
    if (DefaultStyles[_type]) {
        newStyle = __assign(__assign({}, newStyle), DefaultStyles[_type]);
    }
    //style  width,  *@w120 => {width: 120}
    var _index = _type.indexOf(widthStr);
    if (_index !== -1) {
        var width = _type.substring(_index + widthStr.length);
        newStyle.width = parseInt(width);
    }
    return newStyle;
}
exports.getStyle = getStyle;
function canSearch(value) {
    return typeof value === 'string' || typeof value === 'number';
}
function filterNode(input, option, labelname, valuename) {
    if (input === void 0) { input = ''; }
    if (labelname === void 0) { labelname = "label"; }
    if (valuename === void 0) { valuename = "value"; }
    if (canSearch(option[labelname])) {
        return String(option[labelname]).toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }
    if (canSearch(option[valuename])) {
        return String(option[labelname]).toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }
    return false;
}
exports.filterNode = filterNode;
