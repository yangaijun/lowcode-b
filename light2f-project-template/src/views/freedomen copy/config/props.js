"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasNameProp = exports.isRenderComponent = exports.defaultDebounceWait = exports.defaultPage = exports.clickType = exports.changeType = exports.customTypeProp = exports.tableSelectionProp = exports.tableSorterType = exports.tablePageChangeProp = exports.proxyEvents = exports.submitEventType = exports.pushProp = exports.deleteTipProp = exports.deleteProp = exports.submitProp = exports.resetProp = exports.emptyKey = exports.emptyValue = exports.defaultFilterVoidText = exports.filterDefaultKey = exports.names = exports.tableColumnProps = exports.formItemProps = void 0;
exports.formItemProps = [
    'colon',
    'help',
    'htmlFor',
    'extra',
    'label',
    'required',
    'labelCol',
    'labelAlign',
    'noStyle',
    'tooltip',
    'wrapperCol',
    'validateFirst',
    'messageVariables'
];
exports.tableColumnProps = [
    'align',
    'colSpan',
    'defaultFilteredValue',
    'defaultSortOrder',
    'editable',
    'filterDropdown',
    'filterDropdownVisible',
    'filtered',
    'filteredValue',
    'filterIcon',
    'filterMultiple',
    'filterMode',
    'filterSearch',
    'filters',
    'fixed',
    'responsive',
    'sorter',
    'sortOrder',
    'onCell',
    'ellipsis',
    'onFilter',
    'onFilterDropdownVisibleChange',
    'onHeaderCell'
];
exports.names = {
    optionvalue: 'optionvalue',
    labelname: 'label',
    valuename: 'value',
    childrenname: 'children'
};
//filter 为 {}, 的 default
exports.filterDefaultKey = '$default';
//值为 void 时候
exports.defaultFilterVoidText = '--';
//form，验证时候字段可以为空
exports.emptyValue = 'empty';
//form emptyKey 不显示 验证的小红 *
exports.emptyKey = '$withEmpty';
//region reset prop
exports.resetProp = '$reset';
//form submit prop
exports.submitProp = '$submit';
//list delete prop
exports.deleteProp = '$delete';
//list delete confirm
exports.deleteTipProp = '$delete-confirm';
//list add prop
exports.pushProp = '$push';
//一些输入组件可以直接触发表单提交的类型可以，如input 的 pressEnter 等, submitEventType = "pressEnter" / ["pressEnter"]
exports.submitEventType = 'submitEventType';
//注册组件， 注册后可以被event 代理，可以直接取到区域值
exports.proxyEvents = 'proxyEvents';
//表格分页改变
exports.tablePageChangeProp = '$page';
//表格点击排序
exports.tableSorterType = 'sorter';
//表格选择
exports.tableSelectionProp = '$selection';
//custome Type
exports.customTypeProp = '$customType';
//change事件名
exports.changeType = 'change';
//click 事件名
exports.clickType = 'click';
//table
exports.defaultPage = {
    pageNo: 1,
    pageSize: 10
};
//options触发防抖等待时间
exports.defaultDebounceWait = 280;
//是否被Render处理，复制自动注入数据、事件
exports.isRenderComponent = '__isRenderComponent';
//formList 使用
exports.hasNameProp = '__hasNameProp';
