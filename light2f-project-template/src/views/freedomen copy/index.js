"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionContext = exports.Drawer = exports.Dialog = exports.Search = exports.Region = exports.Table = exports.FormList = exports.Form = exports.List = void 0;
var list_1 = __importDefault(require("./list"));
exports.List = list_1.default;
var form_1 = __importDefault(require("./form"));
exports.Form = form_1.default;
var formlist_1 = __importDefault(require("./form/formlist"));
exports.FormList = formlist_1.default;
var region_1 = __importDefault(require("./region"));
exports.Region = region_1.default;
var search_1 = __importDefault(require("./search"));
exports.Search = search_1.default;
var table_1 = __importDefault(require("./table"));
exports.Table = table_1.default;
var dialog_1 = __importDefault(require("./dialog"));
exports.Dialog = dialog_1.default;
var drawer_1 = __importDefault(require("./drawer"));
exports.Drawer = drawer_1.default;
var context_1 = require("./context");
Object.defineProperty(exports, "PermissionContext", { enumerable: true, get: function () { return context_1.PermissionContext; } });
var render_1 = require("./render");
var rule_1 = require("./config/rule");
var permission_1 = require("./config/permission");
var style_1 = require("./config/style");
var config_1 = require("./config/config");
var class_1 = require("./config/class");
var sets = {
    setDisabled: permission_1.setDisabled,
    setPermission: permission_1.setPermission,
    setDefaultStyles: style_1.setDefaultStyles,
    setDefaultConfigs: config_1.setDefaultConfigs,
    setDefaultClasses: class_1.setDefaultClasses,
    clearDisabled: permission_1.clearDisabled,
    clearPermission: permission_1.clearPermission,
    clearDefaultStyles: style_1.clearDefaultStyles,
    clearDefaultConfigs: config_1.clearDefaultConfigs,
    clearDefaultClasses: class_1.clearDefaultClasses,
    registerRules: rule_1.registerRules,
    removeRules: rule_1.removeRules,
    registerRender: render_1.registerRender,
    removeRender: render_1.removeRender
};
exports.default = sets;
