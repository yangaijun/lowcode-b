import Component from './models/component'
import { getSpace, toFirstUpperCase, toFirstLowerCase, getCodeValue, unSafeString, arrayToString, isSpecialChar } from './util'
import { InitCodeType } from 'views/light/types'
import { serviceSuffix, INSTRUCTS, RENAMES } from 'views/light/config'
import Name from './models/name'
import { IString } from './string'
import Imodules, { moduleNames } from './models/imodule'
import IreactBatch from './models/ireactbatch'
import Iinfo from './models/iinfo'
import Bus, { BUS_KEYS } from '../bus'
/**
 * 转接口方法 ITEM
 * @param {*} param0 后台service 实体
 * @param {*} page 
 * @param {*} step 前面留空格
 * @returns 
 */
export function toServiceItem({ serviceMethod, serviceUrl, serviceName, serviceComment, serviceResponseType }) {
    const result = IString(serviceComment ? `//${serviceComment}\n` : '')
    result.append(serviceName)
        .appendln('(params) {')
        .appendln(`    return Http.${serviceMethod}(\`${serviceUrl}\`, params<!config!>)`)
        .append('}')
        .template({
            config: serviceResponseType ? `, { \n        responseType: "${serviceResponseType}" \n    }` : ''
        })

    return result.toString()
}
/** 
 * @param {*} param0 
 * @param {*} page 页面
 * @returns 
 */
export function toInitCodeItem(params, page) {
    let code = ''
    if (params.initCodeType === InitCodeType.VAR) {
        code = toInitCodeState(params)
    } else if (params.initCodeType === InitCodeType.EFFECT) {
        code = toInitCodeEffect(params)
    } else if (params.initCodeType === InitCodeType.FN) {
        code = toInitCodeCallBack(params)
    } else if (params.initCodeType === InitCodeType.REF) {
        code = toInitCodeRef(params)
    }
    return resetInstructFunction(code, page, { getName: (new Name()).get })
}
/** 
 * @param {*} param0 
 * @param {*} page 页面
 * @returns 
 */
export function toInitCodeState({ initCodeName, initCodeValue }) {
    if (!initCodeName) {
        return 'const [] = useState()'
    }
    return IString('const [<!initCodeName!>, set<!v2!>] = useState(<!v3!>)')
        .template({
            initCodeName,
            v2: toFirstUpperCase(initCodeName),
            v3: initCodeValue !== null ? getCodeValue(initCodeValue) : ''
        }).toString()
}
/** 
 * @param {*} param0 
 * @param {*} page 页面
 * @returns 
 */
export function toInitCodeRef({ initCodeName, initCodeValue }) {
    if (!initCodeName) {
        return 'const refName = useRef()'
    }
    return IString('const <!initCodeName!> = useRef(<!v1!>)')
        .template({
            initCodeName,
            v1: initCodeValue !== null ? getCodeValue(initCodeValue) : ''
        }).toString()
}
/** 
 * @param {*} param0 
 * @param {*} page 页面
 * @returns 
 */
export function toInitCodeCallBack({ initCodeName, initCodeEffect, initCodeValue }) {
    return IString('const <!v1!> = useCallback(<!v2!>, [<!v3!>])')
        .template({
            v1: initCodeName || 'functionName',
            v2: initCodeValue,
            v3: initCodeEffect ? initCodeEffect.join(', ') : ''
        }).toString()
}
/** 
 * @param {*} param0 
 * @param {*} page 页面
 * @returns 
 */
export function toInitCodeEffect({ initCodeEffect, initCodeValue }) {
    return IString('useEffect(<!v1!>, [<!v2!>])')
        .template({
            v1: initCodeValue,
            v2: initCodeEffect ? initCodeEffect.join(', ') : ''
        }).toString()
}
/** 
 * 转换为 class 代码 
 * @param {*} designList 设计器数组
 * @param {*} page 后台页面实体
 * @returns 
 * @deprecated
 */
export function toClass() {
    return "class已经被弃用啦！"
}
/** 
 * 转换为 hook 版本代码 
 * @param {*} designList 设计器数组
 * @param {*} page 后台页面实体
 * @returns 
 */
