"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var useBase_1 = require("../hooks/useBase");
var props_1 = require("../config/props");
var region_1 = __importDefault(require("../region"));
function FList(props) {
    var columns = props.columns, onEvent = props.onEvent, data = props.data, style = props.style, className = props.className, onChange = props.onChange;
    var _a = (0, useBase_1.useListComponent)(onChange, onEvent, data), innerData = _a.innerData, innerChange = _a.innerChange, innerEvent = _a.innerEvent;
    return (react_1.default.createElement("div", { style: style, className: className }, innerData === null || innerData === void 0 ? void 0 : innerData.map(function (data) {
        return (react_1.default.createElement(region_1.default, { key: data.key, data: data, onChange: innerChange, columns: columns, onEvent: innerEvent }));
    })));
}
FList[props_1.isRenderComponent] = true;
exports.default = FList;
