import { getSpace, isComponent } from 'views/light/utils/util';
import Bus, { BUS_KEYS } from 'views/light/bus';
import { PAGE_ACTIVE_COLUMN_UUID } from 'views/light/types';
import CodeEditor from 'components/CodeEditor';
import { componentTypes } from 'views/light/config';
import { ExpandOutlined } from '@ant-design/icons';
import { toInitCodeRefs } from 'views/light/utils/icode';
import { Tooltip } from 'antd';
import styles from './renders.module.less'
//缓存
let preUUIDs = {},

    preComponentDataCompletions = {},
    preDrawerCompletions = [],
    preAsyncDrawerCompletions = [],
    preRefCompletions = [],
    preDialogCompletions = [],
    preAsyncDialogCompletions = []
/**
 * 获取组件的数据提示
 * @param {*} dataName 
 * @param {*} type 上一次使用此函数的类型
 * @returns 
 */
function getComponentDataCompletions(dataName = 'data', type = 'any') {
    const list = Bus.get(BUS_KEYS.designDataList)
    const uuid = Bus.get(BUS_KEYS.activeUUID)
    const uidKey = dataName + "_" + type

    if (preUUIDs[uidKey] === uuid && preComponentDataCompletions[uidKey]) {
        return preComponentDataCompletions[uidKey]
    }

    const completions = [], children = []
    let parent, firstComponentParent

    const findParentItem = (list = [], uuid, parent) => {
        for (let item of list) {
            if (item.uuid === uuid) {
                return parent === PAGE_ACTIVE_COLUMN_UUID ? item : parent
            } else if (item.children?.length) {
                let result = findParentItem(item.children, uuid, item)
                if (result) {
                    return result
                }
            }
        }
        return null;
    }
    do {
        parent = findParentItem(list, parent?.uuid || uuid, PAGE_ACTIVE_COLUMN_UUID)
        if (parent == null) break;
        if (!firstComponentParent && ['Table', 'List', 'FormList']?.includes(parent.type)) {
            firstComponentParent = parent
        }
        if (!parent.children) break;

        children.push(...parent.children)
    } while (!isComponent(parent))

    if (firstComponentParent) {
        completions.push({
            value: `${dataName}.$index`,
            meta: '当前数据下标'
        })
    }

    const setChildrenCompletions = (children) => {
        for (let el of children) {
            if (el.data.prop) {
                completions.push({
                    value: `${dataName}.${el.data.prop}`,
                    meta: (el.type === 'button' ? el.data.value : el.data.label) || '域内属性'
                })
            } else if (!componentTypes.includes(el.type) && el.children) {
                setChildrenCompletions(el.children)
            }
        }
    }
    preUUIDs[uidKey] = uuid
    setChildrenCompletions(children)
    preComponentDataCompletions[uidKey] = completions

    return completions
}
//基本事件中的params提示
const basicParamsCompletions = [
    { caption: 'params.value', value: 'params.value', score: 2, meta: '当前值' },
    { caption: 'params.type', value: 'params.type', score: 2, meta: '事件类型' },
    { caption: 'params.prop', value: 'params.prop', score: 2, meta: '当前prop' },
    { caption: 'params.row', value: 'params.row', score: 2, meta: '区域内所有数据' }
]
//table sorter basic
const basicSorterCompletions = [
    { caption: 'params.value', value: 'params.value', score: 2, meta: '排序方式,ascend,descend,undefined' },
    { caption: 'params.type', value: 'params.type', score: 2, meta: '固定值sorter' },
    { caption: 'params.prop', value: 'params.prop', score: 2, meta: '当前prop' },
    { caption: 'params.row', value: 'params.row', score: 2, meta: '当前列' },
    { caption: 'ascend', value: '"ascend"', score: 1, meta: 'value对应值：升序' },
    { caption: 'descend', value: '"descend"', score: 1, meta: 'value对应值：降序' }
]
//modal使用方法提示 
export const modalCompletions = [
    { caption: '$modal.message.success', value: '$modal.message.success()', score: 4, meta: '成功提示' },
    { caption: '$modal.message.warning', value: '$modal.message.warning()', score: 4, meta: '警告提示' },
    { caption: '$modal.message.error', value: '$modal.message.error()', score: 4, meta: '失败提示' },
    { caption: '$modal.message.info', value: '$modal.message.info()', score: 4, meta: '消息提示' },
    { caption: '$modal.message.loading', value: '$modal.message.loading()', score: 4, meta: '加载中提示' },

    { caption: '$modal.confirm', value: '$modal.confirm({\n        title: "确认",\n        content: "",\n        onOk(){}\n    })', score: 4, meta: '确认弹窗' },
    { caption: '$modal.warning', value: '$modal.warning({\n        content: ""\n    })', score: 4, meta: '警告弹窗' },
    { caption: '$modal.error', value: '$modal.error({\n        content: ""\n    })', score: 4, meta: '失败弹窗' },
    { caption: '$modal.success', value: '$modal.success({\n        content: ""\n    })', score: 4, meta: '成功弹窗' },
    { caption: '$modal.info', value: '$modal.info({\n        content: ""\n    })', score: 4, meta: '消息弹窗' },
]