export function toHook(designList, page) {
    const container = IString()
    const { pageFileName, initCodes } = page
    const { list, iModules, iReactBatch, iInfo } = toComponents(designList)
    const doms = renderDoms({ list, pageClass: page.pageClass, pageLess: page.pageLess })
    const initCodeStates = [], initCodeCallBacks = [], initCodeEffects = [], initCodeRefs = []

    for (let codeItem of initCodes) {
        if (codeItem.initCodeType === InitCodeType.VAR) {
            initCodeStates.push(codeItem)
        } else if (codeItem.initCodeType === InitCodeType.FN) {
            initCodeCallBacks.push(codeItem)
        } else if (codeItem.initCodeType === InitCodeType.EFFECT) {
            initCodeEffects.push(codeItem)
        } else if (codeItem.initCodeType === InitCodeType.REF) {
            initCodeRefs.push(codeItem)
        }
    }
    if (initCodeStates.length || iReactBatch.hasState()) {
        iModules.pushP(moduleNames.react, 'useState')
    }
    if (initCodeCallBacks.length) {
        iModules.pushP(moduleNames.react, 'useCallback')
    }
    if (initCodeEffects.length) {
        iModules.pushP(moduleNames.react, 'useEffect')
    }
    if (initCodeRefs.length || iReactBatch.hasRef()) {
        iModules.pushP(moduleNames.react, 'useRef')
    }

    container.appendln(getExportStart(pageFileName))
        .append(`<!${RENAMES.urlParams}!>`)
        .append(iReactBatch.toRefString())
        .append(iReactBatch.toStateString())

    //添加初始化state
    initCodeStates.forEach(item => {
        container.appendln(toInitCodeState(item))
    })
    //添加初始化ref
    initCodeRefs.forEach(item => {
        container.appendln(toInitCodeRef(item))
    })
    //添加初始化函数
    initCodeCallBacks.forEach(item => {
        container.appendln(toInitCodeCallBack(item))
    })
    container.append(iReactBatch.toEventString())
    //添加初始化effect
    initCodeEffects.forEach(item => {
        container.appendln(toInitCodeEffect(item))
    })
    //dom
    container.appendln(doms)
        .appendln(getExportEnd())
    //-------------golal modules----------------
    let tempDoms = container.toString()

    if (tempDoms.includes(INSTRUCTS.MESSAGE)) {
        iModules.pushP(moduleNames.antd, 'message')
        tempDoms = tempDoms.replaceAll(INSTRUCTS.MESSAGE, '')
    }
    if (tempDoms.includes(INSTRUCTS.MODAL)) {
        iModules.pushP(moduleNames.antd, 'Modal')
    }
    if (tempDoms.includes(INSTRUCTS.UTIL)) {
        iModules.pushC(moduleNames.util, 'util')
    }
    if (tempDoms.includes(INSTRUCTS.HISTORY)) {
        iModules.pushP(moduleNames.util, 'history')
    }
    if (tempDoms.includes(INSTRUCTS.HISTORYRSTATE)) {
        iModules.pushP(moduleNames.util, 'parseURLParams')
        container.template({
            [RENAMES.urlParams]: `const ${RENAMES.urlParams} = parseURLParams()\n`
        })

    } else {
        container.template({
            [RENAMES.urlParams]: ""
        })
    }
    if (tempDoms.includes(INSTRUCTS.GLOBAL)) {
        iModules.pushC(moduleNames.global, '* as globalData')
    }

    //format code
    container.insertln(getImports(iModules, pageFileName))
    let icontainer = resetInstructFunction(container.toString(), page, { iInfo, getName: (new Name()).get })
    try {
        return window.codeFormart(icontainer)
    } catch (error) {
        return error.message + '\n\n' + icontainer
    }
}
export function toValidClass(className = '') {
    return className.replaceAll('$', 'dr')
}
export function getOriginalClass(item, getName) {
    return toValidClass(getName(item.data.className || item.data.prop || (item.data.type || item.type).toLowerCase()))
}
//下一个方法的工具
function getClassName(item, prefix, getName) {
    return prefix + getOriginalClass(item, getName)
}
function appendSpace(str, space) {
    return str.replaceAll('\n', '\n' + getSpace(space))
}
/**
 * 设计器找出less
 * @param {设计器数据} designList 
 * @param {页面} page 
 */
