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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
var util_1 = __importDefault(require("../utils/util"));
var rule_1 = require("../config/rule");
var props_1 = require("../config/props");
//rule type: function() {return Promise.resolve()/Promise.reject}; string "must,phone";  object {must: 'you may put something'}
function validate(value, rule, data) {
    var _a;
    if (value === void 0) { value = ''; }
    if (!rule)
        return null;
    var tips = {};
    if (typeof rule === 'function') {
        return new Promise(function (resolve, reject) {
            rule({ value: value, data: data, rules: rule_1.rules })
                .then(function () {
                resolve(void 0);
            })
                .catch(function (msg) {
                reject(msg);
            });
        });
    }
    else if (util_1.default.isPlainObject(rule)) {
        tips = __assign({}, rule);
        rule = Object.keys(rule);
    }
    else {
        rule = Array.isArray(rule) ? rule : rule.split(',');
    }
    var message = null;
    for (var _i = 0, rule_2 = rule; _i < rule_2.length; _i++) {
        var r = rule_2[_i];
        if (typeof r === 'string' && r.indexOf('len') === 0) {
            var nums = r.substring(3).split(':');
            var min = void 0, max = void 0;
            if (nums.length === 1) {
                max = nums[0];
            }
            else {
                min = nums[0];
                max = nums[1];
            }
            var minTip = void 0, maxTip = void 0;
            if (tips[r]) {
                if (tips[r].includes(":")) {
                    _a = tips[r].split(":"), minTip = _a[0], maxTip = _a[1];
                }
                else {
                    minTip = maxTip = tips[r];
                }
            }
            if (Array.isArray(value)) {
                if (min && value.length < Number(min)) {
                    message = minTip || "\u4E0D\u80FD\u5C0F\u4E8E".concat(min, "\u9879");
                }
                if (max && value.length > Number(max)) {
                    message = maxTip || "\u4E0D\u80FD\u8D85\u8FC7".concat(max, "\u9879");
                }
            }
            else {
                if (min && (value + '').trim().length < Number(min)) {
                    message = minTip || "\u957F\u5EA6\u4E0D\u80FD\u5C0F\u4E8E".concat(min);
                }
                if (max && (value + '').trim().length > Number(max)) {
                    message = maxTip || "\u957F\u5EA6\u4E0D\u80FD\u8D85\u8FC7".concat(max);
                }
            }
        }
        else if (typeof r === 'string' && r === props_1.emptyValue) {
            if (value === '' || value === void 0 || value === null) {
                return message;
            }
        }
        else if (rule_1.rules[r] !== void 0) {
            if (typeof rule_1.rules[r].regular === 'function') {
                message = rule_1.rules[r].regular({ value: value, data: data }) ? null : tips[r] || rule_1.rules[r].message;
            }
            else if (rule_1.rules[r].regular instanceof RegExp) {
                message = rule_1.rules[r].regular.test(value) ? null : tips[r] || rule_1.rules[r].message;
            }
            if (message !== null)
                break;
        }
        else {
            console.error("no such rule: '".concat(r, "'"));
        }
    }
    return message;
}
exports.validate = validate;
