import { message } from 'antd'
import { Dialog, Form } from 'freedomen'
import user from 'libs/user'
import _ from 'lodash'
import { getConfigItem } from '../components/panel/component/config'
import { canPutMap, sortFormSequence, INSTRUCTS, paramsKeyPrefix, valueTypes, TokenDialogName, stopListenerClass } from '../config'
import { IString } from './string'
import { DefaulutEditor } from 'components/Editors'

export function isSort(oldList = [], newList = []) {
    return JSON.stringify(oldList.map(el => el.uuid)) !== JSON.stringify(newList.map(el => el.uuid))
}

export function canPutIn(fromType, parentTypes, toType) {
    if (fromType === 'formitem' && parentTypes?.includes('Form')) return true

    const des = canPutMap[toType]
    if (!des) return true

    if (Array.isArray(des)) {
        return des.includes(fromType)
    } else {
        return !des.not.includes(fromType)
    }
}

export function clone(item, parent) {
    let cloneItem = _.cloneDeep(item)
    cloneItem.uuid = _.uniqueId()

    if (parent) {
        if (parent.parentTypes) {
            cloneItem.parentTypes = [...parent.parentTypes, parent.type]
        } else {
            cloneItem.parentTypes = [parent.type]
        }
        //只建议放在form中
        const pMayForm = ['formitem', 'FormList']
        if (pMayForm.includes(item.type) && !cloneItem.parentTypes.some(pt => ['Form', 'Search', 'FDialog', 'FDrawer'].includes(pt))) {
            message.info("提示：" + item.type + '建议只放入Form/Search中！')
        }
        const pMayTable = ['tablecolgroup']
        if (pMayTable.includes(item.type) && ![...pMayTable, 'Table'].includes(cloneItem.parentTypes[cloneItem.parentTypes.length - 1])) {
            message.info("提示：" + item.type + '建议只放入Table或tablecolgroup中！')
        }

        let baseInheritable = _.cloneDeep(parent.props.baseInheritable)
        let moreInheritable = _.cloneDeep(parent.props.moreInheritable)

        if (baseInheritable) {
            cloneItem.props.base.push(...baseInheritable)
        }
        if (moreInheritable) {
            cloneItem.props.more.push(...moreInheritable)
        }

        let inheritableRules = cloneItem.props.inheritableRules
        if (inheritableRules) {
            //继承任意组件后改变
            const ridOfKeys = (keys = []) => {
                cloneItem.props.base = cloneItem.props.base.filter(item => !keys.includes(item.prop))
                cloneItem.props.more = cloneItem.props.more.filter(item => !keys.includes(item.prop))
            }
            //回調 notProps：不繼承的屬性 如['prop', 'label'], exAbledProps: 可往下繼承的屬性, 如 ['prop']
            const handleConfig = ({ notProps, exAbledProps }) => {
                if (notProps.length) {
                    ridOfKeys(notProps)
                }
                if (exAbledProps.length) {
                    let exBaseInheritable = baseInheritable.filter(item => exAbledProps.includes(item.prop))
                    let exMoreInheritable = moreInheritable.filter(item => exAbledProps.includes(item.prop))
                    if (exBaseInheritable.length) {
                        cloneItem.props.baseInheritable.push(...exBaseInheritable)
                    }
                    if (exMoreInheritable.length) {
                        cloneItem.props.moreInheritable.push(...exMoreInheritable)
                    }
                }
            }
            handleConfig(inheritableRules(cloneItem, parent))
        }
    }
    sortFormSequence(cloneItem.props.base)
    sortFormSequence(cloneItem.props.more)
    //特别处理下row + col 的 span
    if (parent?.data['~itemSpan']) {
        if (cloneItem.props?.more.find(item => item.prop === 'span')) {
            cloneItem.data.span = parent?.data['~itemSpan']
        }
    }
    //特别处理下table 放入的子元素的宽度
    if (parent?.data['~itemWidth']) {
        if (cloneItem.props?.base.find(item => item.prop === 'width')) {
            cloneItem.data.width = parent?.data['~itemWidth']
        }
    }

    return cloneItem
}

