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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var region_1 = __importDefault(require("../region"));
var antd_1 = require("antd");
var util_1 = require("./util");
var useBase_1 = require("../hooks/useBase");
var props_1 = require("../config/props");
function FFormList(props) {
    var data = props.data, name = props.name, _a = props.columns, columns = _a === void 0 ? [] : _a, onEvent = props.onEvent, onChange = props.onChange;
    var _b = (0, useBase_1.useListComponent)(onChange, onEvent, data), innerData = _b.innerData, innerChange = _b.innerChange, innerEvent = _b.innerEvent;
    var formColumns = (0, react_1.useMemo)(function () {
        return innerData.map(function (data) { return (react_1.default.createElement(region_1.default, { data: data, key: data.key, onEvent: innerEvent, onChange: innerChange, columns: (0, util_1.setColumns)(data, columns) })); });
    }, [innerData, innerChange, innerEvent, columns]);
    return react_1.default.createElement(antd_1.Form.List, { name: name }, function () { return formColumns; });
}
FFormList[props_1.isRenderComponent] = true;
FFormList[props_1.hasNameProp] = true;
exports.default = FFormList;
