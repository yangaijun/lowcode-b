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
exports.setColumns = void 0;
var rule_1 = require("./rule");
var util_1 = __importStar(require("../utils/util"));
var region_1 = require("../region");
var props_1 = require("../config/props");
var containers_1 = require("../containers");
var util_2 = __importDefault(require("../utils/util"));
var isNoStyle = function (type) {
    if (type === void 0) { type = ''; }
    for (var _i = 0, CONTAINER_NAMES_1 = containers_1.CONTAINER_NAMES; _i < CONTAINER_NAMES_1.length; _i++) {
        var item = CONTAINER_NAMES_1[_i];
        if (item === 'fragment')
            continue;
        if (type.indexOf(item) === 0) {
            return true;
        }
    }
    return false;
};
//index 可以未空
var resetRule = function (data, column, index) {
    var tempData = data;
    if (index) {
        tempData = data[index];
    }
    if (typeof column.rule === 'string' || util_1.default.isPlainObject(column.rule)) {
        var message = (0, rule_1.validate)((0, util_1.getChainValueByString)(tempData, column.prop), column.rule, tempData);
        if (message === null || message === undefined || message === '')
            return Promise.resolve();
        else
            return Promise.reject(message);
    }
    else if (typeof column.rule === 'function') {
        return (0, rule_1.validate)((0, util_1.getChainValueByString)(tempData, column.prop), column.rule, tempData);
    }
    return Promise.resolve();
};
var setColumns = function (data, columns, index, noStyle) {
    if (noStyle === void 0) { noStyle = false; }
    var setRule = function (column) {
        if (column.rule) {
            if (typeof column.rule === 'string' && column.rule.includes(props_1.emptyValue)) {
                column[props_1.emptyKey] = true;
            }
            column.rules = [{
                    validator: function () {
                        return resetRule(data, column, index);
                    }
                }];
        }
    };
    var newColumns = [];
    columns.forEach(function (c) {
        var column = util_2.default.clone(c);
        if (util_1.default.isPlainObject(column)) {
            setRule(column);
            var formItemConfig = (0, util_1.splitConfig)(column.config, props_1.formItemProps);
            var newItem = [column];
            if (column.type || column.label !== undefined || column.rule || formItemConfig.wrapperCol || formItemConfig.labelCol) {
                newItem.push(__assign(__assign({}, column), { noStyle: noStyle, config: formItemConfig, type: 'formitem', style: undefined, className: undefined }));
            }
            //特殊处理添加 col, 下面还有个
            if (column.span) {
                delete newItem[newItem.length - 1].noStyle;
                newColumns.push([newItem, { type: 'col', value: column.span }]);
            }
            else {
                newColumns.push(newItem);
            }
        }
        else if (Array.isArray(column) && column.length) {
            var resetColumns = void 0;
            if ((0, region_1.isContainer)(column[column.length - 1])) {
                var lastColumn = column[column.length - 1];
                resetRule(data, lastColumn);
                var children = column.slice(0, column.length - 1);
                resetColumns = (0, exports.setColumns)(data, children, index, isNoStyle(lastColumn.type));
                resetColumns.push(lastColumn);
                //特殊处理添加 col，上面还有个
                if (lastColumn.span) {
                    newColumns.push([[resetColumns], { type: 'col', value: lastColumn.span }]);
                }
                else {
                    newColumns.push(resetColumns);
                }
            }
            else {
                resetColumns = (0, exports.setColumns)(data, column, index, true);
                resetColumns.push({ type: 'formitem' });
                newColumns.push(resetColumns);
            }
        }
    });
    return newColumns;
};
exports.setColumns = setColumns;
