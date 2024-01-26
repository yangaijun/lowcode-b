import util from '../utils/util';
import { rules } from '../config/rule'
import { emptyValue } from '../config/props';
//rule type: function() {return Promise.resolve()/Promise.reject}; string "must,phone";  object {must: 'you may put something'}

export function validate(value = '', rule: any, data: any) {
  if (!rule) return null;
  let tips: any = {};
  if (typeof rule === 'function') {
    return new Promise((resolve, reject) => {
      rule({ value, data, rules })
        .then(() => {
          resolve(void 0);
        })
        .catch((msg: string) => {
          reject(msg);
        });
    });
  } else if (util.isPlainObject(rule)) {
    tips = { ...rule };
    rule = Object.keys(rule);
  } else {
    rule = Array.isArray(rule) ? rule : rule.split(',');
  }

  let message = null;
  for (let r of rule) {
    if (typeof r === 'string' && r.indexOf('len') === 0) {
      let nums = r.substring(3).split(':');
      let min, max;
      if (nums.length === 1) {
        max = nums[0];
      } else {
        min = nums[0];
        max = nums[1];
      }

      let minTip, maxTip
      if (tips[r]) {
        if (tips[r].includes(":")) {
          [minTip, maxTip] = tips[r].split(":")
        } else {
          minTip = maxTip = tips[r]
        }
      }

      if (Array.isArray(value)) {
        if (min && value.length < Number(min)) {
          message = minTip || `不能小于${min}项`
        }
        if (max && value.length > Number(max)) {
          message = maxTip || `不能超过${max}项`;
        }
      } else {
        if (min && (value + '').trim().length < Number(min)) {
          message = minTip || `长度不能小于${min}`;
        }
        if (max && (value + '').trim().length > Number(max)) {
          message = maxTip || `长度不能超过${max}`;
        }
      } 
    } else if (typeof r === 'string' && r === emptyValue) {
      if (value === '' || value === void 0 || value === null) {
        return message;
      }
    } else if (rules[r] !== void 0) {
      if (typeof rules[r].regular === 'function') {
        message = rules[r].regular({ value: value, data: data }) ? null : tips[r] || rules[r].message;
      } else if (rules[r].regular instanceof RegExp) {
        message = rules[r].regular.test(value) ? null : tips[r] || rules[r].message;
      }
      if (message !== null) break;
    } else {
      console.error(`no such rule: '${r}'`);
    }
  }
  return message;
}