export function getChainValueByString(data = {}, skey, split = '.') {
    if (!skey || !data) return

    const keys = skey.split(split)
    let currentData = data

    for (let key of keys) {
        if (key in currentData) {
            currentData = currentData[key]
        } else {
            return
        }
    }

    return currentData
}

export function setChainValueByString(data = {}, skey, value, split = '.') {
    if (!skey || !data) return

    const keys = skey.split(split)
    let currentData = data

    for (let i = 0; i < keys.length; i++) {
        let key = keys[i]

        if (i === keys.length - 1) {
            currentData[key] = value
            break;
        }

        if (currentData[key] === undefined) {
            currentData[key] = {}
        }
        currentData = currentData[key]
    }
}

export function designListToDataList(designList) {
    const dataList = []
    for (let item of designList) {
        let column = {
            group: '',
            type: item.type,
            data: item.data,
            uuid: item.uuid,
        }
        if (item.children) {
            column.children = designListToDataList(item.children)
        }
        dataList.push(column)
    }
    return dataList
}

export function dataListToDesignList(dataList, parent) {
    let designList = []
    for (let item of dataList) {
        let config = getConfigItem(item.type)
        if (config) {
            config = clone(config, parent)
            config.data = item.data
            if (item.children?.length) {
                config.children = dataListToDesignList(item.children, config)
            }
            designList.push(config)
        }
    }
    return designList
}
/**
 * 
 * @param {*} list 
 */
export function testSomeUseInPreCode(list, something, changes) {
    for (let item of list) {
        if (item.initCodeValue && item.initCodeValue.includes(something)) {
            changes.push(item)
        }
    }
}
/**
 * 
 * @param {設計數據列表} list 
 * @param {改變的内容} something 
 * @param {數組} changes 
 * @returns 
 */
export function testSomeUseInData(list, something, changes) {
    for (let item of list) {
        if (Object.values(item.data).some(el => typeof el === 'string' && el.includes(something))) {
            changes.push(item)
        }
        if (item.children?.length) {
            testSomeUseInData(item.children, something, changes)
        }
    }
}
/**
 * 是不是字母
 * @param {字符} char 
 * @returns 
 */