function toLess(designList, prefix, getName, space = 0) {
    let less = '', nextSpace = space + 1

    for (let item of designList) {
        if (item.data['~less']) {
            let itemLess = '\n' + item.data['~less']
            let className = getClassName(item, prefix, getName)
            less += `${getSpace(space)}.${className} {${appendSpace(itemLess, nextSpace)}\n`
            item.data['~className'] = className
        }
        if (item.children && item.children.length) {
            less += toLess(item.children, prefix, getName, item.data['~less'] ? nextSpace : space)
        }
        if (item.data['~less']) {
            less += `${getSpace(space)}}\n`
        }
    } 
    return less
}
/**
 * 设计器找出less
 * @param {设计器数据} designList 
 * @param {页面} page 
 */
export function toPageLess({ pageClass, pageLess, designList }, prefix = '', space = 0) {
    let nextSpace = space + 1
    const getName = (new Name()).get
    if (pageClass && pageLess) {
        const classname = prefix + pageClass
        return `${getSpace(space)}.${classname} {${appendSpace('\n' + pageLess, nextSpace)}\n${toLess(designList, prefix, getName, nextSpace)}}\n`
    } else {
        return toLess(designList, prefix, getName, space)
    }
}
export function toService(page) {
    const { pageFileName } = page
    if (!pageFileName) {
        return ''
    }
    const serviceName = getServiceName(pageFileName)

    return toServiceCode(
        serviceName,
        toFirstUpperCase(pageFileName) + serviceSuffix,
        page
    )
}

export function toInitCodeStates(designList) {
    const { iReactBatch } = toComponents(designList)
    const initCodes = [], states = iReactBatch.getStates()
    for (let key in states) {
        initCodes.push({
            initCodeName: key,
            initCodeValue: states[key],
            initCodeType: InitCodeType.VAR,
            readOnly: true
        })
    }
    return initCodes
}

export function toInitCodeRefs(designList) {
    const { list, iReactBatch } = toComponents(designList)
    //read columns
    renderDoms({ list })

    return iReactBatch.getRefs()
}
/**
 * 
 * @param {*} pageFileName 文件名
 * @returns service name
 */
export function getServiceName(pageFileName) {
    return toFirstLowerCase(pageFileName) + serviceSuffix
}

function toServiceCode(serviceName, className, page) {
    const { services } = page
    let service = IString("import Http from 'libs/http'\n\n")
        .appendln(`class ${className} {`)

    for (let api of services) {
        service.appendln(toServiceItem(api))
    }
    service.appendln("}")
        .append(`\nconst ${serviceName} = new ${className}()`)
        .append(`\nexport default ${serviceName}`)

    return window.codeFormart(service.toString())
}

function toComponents(designList) {
    let list = []
    const getName = (new Name()).get
    const iModules = new Imodules()
    const iReactBatch = new IreactBatch()
    const iInfo = new Iinfo()
    for (let design of designList) {
        list.push(new Component(design, { getName, iModules, iReactBatch, iInfo }))
    }
    return { list, iModules, iReactBatch, iInfo }
}

function getImports(iModules, pageFileName) {
    const str = IString(iModules.toString())

    str.appendln(`import ${getServiceName(pageFileName)} from 'services/${pageFileName}'`)
        .appendln(`import styles from './index.module.less'`)

    return str.toString()
}

function getExportStart(name) {
    return `export default function ${toFirstUpperCase(name)}() {`
}

function getExportEnd() {
    return `}`
}

function isParam(s) {
    //string
    if (["'", '"'].includes(s[0])) {
        try {
            (new Function("return " + s))();
            return true
        } catch (error) {
            return false
        }
    }
    let errors = 0
    for (let i = 0; i < s.length; i++) {
        if (['[', '{', '('].includes(s[i])) errors++
        else if ([']', '}', ')'].includes(s[i])) errors--
    }
    return !errors
}

