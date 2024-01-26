"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearDefaultClasses = exports.getDefaultClasses = exports.setDefaultClasses = exports.grammar = void 0;
var public_1 = require("./public");
var classStack = [];
exports.grammar = {
    global: '-g' //全局config '-g@red': className: red
};
/**
 * 设置全局class
 * @param classes {input*: 'inputclass', '-g@red': styles.redclass, 'select@w220': 'width220'}
 */
function setDefaultClasses(classes) {
    (0, public_1.setDefaults)(classStack, classes);
}
exports.setDefaultClasses = setDefaultClasses;
function getDefaultClasses() {
    return (0, public_1.getDefaults)(classStack);
}
exports.getDefaultClasses = getDefaultClasses;
function clearDefaultClasses(classes) {
    (0, public_1.clearDefaults)(classStack, classes);
}
exports.clearDefaultClasses = clearDefaultClasses;
