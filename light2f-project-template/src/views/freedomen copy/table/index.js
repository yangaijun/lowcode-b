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
var permission_1 = require("../config/permission");
var useBase_1 = require("../hooks/useBase");
var util_1 = require("../utils/util");
var config_1 = require("../config/config");
var props_1 = require("../config/props");
var containers_1 = require("../containers");
var Column = antd_1.Table.Column, ColumnGroup = antd_1.Table.ColumnGroup;
var keyName = 'Table';
function FTable(props) {
    var style = props.style, className = props.className, columns = props.columns, data = props.data, pagination = props.pagination, onEvent = props.onEvent, onChange = props.onChange, config = props.config;
    var innerRef = (0, react_1.useRef)({ onEvent: onEvent, onChange: onChange });
    var _a = (0, react_1.useState)([]), selecteds = _a[0], setSelecteds = _a[1];
    var _b = (0, react_1.useState)(props_1.defaultPage), page = _b[0], setPage = _b[1];
    var _c = (0, useBase_1.useListComponent)(innerRef.current.onChange, innerRef.current.onEvent, data), innerData = _c.innerData, innerChange = _c.innerChange, innerEvent = _c.innerEvent;
    (0, react_1.useEffect)(function () {
        innerRef.current.onChange = onChange;
    }, [onChange]);
    (0, react_1.useEffect)(function () {
        innerRef.current.onEvent = onEvent;
    }, [onEvent]);
    var pageEvent = (0, react_1.useCallback)(function (pageNo, pageSize) {
        var _a, _b;
        var row = { pageNo: pageNo, pageSize: pageSize };
        setPage(__assign({}, row));
        (_b = (_a = innerRef.current).onEvent) === null || _b === void 0 ? void 0 : _b.call(_a, { prop: props_1.tablePageChangeProp, type: props_1.changeType, value: row, row: row });
    }, []);
    var tableChange = (0, react_1.useCallback)(function (p, f, sorter, extra) {
        var _a, _b;
        if (extra.action === 'sort') {
            (_b = (_a = innerRef.current).onEvent) === null || _b === void 0 ? void 0 : _b.call(_a, { prop: sorter.field, type: props_1.tableSorterType, value: sorter.order, row: sorter });
        }
    }, [innerChange]);
    var getColumnDom = (0, react_1.useCallback)(function (columns, data, key) {
        return (react_1.default.createElement(region_1.default, { key: key, data: data, columns: columns, onEvent: innerEvent, onChange: innerChange }));
    }, [innerEvent, innerChange]);
    var selectChange = (0, react_1.useCallback)(function (selectedRowKeys, selectedRows) {
        var _a, _b;
        setSelecteds(selectedRowKeys);
        (_b = (_a = innerRef.current).onEvent) === null || _b === void 0 ? void 0 : _b.call(_a, {
            type: props_1.clickType,
            prop: props_1.tableSelectionProp,
            value: selectedRows,
            row: { selectedRows: selectedRows }
        });
    }, []);
    var innerConfig = (0, react_1.useMemo)(function () {
        var defaultConfig = {};
        var DefaultConfigs = (0, config_1.getDefaultConfigs)()[0];
        var paginationConfig = {};
        if (config === null || config === void 0 ? void 0 : config.selection) {
            defaultConfig.rowSelection = __assign(__assign({ getCheckboxProps: function (record) {
                    var cdisabled = config === null || config === void 0 ? void 0 : config.disabled;
                    if (cdisabled) {
                        var disabled = typeof cdisabled === 'boolean' ? cdisabled : cdisabled(record);
                        return { disabled: disabled };
                    }
                }, type: config.selectionType }, defaultConfig.rowSelection), { selectedRowKeys: selecteds, onChange: selectChange });
        }
        if (pagination) {
            paginationConfig.pagination = __assign(__assign(__assign({ size: 'small', showQuickJumper: true, showSizeChanger: true, showTotal: function (total) { return "\u5171 ".concat(total, " \u6761"); }, current: page.pageNo }, config === null || config === void 0 ? void 0 : config.pagination), pagination), { onChange: pageEvent });
            if (pagination.pageNo) {
                paginationConfig.pagination.current = pagination.pageNo;
            }
        }
        else if (pagination === false) {
            paginationConfig.pagination = false;
        }
        return (0, util_1.objectMerge)(defaultConfig, null, DefaultConfigs.Table, config, paginationConfig);
    }, [config, selecteds, pagination, pageEvent, page.pageNo, selectChange]);
    var getColumns = (0, react_1.useCallback)(function (column, index, level) {
        var loadColumn = function (c) {
            var params = { column: c, value: c.value, data: c.data };
            if (c.load) {
                return c.load(params) && (0, permission_1.hasPermission)(params);
            }
            return (0, permission_1.hasPermission)(params);
        };
        var key = (0, util_1.getOrderKey)(level, index);
        if (Array.isArray(column)) {
            var lastItem = (0, util_1.getArrayLastItem)(column);
            if ((lastItem === null || lastItem === void 0 ? void 0 : lastItem.type) === containers_1.tableColumnGroupType) {
                if (!loadColumn(loadColumn))
                    return;
                var columns_1 = column.splice(0, column.length - 1);
                return (react_1.default.createElement(ColumnGroup, { key: key, title: lastItem.label }, columns_1.map(function (c, index) {
                    return getColumns(c, index, key);
                })));
            }
            else {
                console.error("分组表头数组最后一个元素类型必须是：" + containers_1.tableColumnGroupType);
                return;
            }
        }
        if (!loadColumn(column))
            return;
        var tempColumn = __assign(__assign({}, column), { config: __assign({ align: innerConfig === null || innerConfig === void 0 ? void 0 : innerConfig.align }, column.config) });
        var tableColumnConfig = (0, util_1.splitConfig)(tempColumn.config, props_1.tableColumnProps);
        return (react_1.default.createElement(Column, __assign({ key: key, title: tempColumn.label, dataIndex: tempColumn.prop, width: tempColumn.width }, tableColumnConfig, { render: function (value, data, index) {
                if (tempColumn.render) {
                    var render = void 0;
                    if (Array.isArray(tempColumn.render)) {
                        render = tempColumn.render;
                    }
                    else if (typeof tempColumn.render === 'function') {
                        render = tempColumn.render({ value: value, data: data });
                    }
                    if (Array.isArray(render)) {
                        return getColumnDom(render, data, index);
                    }
                    else {
                        return render;
                    }
                }
                else {
                    if (!tempColumn.type)
                        tempColumn.type = 'text';
                    if (tableColumnConfig.ellipsis) {
                        tempColumn.config = __assign(__assign({}, tempColumn.config), { title: data[tempColumn.prop] });
                    }
                    return getColumnDom([tempColumn], data, index);
                }
            } })));
    }, [getColumnDom, innerConfig === null || innerConfig === void 0 ? void 0 : innerConfig.align]);
    var tableColumns = (0, react_1.useMemo)(function () { return (columns === null || columns === void 0 ? void 0 : columns.map(function (column, index) {
        return getColumns(column, index);
    })); }, [columns, getColumns]);
    var _style = (0, react_1.useMemo)(function () { return (0, util_1.getStyle)(keyName, style); }, [style]);
    var _className = (0, react_1.useMemo)(function () { return (0, util_1.getClass)(keyName, className); }, [className]);
    return (react_1.default.createElement(antd_1.Table, __assign({ style: _style, className: _className, dataSource: innerData, onChange: tableChange }, innerConfig), tableColumns));
}
FTable[props_1.isRenderComponent] = true;
exports.default = FTable;