function getOpenModalInfo(str = '') {
    str = str.trim()
    let arrs = str.split(",")
    let params = [], currentParam = ""
    for (let i = 0; i < arrs.length; i++) {
        currentParam += (!currentParam ? "" : ",") + arrs[i]
        if (isParam(currentParam)) {
            params.push(currentParam)
            currentParam = ""
        }
    }

    if (params.length >= 3) {
        return {
            str: params.slice(0, 2).toString(),
            param: params[2],
            name: params[0]
        }
    } else {
        return {
            str: params.toString(),
            name: params[0]
        }
    }
}

function getStateInfo(str = '') {
    str = str.trim()
    const firstIndex = str.indexOf(',')
    if (firstIndex !== -1) {
        const key = str.substring(1, firstIndex - 1)
        const value = str.substring(firstIndex + 1).trim()
        return { key, value }
    }
}

function getEndIndex(str, startIndex, leftC = '(', rightC = ')') {
    let i = startIndex, count = 1;

    for (; i < str.length; i++) {
        if (str.charAt(i) === leftC) count++
        else if (str.charAt(i) === rightC) count--

        if (count === 0) break
    }

    return i;
}

//[['$c', 123], ['$e', 789]]: $c替换成123, 
export function replaceInstructStr(str, arrs) {
    if (!arrs?.length) return str
    
    let regs = "", map = {}
    for (let [reg, value] of arrs) {
        regs += reg.replaceAll('$', "\\$").replaceAll('(', "\\(") + "|"
        map[reg] = value

    }
    regs = regs.substring(0, regs.length - 1)

    return str.replace(new RegExp(regs, 'g'), (word) => {
        return map[word]
    })
}

