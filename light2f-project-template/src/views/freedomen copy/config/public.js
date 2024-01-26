"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearDefaults = exports.setDefaults = exports.getDefaults = void 0;
function sets(Defaults, DefaultWildcards, obj) {
    for (var key in obj) {
        if (key.includes(',')) {
            var keys = key.split(','), robj = {};
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var k = keys_1[_i];
                robj[k] = obj[key];
            }
            sets(Defaults, DefaultWildcards, robj);
        }
        else if (key.includes('*')) {
            var newKey = key.split('*')[0];
            DefaultWildcards[newKey] = obj[key];
        }
        else {
            Defaults[key] = obj[key];
        }
    }
}
function getDefaults(stack) {
    var obj = {}, Defaults = {}, DefaultWildcards = {};
    for (var _i = 0, stack_1 = stack; _i < stack_1.length; _i++) {
        var item = stack_1[_i];
        if (typeof item === 'function') {
            Object.assign(obj, item());
        }
        else {
            Object.assign(obj, item);
        }
    }
    sets(Defaults, DefaultWildcards, obj);
    return [Defaults, DefaultWildcards];
}
exports.getDefaults = getDefaults;
function setDefaults(stack, obj) {
    obj && stack.push(obj);
}
exports.setDefaults = setDefaults;
function clearDefaults(stack, obj) {
    if (obj) {
        var index = stack.findIndex(function (item) { return item === obj; });
        if (index !== -1) {
            stack.splice(index, 1);
        }
    }
}
exports.clearDefaults = clearDefaults;
