import util from '../utils/util'

const notEmpty = {
    message: '此为必填项',
    regular: ({ value }: any) => {
        if (value instanceof Array) return value.length !== 0;
        else if (util.isPlainObject(value)) return Object.keys(value).length !== 0;
        else if (typeof value === 'string') return value.trim().length !== 0;

        return value !== '' && value !== undefined && value !== null;
    }
}

export const rules: any = {
    must: notEmpty,
    required: notEmpty,
    phone: { message: '请正确输入手机号码', regular: /^((16[0-9])|(17[0-9])|(14[0-9])|(13[0-9])|(15[^4,\D])|(18[0-9])|(19[0-9]))\d{8}$/ },
    email: {
        message: '请正确输入email',
        regular: /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
    },
    url: {
        message: '请正确输入链接',
        regular: /^https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+)/
    },
    number: { message: '请输入数值', regular: new RegExp('^([+-]?)\\d*\\.?\\d+$') },
    int: { message: '请输入整数', regular: new RegExp('^([+]?)\\d*\\.?\\d+$') },
    intp: { message: '请输入正整数', regular: new RegExp('^([+]?)\\d*$') },
    intn: { message: '请输入负整数', regular: new RegExp('^-[1-9]\\d*|0$') },
    zipcode: { message: '请正确输入6位邮编', regular: /^\\d{6}$/ },
    ip4: {
        message: '请正确输入IP',
        regular: /^(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)$/
    },
    age: { message: '请正确输入年龄', regular: /^(?:[1-9][0-9]?|1[01][0-9]|120)$/ },
    idcard: { message: '请正确输入身份证号码', regular: /^\d{8,18}|[0-9x]{8,18}|[0-9X]{8,18}?$/ },
    username: { message: '仅允许字母开头，字母数字下划线组合5-16长度', regular: /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/ },
    name: { message: '不可以有空格或特殊字符', regular: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/ },
    notstartwithnumber: { message: '不可以以数字开头', regular: /^[^0-9].*$/ }
}

export function registerRules(configs: any) {
    if (!configs) return

    for (let key in configs) {
        if (rules[key]) {
            console.warn(`已经存在的校验名称: ${key}，将会被自定义覆盖`)
        }
        rules[key] = configs[key]
    }
};

export function removeRules(configs: string[] | {}) {
    if (!configs) return

    const ruleKeys = Array.isArray(configs)
        ? configs
        : Object.keys(configs)

    for (let key of ruleKeys) {
        delete rules[key]
    }
} 