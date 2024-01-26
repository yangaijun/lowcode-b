"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearDefaultConfigs = exports.getDefaultConfigs = exports.setDefaultConfigs = exports.grammar = void 0;
var public_1 = require("./public");
var configStack = [];
exports.grammar = {
    global: '-g' //全局config '-g@samll': {size: 'small',...} => 'button@small', 'input@small'... , 都是用此配置
};
function setDefaultConfigs(configs) {
    (0, public_1.setDefaults)(configStack, configs);
}
exports.setDefaultConfigs = setDefaultConfigs;
;
function getDefaultConfigs() {
    return (0, public_1.getDefaults)(configStack);
}
exports.getDefaultConfigs = getDefaultConfigs;
function clearDefaultConfigs(configs) {
    (0, public_1.clearDefaults)(configStack, configs);
}
exports.clearDefaultConfigs = clearDefaultConfigs;