export const modalAsyncCompletions = [
    {
        targetName: `$modal.confirm({`,
        completions: [
            { caption: 'tip:title', value: `title: "",`, score: 1, meta: '标题' },
            { caption: 'tip:content', value: `content: "",`, score: 1, meta: '内容' },
            { caption: 'tip:okText', value: `okText: "",`, score: 1, meta: '确定按钮文案' },
            { caption: 'tip:okType', value: `okType: 'danger'`, score: 1, meta: '确定按钮类型' },
            { caption: 'tip:cancelText', value: `cancelText: "",`, score: 1, meta: '取消按钮文案' },
            { caption: 'tip:cancelType', value: `cancelType: 'danger'`, score: 1, meta: '取消按钮类型' },
            { caption: 'tip:onOk()', value: `onOk() {}`, score: 1, meta: '确定事件' },
            { caption: 'tip:onCancel()', value: `onCancel() {}`, score: 1, meta: '取消事件' }
        ]
    }
]
//util 使用方法提示
export const utilCompletions = [
    { caption: '$util.setUserMenuPaths()', value: '$util.setUserMenuPaths([])', score: 2, meta: '设置权限菜单' },
    { caption: '$util.setPageLoading()', value: '$util.setPageLoading()', score: 2, meta: '设置页面是否加载中' },
    { caption: '$util.setUserId(userId)', value: '$util.setUserId(id)', score: 2, meta: '设置用户id, ' },
    { caption: '$util.getUserId', value: '$util.getUserId()', score: 2, meta: '获取用户id' },
    { caption: '$util.setToken(string)', value: '$util.setToken(token)', score: 2, meta: '设置用户token' },
    { caption: '$util.getToken', value: '$util.getToken()', score: 2, meta: '获取用户token' },
    { caption: '$util.dayjs', value: '$util.dayjs()', score: 2, meta: '日期库' },
    { caption: '$util.download(二进制,文件名)', value: '$util.download(blob, filename)', score: 2, meta: '下载文件' },
    { caption: '$ls.getItem', value: '$localStorage.getItem("key")', score: 3, meta: 'localStorage' },
    { caption: '$ls.setItem', value: '$localStorage.setItem("key", "value")', score: 3, meta: 'localStorage' },
    { caption: '$ls.removeItem', value: '$localStorage.removeItem("key")', score: 3, meta: 'localStorage' },
] 
//系统可访问变量
export const sysCompletions = [
    { caption: '$sys.pageMenuOptions', value: '$sys.pageMenuOptions', score: 2, meta: '项目的页面菜单' },
]
//分页的提示
const paginationParamsCompletions = [
    { caption: 'params.value', value: 'params.value', score: 1, meta: '当前值' },
    { caption: 'params.value.pageNo', value: 'params.value.pageNo', score: 1, meta: '当前页' },
    { caption: 'params.value.pageSize', value: 'params.value.pageSize', score: 1, meta: '每页大小' },
    { caption: 'params.prop', value: 'params.prop', score: 1, meta: '当prop,（固定$page）' },
]
//表格多选的提示
const selectionParamsCompletions = [
    { caption: 'params.prop', value: 'params.prop', score: 1, meta: '当prop,（固定$selection）' },
    { caption: 'params.value', value: 'params.value', score: 1, meta: '当前选中值（数组）' },
]
//keys
const paramsKeys = {
    basic: 'basic',
    pagination: 'pagination',
    selection: 'selection',
    sorter: 'sorter'
}
/**
 * 事件下的params提示
 * @param {basic:基本的, pagination:表格分页, selection: 表格选择 } type 
 * @returns 
 */
