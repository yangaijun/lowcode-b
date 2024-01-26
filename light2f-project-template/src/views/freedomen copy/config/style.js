"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearDefaultStyles = exports.setDefaultStyles = exports.getDefaultStyles = exports.grammar = void 0;
var public_1 = require("./public");
var styleStack = [];
exports.grammar = {
    global: '-g',
    width: 'w' //style 中的 width
};
function getDefaultStyles() {
    return (0, public_1.getDefaults)(styleStack);
}
exports.getDefaultStyles = getDefaultStyles;
function setDefaultStyles(styles) {
    (0, public_1.setDefaults)(styleStack, styles);
}
exports.setDefaultStyles = setDefaultStyles;
function clearDefaultStyles(styles) {
    (0, public_1.clearDefaults)(styleStack, styles);
}
exports.clearDefaultStyles = clearDefaultStyles;