function isAlpha(char) {
    return (char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z')
}
/**
 * 
 * @param {*} fullString 
 * @param {*} subString 
 */
function isFullString(fullString, subString) {
    let index = fullString.indexOf(subString)
    if (index !== -1) {
        let preIndex = index - 1, endIndex = index + subString.length;
        if (!isAlpha(fullString.charAt(preIndex)) && !isAlpha(fullString.charAt(endIndex))) {
            return true
        }
    }
    return false
}
/** 
 * @param {數據數組} changes 
 * @param {被替換的字符串} originString 
 * @param {要替換的字符串} nextString 
 */
export function exchangeDataString(changes, originString, nextString) {
    for (let dataItem of changes) {
        const { data } = dataItem
        for (let key in data) {
            if (typeof data[key] === 'string') {
                if (isFullString(data[key], originString)) {
                    data[key] = data[key].replaceAll(originString, nextString)
                }
            }
        }
    }
}
/** 
 * @param {數據數組} changes 
 * @param {被替換的字符串} originString 
 * @param {要替換的字符串} nextString 
 */
export function exchangePreCodeString(changes, originString, nextString) {
    for (let dataItem of changes) {
        if (isFullString(dataItem.initCodeValue, originString)) {
            dataItem.initCodeValue = dataItem.initCodeValue.replaceAll(originString, nextString)
        }
    }
}

const es6Start = ')=>{'
export function getFnContainer(fnStr) {
    if (!fnStr) return ""

    let startIndex = -1, subIndex = 0, fullStr = fnStr.toString()
    for (let i = 0; i < fullStr.length; i++) {
        if (fullStr.charAt(i) === ' ') continue

        if (fullStr.charAt(i) === es6Start.charAt(subIndex)) {
            startIndex = i
            subIndex++
        } else {
            startIndex = -1
            subIndex = 0
        }
        if (subIndex === es6Start.length)
            break
    }
    const endIndex = fullStr.lastIndexOf("}")
    if (startIndex !== -1 && endIndex !== -1) {
        return fullStr.substring(startIndex + es6Start.length + 1, endIndex - 1)
    }
}

export function getSpace(step = 1) {
    if (step === 0) return ''
    const tab = 4
    const s = new Array(tab * step)
    return s.fill(' ').join('')
}

export function isComponent({ isContainer, type = '' }) {
    return (
        isContainer && type[0]?.toUpperCase() === type[0]
    )
}

export function isContainer({ isContainer, type = '' }) {
    return (
        isContainer && type[0]?.toUpperCase() !== type[0]
    )
}

export function isComponentType(type = '') {
    return type[0]?.toUpperCase() === type[0]
}
/**
 * 
 * @param {要转义的值} value 
 * @param {是否使用转义值} useValue 
 * @returns 
 */
const sysPrefixLibs = [INSTRUCTS.GLOBAL, INSTRUCTS.VAR, INSTRUCTS.FN, INSTRUCTS.SYS_PAGEMENUOPTIONS]
function isJsx(value) {
    return (value[0] === "<" && value.endsWith("/>"))
}

function isFunctionValue(value) {
    return typeof value === 'string' && ((['arguments', 'name', 'status'].includes(value) || window[value]) && value.charAt(0) !== '$' && !value.includes('.'))
}
//预览用
export function getPreviewValue(value, libs = {}) {
    if (isFunctionValue(value)) {
        return value
    }

    try {
        return (new Function(...Object.keys(libs), "return " + value))(...Object.values(libs))
    } catch (e) {
        return value
    }
}
//代码生成时
export function getCodeValue(value, rule) {
    if (typeof value === 'string' && sysPrefixLibs.some(el => value.indexOf(el) === 0))
        return value

    if (rule?.type) {
        switch (rule.type) {
            case valueTypes.fun:
            case valueTypes.ref:
            case valueTypes.unString:
                return value;
            case valueTypes.string:
                return value.toString()
        }
    }

    try {
        if (isFunctionValue(value)) {
            throw new Error("is function value")
        }

        (new Function("$history", "return " + value))({ state: {} })
        return value
    } catch {
        let strValue = value.toString()

        if (isJsx(strValue)) {
            return strValue
        }
        return `"${strValue}"`
    }
}
/**
 * 预览将数据转换
 * @param {要改的} data 
 * @param {库 {$util: {} ,...}} libs, 不用，直接使用字符串 
 * @returns 
 */
export function getPreviewData(data, libs) {
    const newData = {}

    for (let key of Object.keys(data)) {
        if (isPlainObject(data[key])) {
            newData[key] = getPreviewData(data[key], libs)
        } else if (key.includes('.')) {
            setChainValueByString(newData, key, getPreviewValue(data[key], libs))
        } else {
            newData[key] = getPreviewValue(data[key], libs)
        }
    }
    return newData
}

export function getCodeData(data, rules = {}) {
    const newData = {}

    for (let key of Object.keys(data)) {
        if (isPlainObject(data[key])) {
            newData[key] = getCodeData(data[key], rules)
        } else if (key.includes('.')) {
            setChainValueByString(newData, key, getCodeValue(data[key], rules[key]))
        } else {
            newData[key] = getCodeValue(data[key], rules[key])
        }
    }
    return newData
}
//是不是特殊字符
export function isSpecialChar(c) {
    return /[^_a-zA-Z0-9]/.test(c)
}
//是不是空对象
export function isNullObject(obj) {
    if (obj === false) return false

    if (typeof obj === 'string' && obj.trim() === '') {
        return true
    } else if (!obj && obj !== '0' && obj !== 0) {
        return true
    } else if (isPlainObject(obj)) {
        if (Object.keys(obj).length) {
            return false
        }
        return Object.keys(obj).every(key => isNullObject(obj[key]))
    } else {
        return false
    }
}

export function isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}
//将对象转换为字符串 {} => "{}"
export function objectToString(data) {
    let column = "{ "
    for (let itemKey in data) {
        if (isNullObject(data[itemKey]) || itemKey.indexOf('~') === 0) continue

        if (Array.isArray(data[itemKey])) {
            column += `${itemKey}:${arrayToString(data[itemKey])}, `
        } else if (isPlainObject(data[itemKey])) {
            let objStr = objectToString(data[itemKey])
            if (objStr !== null) {
                column += `${itemKey}: ${objStr}, `
            }
        } else {
            column += `${itemKey}: ${safeString(getCodeValue(data[itemKey]), isStrValuekey(itemKey))}, `
        }
    }
    if (column.length > 2) {
        column = column.substring(0, column.length - 2)
    } else {
        return null
    }
    column += " }"
    return column
}