export function getParamsCompletions(type = paramsKeys.basic) {
    let completions = null
    if (type === paramsKeys.basic) {
        completions = [
            ...basicParamsCompletions,
            ...getComponentDataCompletions('params.row', 'params')
        ]
    } else if (type === paramsKeys.pagination) {
        completions = [...paginationParamsCompletions]
    } else if (type === paramsKeys.selection) {
        completions = [...selectionParamsCompletions]
    } else if (type === paramsKeys.sorter) {
        completions = [...basicSorterCompletions]
    }
    return completions;
}

export function getRefCompletions() {
    const list = Bus.get(BUS_KEYS.designDataList) || []
    const uuid = Bus.get(BUS_KEYS.activeUUID)

    if (uuid === preUUIDs.ref) {
        return preRefCompletions
    }

    const refs = toInitCodeRefs(list)
    const completions = []

    for (let refName in refs) {
        const { functions } = refs[refName]
        for (let key in functions) {
            completions.push(
                { name: refName + key, value: '$ref.' + refName + '.' + functions[key].full, score: 1, meta: functions[key].tip },
            )
        }
    }
    preUUIDs.ref = uuid
    preRefCompletions = completions
    return completions
}

function setModalCompletions(completions, list, types, name) {
    for (let item of list) {
        if (types.includes(item.type) && item.data.name) {
            completions.push(
                { value: `$${name}.open('${item.data.name}')`, score: 5, meta: item.data.title || '打开弹窗' },
                { caption: `$${name}.open('${item.data.name}',标题)`, value: `$${name}.open('${item.data.name}', '')`, score: 5, meta: item.data.title || '打开弹窗&标题' },
                { caption: `$${name}.open('${item.data.name}',{配置})`, value: `$${name}.open('${item.data.name}', {})`, score: 5, meta: item.data.title || '打开弹窗&配置' },
                { caption: `$${name}.open('${item.data.name}',标题,{表单初始数据})`, value: `$${name}.open('${item.data.name}', '', {})`, score: 5, meta: item.data.title || '打开弹窗&标题&传参' },
                { caption: `$${name}.open('${item.data.name}',{配置},{表单初始数据})`, value: `$${name}.open('${item.data.name}', {}, {})`, score: 5, meta: item.data.title || '打开弹窗&配置&传参' },
                { value: `$${name}.close('${item.data.name}')`, score: 5, meta: item.data.title || '关闭弹窗' },
                { value: `$${name}.loading('${item.data.name}')`, score: 5, meta: '使加载中' },
                { value: `$${name}.loading('${item.data.name}', false)`, score: 5, meta: '取消加载中' }
            )
        } else if (Array.isArray(item.children)) {
            setModalCompletions(completions, item.children, types, name)
        }
    }
}

function setModalNames(list, types, names) {
    for (let item of list) {
        if (types.includes(item.type) && item.data.name) {
            names.push(item.data.name)
        } else if (Array.isArray(item.children)) {
            setModalCompletions(list, types, names)
        }
    }
}

export function getDialogNames() {
    const list = Bus.get(BUS_KEYS.designDataList) || []
    const names = []
    setModalNames(list, ['FDialog', 'Dialog'], names)

    return names
}

export function getDrawerNames() {
    const list = Bus.get(BUS_KEYS.designDataList) || []
    const names = []
    setModalNames(list, ['FDrawer', 'Drawer'], names)

    return names
}
/**
 * 弹窗相关提示
 * @returns [completions, asyncCompletions]
 */