function resetInstructFunction(funString = '', page, { iInfo, getName } = {}) {
    //ref
    let refIndex = funString.indexOf(INSTRUCTS.REF)
    if (refIndex !== -1) {
        let refString = ""
        for (let i = refIndex + INSTRUCTS.REF.length; i < funString.length; i++) {
            if (isSpecialChar(funString[i])) {
                break;
            }
            refString += funString[i]
        }
        funString = funString.replaceAll(INSTRUCTS.REF + refString, refString + ".current")
    }
    //$open dialog
    const openDialogIndex = funString.indexOf(INSTRUCTS.DIALOGOPEN)
    if (openDialogIndex !== -1) {
        let start = openDialogIndex + INSTRUCTS.DIALOGOPEN.length + 1
        let end = getEndIndex(funString, start)

        const info = getOpenModalInfo(funString.substring(openDialogIndex + INSTRUCTS.DIALOGOPEN.length + 1, end))
        const name = unSafeString(info.name)
        funString = resetInstructFunction(
            funString.substring(0, openDialogIndex)
            + `Dialog.open(${info.str})`
            + (iInfo?.hasDialogOrDrawerName(name) ? "" : `.then(set => set(${iInfo?.getFnByN(name)}(${info.param ? info.param : ''})))`)
            + funString.substring(end + 1),
            page,
            { getName, iInfo }
        )
    }
    //$close dialog
    const closeDialogIndex = funString.indexOf(INSTRUCTS.DIALOGCLOSE)
    if (closeDialogIndex !== -1) {
        let start = closeDialogIndex + INSTRUCTS.DIALOGCLOSE.length + 1
        let end = getEndIndex(funString, start)

        const info = getOpenModalInfo(funString.substring(start, end))
        funString = resetInstructFunction(
            funString.substring(0, closeDialogIndex)
            + `Dialog.close(${info.str})`
            + funString.substring(end + 1), page, { getName, iInfo }
        )
    }
    //$loading dialog
    const loadingDialogIndex = funString.indexOf(INSTRUCTS.DIALOGLOADING)
    if (loadingDialogIndex !== -1) {
        let start = loadingDialogIndex + INSTRUCTS.DIALOGLOADING.length + 1
        let end = getEndIndex(funString, start)

        const info = getOpenModalInfo(funString.substring(start, end))
        funString = resetInstructFunction(
            funString.substring(0, loadingDialogIndex)
            + `Dialog.loading(${info.str})` + funString.substring(end + 1), page, { getName, iInfo }
        )
    }
    //$open drawer
    const openDrawerIndex = funString.indexOf(INSTRUCTS.DRAWEROPEN)
    if (openDrawerIndex !== -1) {
        let start = openDrawerIndex + INSTRUCTS.DRAWEROPEN.length + 1
        let end = getEndIndex(funString, start)

        const info = getOpenModalInfo(funString.substring(openDrawerIndex + INSTRUCTS.DRAWEROPEN.length + 1, end))
        const name = unSafeString(info.name)
        funString = resetInstructFunction(
            funString.substring(0, openDrawerIndex)
            + `Drawer.open(${info.str})`
            + (iInfo.hasDialogOrDrawerName(name) ? "" : `.then(set => set(${iInfo.getFnByN(name)}(${info.param ? info.param : ''})))`)
            + funString.substring(end + 1), page, { getName, iInfo }
        )
    }
    //$close drawer
    const closeDrawerIndex = funString.indexOf(INSTRUCTS.DRAWERCLOSE)
    if (closeDrawerIndex !== -1) {
        let start = closeDrawerIndex + INSTRUCTS.DRAWERCLOSE.length + 1
        let end = getEndIndex(funString, start)

        const info = getOpenModalInfo(funString.substring(start, end))
        funString = resetInstructFunction(
            funString.substring(0, closeDrawerIndex)
            + `Drawer.close(${info.str})` + funString.substring(end + 1), page, { getName, iInfo }
        )
    }
    //$loading drawer
    const loadingDrawerIndex = funString.indexOf(INSTRUCTS.DRAWERLOADING)
    if (loadingDrawerIndex !== -1) {
        let start = loadingDrawerIndex + INSTRUCTS.DRAWERLOADING.length + 1
        let end = getEndIndex(funString, start)

        const info = getOpenModalInfo(funString.substring(start, end))
        funString = resetInstructFunction(
            funString.substring(0, loadingDrawerIndex)
            + `Drawer.loading(${info.str})` + funString.substring(end + 1), page, { getName, iInfo }
        )
    }
    //$set Data
    const setIndex = funString.indexOf(INSTRUCTS.SET)
    if (setIndex !== -1) {
        let start = setIndex + INSTRUCTS.SET.length + 1
        let end = getEndIndex(funString, start)

        const info = getStateInfo(funString.substring(start, end))
        if (info) {
            let state = `set${toFirstUpperCase(info.key)}(${info.value})`

            funString = resetInstructFunction(funString.substring(0, setIndex) + state + funString.substring(end + 1), page, { getName, iInfo })
        }
    }
    funString = replaceInstructStr(funString, [
        //util
        [INSTRUCTS.UTIL, RENAMES.util],
        //localStorage
        [INSTRUCTS.LS, RENAMES.ls],
        //全局数据
        [INSTRUCTS.GLOBAL, RENAMES.globalData],
        //页面变量
        [INSTRUCTS.VAR, RENAMES.nullString],
        //页面函数
        [INSTRUCTS.FN, RENAMES.nullString],
        //路由push
        [INSTRUCTS.HISTORYPUSH, RENAMES.historyPush],
        //路由push
        [INSTRUCTS.HISTORYREPLACE, RENAMES.historyReplace],
        //路由go
        [INSTRUCTS.HISTORYGO, RENAMES.historyGo],
        //url 上的 params
        [INSTRUCTS.HISTORYRSTATE, RENAMES.urlParams],
        //弹窗，消息提示, 顺序不能变
        [INSTRUCTS.MESSAGE, "message."],
        //项目页面菜单选项
        [INSTRUCTS.SYS_PAGEMENUOPTIONS, arrayToString(Bus.get(BUS_KEYS.pageMenuOptions))]
    ])
    funString = funString.replaceAll(INSTRUCTS.MODAL, "Modal.")

    const apiPostIndex = funString.indexOf(INSTRUCTS.API)
    if (apiPostIndex !== -1) {
        funString = funString.replaceAll(INSTRUCTS.API, getServiceName(page.pageFileName))
    }

    return funString
}

function renderDoms({ list, pageClass, pageLess }) {
    let className = ""
    if (pageLess && pageClass) {
        className = ` className={styles['${pageClass}']} `
    } else if (pageClass) {
        className = ` className={'${pageClass}'} `
    }

    let domStrs = `return (<div${className}>\n`
    for (let item of list) {
        domStrs += item.getDomString()
    }
    domStrs += `</div>)`
    return domStrs
}