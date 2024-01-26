"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTAINER_NAMES = exports.getContainerDom = exports.tableColumnGroupType = void 0;
var div_1 = __importDefault(require("./div"));
var card_1 = __importDefault(require("./card"));
var space_1 = __importDefault(require("./space"));
var col_1 = __importDefault(require("./col"));
var row_1 = __importDefault(require("./row"));
var fragement_1 = __importDefault(require("./fragement"));
var formitem_1 = __importDefault(require("./formitem"));
var inputgroup_1 = __importDefault(require("./inputgroup"));
var popconfirm_1 = __importDefault(require("./popconfirm"));
var spin_1 = __importDefault(require("./spin"));
var tooltip_1 = __importDefault(require("./tooltip"));
var affix_1 = __importDefault(require("./affix"));
var containerMap = {
    div: div_1.default,
    card: card_1.default,
    space: space_1.default,
    col: col_1.default,
    row: row_1.default,
    fragment: fragement_1.default,
    formitem: formitem_1.default,
    inputgroup: inputgroup_1.default,
    popconfirm: popconfirm_1.default,
    spin: spin_1.default,
    tooltip: tooltip_1.default,
    affix: affix_1.default
};
exports.tableColumnGroupType = 'tablecolgroup';
function getContainerDom(type) {
    return containerMap[type];
}
exports.getContainerDom = getContainerDom;
exports.CONTAINER_NAMES = Object.keys(containerMap);