export function getDialogCompletions() {
    const list = Bus.get(BUS_KEYS.designDataList) || []
    const uuid = Bus.get(BUS_KEYS.activeUUID)

    if (uuid === preUUIDs.dialog) {
        return [preDialogCompletions, preAsyncDialogCompletions]
    }

    const completions = [], asyncCompletions = []
    setModalCompletions(completions, list, ['FDialog', 'Dialog'], 'dialog')

    if (completions.length) {
        asyncCompletions.push({
            targetName: `$dialog.open`,
            completions: [
                { caption: 'tip:title', value: `title: ''`, score: 1, meta: '标题' },
                { caption: 'tip:width', value: 'width: 600', score: 1, meta: '宽度' },
                { caption: 'tip:footer', value: 'footer: null', score: 1, meta: '底部' }
            ]
        })
    }
    preUUIDs.dialog = uuid
    preDialogCompletions = completions
    preAsyncDialogCompletions = asyncCompletions
    return [completions, asyncCompletions];
}
/**
 * 抽屉相关提示
 * @returns [completions, asyncCompletions]
 */
export function getDrawerCompletions() {
    const list = Bus.get(BUS_KEYS.designDataList) || []
    const uuid = Bus.get(BUS_KEYS.activeUUID)

    if (uuid === preUUIDs.drawer) {
        return [preDrawerCompletions, preAsyncDrawerCompletions]
    }

    const completions = [], asyncCompletions = []
    setModalCompletions(completions, list, ['FDrawer', 'Drawer'], 'drawer')

    if (completions.length) {
        asyncCompletions.push({
            targetName: `$drawer.open`,
            completions: [
                { caption: 'tip:title', value: `title: ''`, score: 1, meta: '标题' },
                { caption: 'tip:width', value: 'width: 600', score: 1, meta: '宽度' }
            ]
        })
    }
    preUUIDs.drawer = uuid
    preDrawerCompletions = completions
    preAsyncDrawerCompletions = asyncCompletions
    return [completions, asyncCompletions];
}
const ruleCompletions = [
    { caption: 'tip:must', value: 'must', score: 2, meta: '不能为空,同required' },
    { caption: 'tip:required', value: 'required', score: 1, meta: '不能为空,同must' },
    { caption: 'tip:phone', value: 'phone', score: 1, meta: '手机号码' },
    { caption: 'tip:email', value: 'email', score: 1, meta: 'email地址' },
    { caption: 'tip:url', value: 'url', score: 1, meta: 'url链接' },
    { caption: 'tip:number', value: 'number', score: 1, meta: '数值' },
    { caption: 'tip:int', value: 'int', score: 1, meta: '整数' },
    { caption: 'tip:intp', value: 'intp', score: 1, meta: '正整数' },
    { caption: 'tip:intn', value: 'intn', score: 1, meta: '负整数' },
    { caption: 'tip:zipcode', value: 'zipcode', score: 1, meta: '邮编' },
    { caption: 'tip:ip4', value: 'ip4', score: 1, meta: 'ipv4地址' },
    { caption: 'tip:idcard', value: 'idcard', score: 2, meta: '身份证号' },
    { caption: 'tip:empty', value: 'empty', score: 1, meta: '可以为空' },
    { caption: 'tip:len', value: 'len', score: 2, meta: '长度len[min][:max]' },
    { caption: 'tip:function', value: `({data, value}) => {\n${getSpace(1)}return (true) ? Promise.resolve() : Promise.reject('error message')\n}`, score: 2, meta: '验证函数' }
]
const historyState = {
    caption: `$history.state`,
    value: `$history.state.`,
    meta: "url上参数{}",
    score: 1
}
const historyGoBack = {
    caption: `$history.goBack`,
    value: `$history.go(-1)`,
    score: 0,
    meta: "返回"
}
//缺省接口&设设置变量提示
export const defaultCompletions = {
    serviceCompletions: [],
    varCompletions: [],
    varSetCompletions: [],
    refCompletions: [],
    functionCompletions: [],
    routerCompletions: [historyGoBack],
    globalDataCompletions: [historyState],
    ruleCompletions: [...ruleCompletions],
    globalTmpCompletions: []
}
//设计提示模版
export function setGlobalTmpCompletions(obj = {}) {
    const completions = []
    for (let key of Object.keys(obj)) {
        completions.push({
            name: '$temp.' + key,
            value: '$temp.' + key,
            meta: 'template',
            score: 1
        })
    }
    defaultCompletions.globalTmpCompletions = completions
}
//设置缺省的service提示
export function setDefaultServiceCompletions(arr = []) {
    const completions = []
    for (let item of arr) {
        let completion = {
            name: item.serviceName,
            value: `$api.${item.serviceName}().then(res => {})`,
            meta: '接口',
            score: 3
        }
        completions.push(completion)
    }
    defaultCompletions.serviceCompletions = completions
}
//设计缺省 ref 提示
export function setDefaultRefCompletions(arr = []) {
    const completions = []
    for (let item of arr) {
        let refName = item.initCodeName
        completions.push(
            { name: refName, value: '$ref.' + refName, score: 1, meta: "值：" + item.initCodeValue },
        )
    }
    defaultCompletions.refCompletions = completions
}
//设置缺省的变量设置提示
export function setDefaultVarCompletions(arr = []) {
    const varCompletions = [], varSetCompletions = []
    for (let item of arr) {
        let completionVar = {
            value: `$var.${item.initCodeName}`,
            score: 9,
            type: 'var',
            meta: '页面变量,' + (item.initCodeValue || '')
        }
        let completionSet = {
            value: `$set('${item.initCodeName}', )`,
            score: 7,
            type: 'setVar',
            meta: '更新数据'
        }
        varCompletions.push(completionVar)
        varSetCompletions.push(completionSet)
    }
    defaultCompletions.varCompletions = varCompletions
    defaultCompletions.varSetCompletions = varSetCompletions
}
//设置函数调用提示
export function setDefaultFunctionCompletions(arr = []) {
    const completions = []
    for (let item of arr) {
        let completion = {
            value: `$fn.${item.initCodeName}()`,
            meta: '函数',
            score: 8
        }
        completions.push(completion)
    }

    defaultCompletions.functionCompletions = completions
}
//设置函由跳转的提示,TODO  还没有用 啊啊啊啊啊
export function setDefaultRouterCompletions(arr = []) {
    const completions = [historyGoBack]
    for (let item of arr) {
        //push
        let pushCompletion = {
            caption: `$history.push('${item.pageRouter}')`,
            value: `$history.push('${item.pageRouter}')`,
            meta: '跳到' + item.pageName,
            score: 0
        }
        //replace
        let repalceCompletion = {
            caption: `$history.replace('${item.pageRouter}')`,
            value: `$history.replace('${item.pageRouter}')`,
            meta: '替换到' + item.pageName,
            score: 0
        }

        completions.push(pushCompletion, repalceCompletion)
    }
    defaultCompletions.routerCompletions = completions
}
//设置全局数据提示, 从常量字符串中取
export function setGlobalDataCompletions(arr = [], useHistoryState = true) {
    const completions = []
    if (useHistoryState) {
        completions.push(
            //路由上数据也是全局数据的一种
            historyState
        )
    }

    for (let item of arr) {
        let completion = {
            caption: `$global.${item}`,
            value: `$global.${item}`,
            meta: '全局常量',
            score: 6
        }
        completions.push(completion)
    }
    defaultCompletions.globalDataCompletions = completions
}
/**
 * 添加自定义rule提示,所以每次都不会覆盖
 * @param {[string]} arr 
 */