export function arrayToString(arr) {
    if (!arr) return "[]";

    let arrString = "["
    for (let data of arr) {
        arrString += objectToString(data) + ","
    }
    arrString += "]"
    return arrString
}


export function toFirstUpperCase(str) {
    if (str && str.length)
        return str[0].toUpperCase() + str.substring(1)
    return str
}

export function toFirstLowerCase(str) {
    if (str && str.length)
        return str[0].toLowerCase() + str.substring(1)
    return str
}
/**
 * 
 * @param {1 => "1", 带双引号} str 
 * @param {boolean defalut true, false  返回原样} safe
 * @returns 
 */
export function safeString(str, safe = true) {
    if (safe && str) {
        let s = str.toString()
        if (s.indexOf('"') !== 0) {
            return `"${s}"`
        }
    }

    return str
}

export function unSafeString(str, unSafe = true) {
    if (unSafe && str) {
        let s = str.toString()
        return s.replaceAll(/"|'/g, '')
    }
    return str
}

export function isSystemVar(value) {
    const systemVars = [INSTRUCTS.FN, INSTRUCTS.VAR, INSTRUCTS.HISTORY, INSTRUCTS.GLOBAL, INSTRUCTS.REF]

    return systemVars.some(item => value?.indexOf(item) === 0)
}

export function isStrValuekey(key) {
    const strValuekeys = ['prop', 'label', 'tab']

    return strValuekeys.includes(key)
}

export function getEventItemString({ prop, content, ifOrElse = 'if', type }) {
    const istr = IString()
    let selfProp = safeString((prop || '')?.toString().replace('@', '$'))

    istr.append(`<!if!> (params.prop === <!prop!><!type!>) {<!content!>}`)
        .template({
            if: ifOrElse,
            prop: selfProp,
            content: content,
            type: type ? ` && params.type === '${type.replace('@', '')}'` : ''
        })

    return istr.toString()
}

export function objectMerge(target, source) {
    Object.assign(target, source)
}
/**
 * 截职字符串
 * @param fullText 原始字符串
 * @param len 截取的长度，英文为1，中文为2， "12中" => 4; "中方" => 4; "123" => 3
 * @returns {string} //截取字符串
 */
export function getSubString(fullText, len = 0) {
    if (fullText === void 0 || fullText === null) return fullText;
    let subText = '';
    for (let i = 0, k = 0; i < len; k++) {
        if (fullText.charCodeAt(i) > 127 || fullText.charCodeAt(i) === 94) i += 2;
        else i++;

        subText += fullText.charAt(k);
    }
    if (fullText.length !== subText.length) subText += '...';
    return subText;
}
//预览跳转的时的参数加个前缀
export function addParamsKeyPrefix(params) {
    const result = {}
    if (isPlainObject(params)) {
        for (let key in params) {
            result[paramsKeyPrefix + key] = params[key]
        }
    }
    return result
}
//拆分出用户预览虚拟路由与网站路由
export function getSplitParams(params) {
    const vir = {}, web = {}

    if (isPlainObject(params)) {
        for (let key in params) {
            if (key.includes(paramsKeyPrefix)) {
                const [, newKey] = key.split(paramsKeyPrefix)
                vir[newKey] = params[key]
            } else {
                web[key] = params[key]
            }
        }
    }
    return { vir, web }
}

export function getPageRouteMap(pages, prePath = '/') {
    let routes = {}

    for (let page of pages) {
        const { pageRouter, children } = page

        const path = prePath + pageRouter

        routes[path] = { ...page, pageRouter: path }

        if (children && children.length) {
            routes = {
                ...routes,
                ...getPageRouteMap(page.children, path + '/')
            }
        }
    }
    return routes
}

export function pagesHasPath(pages, pagePathMap, paths) {
    for (let page of pages) {
        let path = pagePathMap[page.pageId]
        if (paths.includes(path)) {
            return true
        }
        if (page.children?.length && pagesHasPath(page.children, pagePathMap, paths)) {
            return true
        }
    }
    return false
}

export function getPageRouteIdPathMap(pageRouteMap) {
    const routeIdPath = {}
    for (let path in pageRouteMap) {
        const page = pageRouteMap[path]
        routeIdPath[page.pageId] = path
    }

    return routeIdPath
}

export function getPageMenuOption(pages, pageRouteIdPathMap) {
    const pageMenuOptions = []
    for (let i = 0; i < pages.length; i++) {
        const page = pages[i]

        const pageMenuOption = {
            label: page.pageName,
            value: pageRouteIdPathMap[page.pageId]
        }
        if (Array.isArray(page.children) && page.children.length) {
            pageMenuOption.children = getPageMenuOption(page.children, pageRouteIdPathMap)
        }

        pageMenuOptions.push(pageMenuOption)
    }

    return pageMenuOptions
}

export function testInInputActiveElement() {
    return stopListenerClass.some(c => document.activeElement?.className?.includes(c))
}

export function openTokenSet() {
    Dialog.open(TokenDialogName, '设置项目在线开发时调试数据').then(set => {
        set(<Form
            onSubmit={data => {
                user.setUserProjectToken(data.token)
                user.setUserProjectUserId(data.userId)
                user.setUserProjectBaseUrlTip(data.baseUrlTip)
                user.setUserProjectAxiosHeaders(data.headers)
                message.success('设置成功!')
                Dialog.close(TokenDialogName)
            }}
            data={{
                userId: user.getUserProjectUserId(),
                token: user.getUserProjectToken(),
                baseUrlTip: user.getUserProjectBaseUrlTip(),
                headers: user.getUserProjectAxiosHeaders()
            }}
            columns={[
                {
                    type: 'input',
                    prop: 'userId',
                    label: '用户 ID',
                    placeholder: '输入当前用户 ID',
                    config: {
                        help: '当登录的用户的 id'
                    }
                },
                {
                    type: 'input',
                    prop: 'token',
                    label: 'token',
                    placeholder: '输入您项目接口要访问后台的token',
                    config: {
                        help: '用户访问接口的令牌'
                    }
                },
                {
                    prop: 'headers',
                    render: DefaulutEditor,
                    label: 'headers',
                    placeholder: '如: { tid: 10086 }',
                    config: {
                        help: 'axios 的 headers 对象，访问时添加附加信息'
                    }
                },
                {
                    type: 'switch',
                    prop: 'baseUrlTip',
                    label: '异常提示',
                    config: {
                        help: '项目母版没配置基本路径，却调用接口的异常提示'
                    }
                }
            ]}
        />)
    })
}