export function appendRuleCompletions(arr = []) {
    defaultCompletions.ruleCompletions = [
        ...ruleCompletions,
        ...arr?.map(r => {
            return { caption: 'tip:' + r, value: r, score: 99, meta: '来自全局自定义' }
        })
    ]
}
/**
 * 代码编辑器
 * @param {*} param0 
 * @param {[{ caption: string, value: string, score: number, meta: string }]} completions
 * @param {*} isSet ， 是否覆盖原有的提示
 * @returns 
 */
const codeRender = ({ value, $base: { onChange, disabled, onEvent, placeholder: ph } }, completions, asycCompletions, isSet, placeholder, mode) => {
    let tempompletions = completions
    if (defaultCompletions.globalTmpCompletions?.length) {
        if (completions != null) {
            tempompletions = [...completions, ...defaultCompletions.globalTmpCompletions]
        } else {
            tempompletions = [...defaultCompletions.globalTmpCompletions]
        }
    }

    return <div className={styles.renderCode}>
        <CodeEditor
            mode={mode}
            isSet={isSet}
            value={value}
            completions={tempompletions}
            placeholder={ph || placeholder}
            asycCompletions={asycCompletions}
            onChange={onChange}
        />
        {!disabled && <ExpandOutlined
            title='放大'
            className={styles.expend}
            onClick={_ => {
                onEvent('dbclick', { value, completions: tempompletions, asycCompletions, placeholder, isSet, mode })
            }}
        />}
        {disabled && <Tooltip title="设置 字段名/变量名/数据 后有效">
            <div className={styles.disabled} />
        </Tooltip>
        }
    </div>
}
//验证，校验
export const codeRender_rule = (params) => {
    const completions = [
        ...defaultCompletions.ruleCompletions,

    ]
    const asycCompletions = [
        {
            targetName: `({data,value})=>{`,
            completions: [
                ...utilCompletions,
                ...defaultCompletions.serviceCompletions,
                ...getComponentDataCompletions('data', 'rule')
            ]
        }
    ]

    return codeRender(params, completions, asycCompletions, true)
}
//JSON数据啦
export const codeRender_data = (params) => {
    const completions = [
        ...defaultCompletions.globalDataCompletions,
        ...sysCompletions
    ]
    return codeRender(params, completions, null, true, null, 'json')
}
//shouldUpdate
export const codeRender_shouldUpdate = (params) => {
    const completions = [
        ...getComponentDataCompletions('pre', 'pre'),
        ...getComponentDataCompletions('cur', 'cur'),
        ...defaultCompletions.globalDataCompletions,
        ...sysCompletions,
        ...defaultCompletions.varCompletions,
        ...defaultCompletions.refCompletions
    ]
    return codeRender(params, completions)
}
export const codeRender_default_function = (params) => {
    const completions = [
        ...getComponentDataCompletions('data', 'load'),
        ...utilCompletions,
        ...defaultCompletions.globalDataCompletions,
        ...sysCompletions,
        ...defaultCompletions.varCompletions,
        ...defaultCompletions.refCompletions
    ]
    return codeRender(params, completions)
}
//是否加载
export const codeRender_load = codeRender_default_function
//失效(disabled)
export const codeRender_disabled = codeRender_default_function
//过滤器(filter)
export const codeRender_filter = codeRender_default_function
//提交事件
export const codeRender_submit = (params) => {
    const [dialogCompletions, dialogAsyncCompletions] = getDialogCompletions()
    const [drawerCompletions, drawerAsyncCompletions] = getDrawerCompletions()
    const completions = [
        ...getComponentDataCompletions('data', 'submit'),
        ...dialogCompletions,
        ...drawerCompletions,
        ...defaultCompletions.varCompletions,
        ...defaultCompletions.varSetCompletions,
        ...defaultCompletions.refCompletions,
        ...defaultCompletions.serviceCompletions,
        ...defaultCompletions.functionCompletions,
        ...defaultCompletions.globalDataCompletions,
        ...sysCompletions,
        ...defaultCompletions.routerCompletions,
        ...getRefCompletions(),
        ...modalCompletions,
        ...utilCompletions
    ]
    return codeRender(params, completions, [...dialogAsyncCompletions, ...modalAsyncCompletions, ...drawerAsyncCompletions])
}
//事件
export const codeRender_event = (params) => {
    const [dialogCompletions, dialogAsyncCompletions] = getDialogCompletions()
    const [drawerCompletions, drawerAsyncCompletions] = getDrawerCompletions()
    const completions = [
        ...getParamsCompletions(),
        ...dialogCompletions,
        ...drawerCompletions,
        ...defaultCompletions.varCompletions,
        ...defaultCompletions.varSetCompletions,
        ...defaultCompletions.refCompletions,
        ...defaultCompletions.serviceCompletions,
        ...defaultCompletions.functionCompletions,
        ...defaultCompletions.globalDataCompletions,
        ...sysCompletions,
        ...defaultCompletions.routerCompletions,
        ...getRefCompletions(),
        ...modalCompletions,
        ...utilCompletions
    ]
    return codeRender(params, completions, [...dialogAsyncCompletions, ...modalAsyncCompletions, ...drawerAsyncCompletions])
}
//table的disabled
export const codeRender_table_disabled = (params) => {
    return codeRender(params, getComponentDataCompletions('row', 'disabled'))
}
//上传的action
export const codeRender_onSuccess = (params) => {
    return codeRender(params, [])
}
//普通事件
export const codeRender_defalutEvent = (params) => {
    const [dialogCompletions, dialogAsyncCompletions] = getDialogCompletions()
    const [drawerCompletions, drawerAsyncCompletions] = getDrawerCompletions()
    const completions = [
        ...dialogCompletions,
        ...drawerCompletions,
        ...defaultCompletions.varCompletions,
        ...defaultCompletions.varSetCompletions,
        ...defaultCompletions.refCompletions,
        ...defaultCompletions.serviceCompletions,
        ...defaultCompletions.functionCompletions,
        ...defaultCompletions.globalDataCompletions,
        ...sysCompletions,
        ...defaultCompletions.routerCompletions,
        ...getRefCompletions(),
        ...modalCompletions,
        ...utilCompletions
    ]
    return codeRender(params, completions, [...dialogAsyncCompletions, ...modalAsyncCompletions, ...drawerAsyncCompletions])
}
//分页，表格的
export const codeRender_pagination = (params) => {
    const completions = [
        { caption: 'tip:total', value: 'total', score: 1, meta: '总页数' },
        { caption: 'tip:pageSize', value: 'pageSize', score: 1, meta: '每页条数' },
        { caption: 'tip:pageSizeOptions', value: 'pageSizeOptions', score: 1, meta: '每页可以显示多少条，[10,20]' },
        { caption: 'tip:showTitle', value: 'showTitle', score: 1, meta: '原生 tooltip 页码提示' },
        { caption: 'tip:size', value: 'number', size: 1, meta: '尺寸 small' },
        { caption: 'tip:disabled', value: 'disabled', score: 1, meta: '禁用分页' },
        { caption: 'tip:defaultCurrent', value: 'current', score: 1, meta: '当前页' },
        ...defaultCompletions.globalDataCompletions,
        ...sysCompletions,
        ...defaultCompletions.varCompletions,
        ...defaultCompletions.refCompletions,
    ]
    return codeRender(params, completions, null, true, "可以输入变量或配置", 'json')
}
//表格分页事件
export const codeRender_event_pagination = (params) => {
    const completions = [
        ...getParamsCompletions(paramsKeys.pagination),
        ...getRefCompletions(),
        ...defaultCompletions.varCompletions,
        ...defaultCompletions.varSetCompletions,
        ...defaultCompletions.refCompletions,
        ...defaultCompletions.serviceCompletions,
        ...defaultCompletions.functionCompletions,
        ...defaultCompletions.globalDataCompletions,
        ...sysCompletions,
        ...defaultCompletions.routerCompletions,
        ...modalCompletions,
        ...utilCompletions
    ]
    return codeRender(params, completions)
}
//表格排序事件
export const codeRender_sorter_event = (params) => {
    const completions = [
        ...getParamsCompletions(paramsKeys.sorter),
        ...getRefCompletions(),
        ...defaultCompletions.varCompletions,
        ...defaultCompletions.varSetCompletions,
        ...defaultCompletions.refCompletions,
        ...defaultCompletions.serviceCompletions,
        ...defaultCompletions.functionCompletions,
        ...defaultCompletions.globalDataCompletions,
        ...sysCompletions,
        ...defaultCompletions.routerCompletions,
        ...modalCompletions,
        ...utilCompletions
    ]
    return codeRender(params, completions)
}
//表格的排序
export const codeRender_table_sorter = (params) => {
    const completions = [
        ...getComponentDataCompletions('a', 'a'),
        ...getComponentDataCompletions('b', 'b'),
        ...defaultCompletions.varCompletions,
        ...defaultCompletions.refCompletions
    ]
    return codeRender(params, completions)
}
//表格选择事件
export const codeRender_event_selection = (params) => {
    const completions = [
        ...getParamsCompletions(paramsKeys.selection),
        ...getRefCompletions(),
        ...defaultCompletions.varCompletions,
        ...defaultCompletions.varSetCompletions,
        ...defaultCompletions.refCompletions,
        ...defaultCompletions.serviceCompletions,
        ...defaultCompletions.functionCompletions,
        ...defaultCompletions.globalDataCompletions,
        ...defaultCompletions.routerCompletions,
        ...modalCompletions,
        ...utilCompletions
    ]
    return codeRender(params, completions)
}
//options选项
export const codeRender_options = (params) => {
    const completions = [
        ...defaultCompletions.globalDataCompletions,
        ...sysCompletions
    ]
    const asycCompletions = [
        {
            targetName: `)=>{`,
            completions: [
                ...defaultCompletions.serviceCompletions,
                ...getComponentDataCompletions('data', 'options')
            ]
        },
        {
            targetName: '(preData,currentData)',
            completions: [
                ...getComponentDataCompletions('preData', 'options'),
                ...getComponentDataCompletions('currentData', 'options')
            ]
        }
    ]
    return codeRender(params, completions, asycCompletions, true)
}
//steps 中的options
export const codeRender_step_options = (params) => {
    const completions = [
        { caption: 'tip:description', value: `description`, score: 1, meta: '步骤的详情描述，可选' },
        { caption: 'tip:disabled', value: `disabled`, score: 1, meta: '禁用点击' },
        { caption: 'tip:icon', value: `icon`, score: 1, meta: 'icon' },
        { caption: 'tip:status', value: `status`, score: 1, meta: 'wait/process/finish/error' },
        { caption: 'tip:subTitle', value: `subTitle`, score: 1, meta: '子标题' },
        ...defaultCompletions.globalDataCompletions,
        ...sysCompletions
    ]
    return codeRender(params, completions, null, true)
}
//样式的，可能要去掉，不全
export const codeRender_style = (params) => {
    const completions = [
        { caption: 'tip:height', value: 'height: ,', score: 1, meta: '高度' },
        { caption: 'tip:width', value: 'width: ,', score: 1, meta: '宽度' },
        { caption: 'tip:fontSize', value: 'fontSize: ,', score: 1, meta: '字号' },
        { caption: 'tip:fontFamily', value: 'fontFamily: "",', score: 1, meta: '字体' },
        { caption: 'tip:fontWeight', value: 'fontWeight: ,', score: 1, meta: '字号' },
        { caption: 'tip:bold', value: 'bold\n', score: 1, meta: '字号-加粗' },
        { caption: 'tip:border', value: 'border: "",', score: 1, meta: '边框' },
        { caption: 'tip:borderRadius', value: 'borderRadius: ,', score: 1, meta: '圆角' },
        { caption: 'tip:diplay', value: 'diplay: "",', score: 1, meta: '布局' },
        { caption: 'tip:justifyContent', value: 'justifyContent: "",', score: 1, meta: '横向对齐' },
        { caption: 'tip:alignItems', value: 'alignItems: "",', score: 1, meta: '竖向对齐' },
        { caption: 'tip:flex-start', value: 'flex-start\n', score: 1, meta: 'start' },
        { caption: 'tip:center', value: 'center\n', score: 1, meta: '居中' },
        { caption: 'tip:flex-end', value: 'flex-end\n', score: 1, meta: 'end' },
        { caption: 'tip:solid', value: 'solid ', score: 1, meta: '实线' },
        { caption: 'tip:dotted', value: 'dotted ', score: 1, meta: '虚线' },
        { caption: 'tip:margin', value: 'margin: "",', score: 1, meta: '外边距' },
        { caption: 'tip:opcatiy', value: 'opcatiy: ', score: 1, meta: '透明度' },
        { caption: 'tip:color', value: 'color: "",', score: 1, meta: '顔色' }
    ]
    return codeRender(params, completions, null, true)
}

export const codeRender_less = (params) => {
    return codeRender(params, null, null, null, '请输入less', 'less')
}
