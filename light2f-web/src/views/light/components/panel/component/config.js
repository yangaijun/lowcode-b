
import {
    dataLabel,
    lessLabel,
    layoutLabel,
    arrDataLabel,
    loadLabel,
    filterLabel,
    changeLabel,
    clickLabel,
    submitLabel,
    ruleLabel,
    styleLabel,
    componentLabel,
    selectionLabel,
    dialogLabel,
    elementLabel,
    containerLabel,
    cancelLabel,
    confirmLabel,
    disabledLabel,
    getFormItemLabel,
    dialogNameLabel,
    pageLabel,
    paginationDocLabel,
    propLabel,
    dataNameLabel,
    eventNameLabel,
    formUseTipLabel,
    searchUseTipLabel,
    regionUseTipLabel,
    formListTipLabel,
    tableUseTipLabel,
    listUseTipLabel,
    dialogUseTipLabel,
    fdialogUseTipLabel,
    drawerUseTipLabel,
    divUseTipLabel,
    tabsUseTipLabel,
    searchLabel,
    refLabel,
    typeLabel,
    uploadFilterLabel,
    uploadActionLabel,
    uploadOnSuccessLabel,
    shouldUpdateLabel,
    selectionDisabledLabel,
    tableSortLabel,
    tableSortEventLabel,
    componentChangeLabel,
    stepOptionsLabel,
    optionsLabel,
    treeOptionsLabel,
    tableOnCellLabel
} from './doc'
import {
    codeRender_rule,
    codeRender_data,
    codeRender_load,
    codeRender_disabled,
    codeRender_default_function,
    codeRender_filter,
    codeRender_submit,
    codeRender_pagination,
    codeRender_onSuccess,
    codeRender_event_pagination,
    codeRender_event_selection,
    codeRender_options,
    codeRender_step_options,
    codeRender_event,
    codeRender_defalutEvent,
    codeRender_style,
    codeRender_less,
    defaultCompletions,
    codeRender_shouldUpdate,
    codeRender_table_disabled,
    codeRender_table_sorter,
    codeRender_sorter_event
} from './renders'
import { Divider } from 'antd'
import { Region } from 'freedomen'
import { getSpace } from 'views/light/utils/util'
import { ComponentType, PropType, UsedType } from 'views/light/types'
import { iconOptions } from './icons'
import Bus, { BUS_KEYS } from 'views/light/bus'
import { valueTypes } from 'views/light/config'

const colLayout = () => {
    return <Region
        columns={[
            [
                [
                    { type: 'text', value: 'span:' },
                    span,
                    { type: 'text', value: 'offset:' },
                    { type: 'inputnumber@w60', prop: 'offset', config: { max: 24, min: 1, size: 'small' } },
                    { type: 'space' }
                ],
                { type: 'input', prop: 'flex', placeholder: '固定宽度(flex)，如1、100px', config: { size: 'small' } },
                { type: 'space-vertical' }
            ]
        ]}
    />
}
const ref = {
    prop: 'ref',
    type: 'input',
    label: refLabel,
    placeholder: '输入form的ref名称，如：form、region'
}
const modelRef = {
    ...ref, config: { help: '对应form表单的ref' }
}
const noForm = {
    prop: 'noForm',
    type: 'switch',
    label: '内不含表单',
    config: {
        help: '关闭会关联Form校验，确定变表单提交'
    }
}
const radiosButtons = {
    type: 'radios-button',
    config: { buttonStyle: 'solid', size: 'small' }
}

let preUUID = null, autoOptions = null
function getAutoOptions() {
    const uuid = Bus.get(BUS_KEYS.activeUUID)
    if (preUUID === uuid) {
        return autoOptions
    }

    preUUID = uuid

    const propSet = new Set(), labelSet = new Set()
    propSet.add("$submit").add("$reset").add('$push').add('$delete')

    const findData = (list = []) => {
        for (let item of list) {
            if (item.data) {
                if (item.data.prop) {
                    propSet.add(item.data.prop)
                }
                if (item.data.label) {
                    labelSet.add(item.data.label)
                }
            }
            if (item.children?.length) {
                findData(item.children)

            }
        }
    }
    findData(Bus.get(BUS_KEYS.designDataList))

    autoOptions = { props: Array.from(propSet), labels: Array.from(labelSet) }
    return autoOptions
}
const getAutoVarInput = (prop, label, dps = []) => {
    return {
        prop: prop,
        type: 'autocomplete',
        label: label,
        placeholder: '输入或选择变量',
        options({ resolve }) {
            const varNames = defaultCompletions
                .varCompletions
                .filter(el => el.type === 'var')
                .map(el => el.value)
                .concat(dps)

            resolve(varNames.length ? varNames.toString() : null)
        }
    }
}

const loading = getAutoVarInput('config.loading', 'loading')

const tabKey = getAutoVarInput('activeKey', '面板的key', ['$history.state.'])

const pagination = [
    {
        prop: 'pagination',
        label: paginationDocLabel,
        render: codeRender_pagination
    },
    {
        type: 'formitem',
        label: paginationDocLabel,
        load: ({ data }) => data['isPagination'] !== false,
        config: { help: '可以使用$var.使用变量' }
    }
]
function getBaseData(isArr = false) {
    return {
        prop: 'data',
        label: isArr ? arrDataLabel : dataLabel,
        render: codeRender_data,
        placeholder: isArr ? '请输入数组如：[{name: "abc", ...}]' : '请输入对象如：{key: "value", age: 14}'
    }
}
const data = getBaseData()
const arrayData = getBaseData(true)

const prop = {
    prop: 'prop',
    label: propLabel,
    type: 'autocomplete',
    placeholder: '数据收集时字段名，如:user、u.name',
    options({ value = "", resolve }) {
        const options = getAutoOptions().props
            .filter(el => el.includes(value))
            .map(el => ({ label: el, value: el }))
        resolve(options)
    },
    config: {
        help: '若为空，会影响数据收集、事件等'
    }
}
const load = {
    prop: 'load',
    label: loadLabel,
    render: codeRender_load,
    value: `({ value, data }) => {\n${getSpace()}return true\n}`
}
const value = {
    prop: 'value',
    label: 'value',
    type: 'input',
    placeholder: '缺省值'
}
const valueTags = {
    prop: 'value',
    label: '数组值（value）',
    render: codeRender_data,
    placeholder: '数组，如:["1","2"]',
    config: {
        help: '字符串数组：["选项一", "选项二"]'
    }
}
const valueDateRange = {
    prop: 'value',
    label: '数组值（value）',
    render: codeRender_data,
    placeholder: '数组，如:[new Date(),"2012-12-15"]',
    config: {
        help: '如日期数组：[new Date(), undefined]'
    }
}
const title = {
    prop: 'value',
    label: 'title(value)',
    type: 'input',
    placeholder: '输入title'
}
const numberValue = {
    prop: 'value',
    label: 'value',
    type: 'inputnumber',
    placeholder: '缺省值'
}
const placeholder = {
    type: 'input',
    prop: 'placeholder',
    label: 'placeholder',
    placeholder: '占位符'
}
const filter = {
    prop: 'filter',
    label: filterLabel,
    render: codeRender_filter,
    value: `({ value, data }) => {\n${getSpace()}return value\n}`
}
const onChange = {
    prop: '@change',
    label: changeLabel,
    render: codeRender_event,
    value: `(params) => {\n${getSpace()}\n}`,
    disabled: isDisabled
}
const compOnChange = {
    prop: 'onChange',
    label: componentChangeLabel,
    render: codeRender_event,
    value: `(data) => {\n${getSpace()}//$set('thisName', data)\n}`,
    load({ data }) {
        return data.dataName || data.data
    }
}
const disabled = {
    prop: 'disabled',
    label: disabledLabel,
    render: codeRender_disabled,
    value: `({ value, data }) => {\n${getSpace()}\n}`
}
const icon = {
    prop: 'config.icon',
    label: '图标',
    type: 'select',
    placeholder: '可以选择icon',
    options: iconOptions,
    config: { filterable: true }
}
const bordered = {
    prop: 'config.bordered',
    label: 'bordered(边框)',
    type: 'switch',
    value: true
}
const allowClear = {
    prop: 'config.allowClear',
    label: 'allowClear(点击清除图标清除数据)',
    type: 'switch'
}

function isDisabled({ data }) {
    return data.prop === '' || data.prop === undefined
}
const onClick = {
    prop: '@click',
    label: clickLabel,
    render: codeRender_event,
    value: `(params) => {\n${getSpace()}\n}`,
    disabled: isDisabled
}
const options = {
    prop: 'options',
    label: optionsLabel,
    render: codeRender_options,
    config: { help: "特殊字符符串加引号: \"1,2,+3\", \"+,-,%\"" }
}
const treeOptions = {
    prop: 'options',
    label: treeOptionsLabel,
    render: codeRender_options
}
const modalWidth = {
    type: 'input',
    label: '宽度',
    prop: 'width',
    value: 520,
    config: { min: 0, step: 10 }
}
const tableColumnwidth = {
    type: 'input',
    label: '宽度',
    prop: 'width',
    config: { min: 0, step: 10 }
}
const autoFocus = {
    prop: 'config.autoFocus',
    label: 'autoFocus',
    type: 'switch',
    config: { help: '自动获取焦点' }
}
const filterable = {
    prop: 'config.filterable',
    label: '是否可打字搜索',
    type: 'switch'
}
const readOnly = {
    prop: 'config.readOnly',
    label: '是否只读(readOnly)',
    type: 'switch'
}
const optionvalue = {
    prop: 'config.optionvalue',
    label: 'optionvalue',
    type: 'switch',
    config: { help: '打开选择的值为option对象，而非value' }
}
const labelname = {
    prop: 'config.labelname',
    label: 'labelname',
    type: 'input',
    placeholder: 'defalut label',
    config: { help: 'option的显示标签变量名' }
}
const valuename = {
    prop: 'config.valuename',
    label: 'valuename',
    type: 'input',
    placeholder: 'defalut value',
    config: { help: 'option的值变量名' }
}
const childrenname = {
    prop: 'config.childrenname',
    label: 'childrenname',
    type: 'input',
    placeholder: 'defalut children',
    config: { help: 'option中children的值变量名' }
}
const treeFieldNames = [
    valuename, labelname, childrenname
]
const label = {
    prop: 'label',
    label: 'label',
    type: 'autocomplete',
    placeholder: '标签名',
    options({ value = "", resolve }) {
        const labels = getAutoOptions().labels
            .filter(el => el.includes(value))
            .map(el => ({ label: el, value: el }))
        resolve(labels)
    },
}
const submit = {
    prop: 'submit',
    label: submitLabel,
    render: codeRender_submit,
    load: ({ data }) => !data.noForm,
    value: `(data) => {\n${getSpace()}\n}`
}
const rule = {
    prop: 'rule',
    label: ruleLabel,
    render: codeRender_rule,
    disabled: isDisabled
}
const size = {
    prop: 'config.size',
    label: 'size(组件的尺寸)',
    options: "small,middle,large",
    ...radiosButtons
}
const span = {
    prop: 'span',
    label: 'span(占列数)',
    type: 'inputnumber@w60',
    config: { max: 24, min: 1, size: 'small' }
}
const wrapperCol = {
    prop: 'config.wrapperCol',
    label: 'wrapperCol(控件布局样式)',
    render: colLayout,
    config: {
        help: '列布局和固定宽使用互斥'
    }
}
const labelCol = {
    prop: 'config.labelCol',
    label: 'labelCol(标签布局)',
    render: colLayout,
    config: {
        help: '列布局和固定宽使用互斥'
    }
}
const tooltip = {
    prop: 'config.tooltip',
    label: 'tooltip(label后加问号提示)',
    type: 'input',
    placeholder: '提示'
}
const formConfigs = [
    {
        prop: 'config.help',
        label: 'help文字',
        type: 'input',
        placeholder: '组件下面的灰色提示文字'
    },
    {
        prop: 'config.extra',
        label: 'extra文字',
        type: 'input',
        placeholder: '提示文字,会与验证信息同时存在'
    },
]
const min = {
    prop: 'config.min',
    label: '最小值',
    type: 'inputnumber',
    config: {
        help: '允许输入的最小值'
    }
}

const max = {
    prop: 'config.max',
    label: '最大值',
    type: 'inputnumber',
    config: {
        help: '允许输入的最大值'
    }
}
const verticalVisible = {
    prop: '~isVertical',
    type: 'switch',
    label: '布局(行/列, 仅设计时)',
    config: { help: '仅用于设计时，排版易看，非组件属性', size: 'small', checkedChildren: '行布局', unCheckedChildren: '列布局' },
    class: 'design-config'
}
const dataName = {
    prop: 'dataName',
    label: dataNameLabel,
    type: 'input',
    placeholder: 'state中定义名，可缺省'
}
const eventName = {
    prop: 'eventName',
    label: eventNameLabel,
    type: 'input',
    placeholder: '对应事件的函数名称'
}
const align = {
    prop: 'config.align',
    label: '对齐方式',
    ...radiosButtons,
    options: { "left": '左对齐', "center": "居中对齐", "right": '右对齐' }
}
export const formMore = [
    verticalVisible,
    {
        prop: 'config.colon',
        label: 'colon(显示 label 后面的冒号)',
        type: 'switch',
        value: true
    }, {
        prop: 'config.labelAlign',
        label: 'labelAlign(label对齐方式)',
        options: "left,right",
        value: 'right',
        ...radiosButtons
    },
    size,
    { ...labelCol, value: { span: 4 } },
    { type: 'switch', prop: 'config.labelWrap', label: 'label 超长自动换行(labelWrap)' },
    wrapperCol,
    {
        prop: 'config.layout',
        label: 'layout(表单布局)',
        options: "horizontal,vertical,inline",
        value: 'horizontal',
        ...radiosButtons
    }
]
const modalBase = [
    submit,
    {
        prop: 'onOk',
        label: '@ok(确定按钮事件)',
        render: codeRender_defalutEvent,
        value: `() => {\n${getSpace()}\n}`,
        load: ({ data }) => data.noForm,
        config: { help: 'return false可以阻止关闭' }
    }, {
        prop: 'onCancel',
        label: '@cancel(取消按钮事件)',
        render: codeRender_defalutEvent,
        value: `() => {\n${getSpace()}\n}`,
        config: { help: 'return false可以阻止关闭' }
    }
]
const dialogBase = [{
    prop: 'name',
    label: dialogNameLabel,
    type: 'input',
    placeholder: '操作其的必要属性，如 dialog',
    config: {
        help: '必要属性',
        required: true
    }
}, {
    prop: 'title',
    label: 'title',
    type: 'input',
    placeholder: '标题',
},
...modalBase
]
const dialogMore = [
    modalWidth,
    {
        prop: 'footer',
        label: '使用footer',
        type: 'switch',
        value: '',
        config: {
            uncheckedValue: 'null',
            checkedValue: '',
            help: '是否有下面的确定和取消按钮'
        }
    }, {
        prop: 'okText',
        label: 'okText',
        type: 'input',
        placeholder: '确定按钮文本,default 确定',
    }, {
        prop: 'cancelText',
        label: 'cancelText',
        type: 'input',
        placeholder: '取消按钮文本,default 取消',
    }
]
const drawerBase = [{
    prop: 'name',
    type: 'input',
    label: dialogNameLabel,
    placeholder: '操作其的必要属性, 如 drawer',
    rule: 'must'
}, {
    prop: 'title',
    label: 'title',
    type: 'input',
    placeholder: '标题',
},
{
    prop: 'placement',
    label: '弹出位置',
    value: 'right',
    options: 'top,right,bottom,left',
    ...radiosButtons
},
...modalBase
]
const drawerMore = [
    modalWidth,
    {
        prop: 'okText',
        label: 'okText',
        type: 'input',
        placeholder: '确定按钮文本,default 确定',
    }, {
        prop: 'cancelText',
        label: 'cancelText',
        type: 'input',
        placeholder: '取消按钮文本,default 取消',
    }
]
const sets = {
    set_val: {
        tip: '设置某prop值',
        full: 'set("", newValue)'
    },
    set_fn: {
        tip: '设置某prop值',
        full: 'set("", (current) => {\n        return current \n    })'
    },
    set_del: {
        tip: '删除行',
        full: 'set("", (current) => {\n        current.splice(params.row.$index, 1)\n        return current \n    })'
    },
    set_push: {
        tip: '添加行',
        full: 'set("", (current = []) => {\n        current.push({})\n        return current \n    })'
    }
}
const gets = {
    get_var: {
        tip: '获取某prop值',
        full: 'get("")'
    },
    get_all: {
        tip: '获取所有值',
        full: 'get()'
    }
}
const regionCodeRule = {
    value: {
        dataName: {
            type: valueTypes.unString
        },
        eventName: {
            type: valueTypes.unString
        },
        ref: {
            type: valueTypes.ref,
            functions: {
                ...sets,
                ...gets
            }
        }
    }
}
const formCodeRule = {
    value: {
        ...regionCodeRule.value,
        submit: {
            type: valueTypes.fun
        },
        ref: {
            type: valueTypes.ref,
            functions: {
                submit: {
                    tip: '提交',
                    full: 'submit()'
                },
                reset: {
                    tip: '重置表单',
                    full: 'reset()'
                },
                ...sets,
                ...gets
            }
        }
    }
}
const searchCodeRule = formCodeRule
const formListCodeRule = formCodeRule
const tableCodeRule = regionCodeRule
const listCodeRule = regionCodeRule

const dialogCodeRule = {
    name: {
        type: valueTypes.string
    },
    title: {
        type: valueTypes.string
    },
    okText: {
        type: valueTypes.string
    },
    cancelText: {
        type: valueTypes.string
    }
}
const fdialogCodeRule = {
    ...formCodeRule,
    ...dialogCodeRule
}
const drawerCodeRule = dialogCodeRule
const fdrawerCodeRule = fdialogCodeRule

//Form 中建议放：组件，元素，formitem，row =======================================================================================================
const formConfigProps = ["config.labelCol", "config.wrapperCol", "config.help", "config.extra"]
//这些容器也有 prop
const hasPropContainers = ['formitem', 'popconfirm', 'spin', 'card', 'tooltip']

const tableConfigProps = ['config.fixed', 'config.align', 'config.ellipsis', 'config.onCell', 'config.sorter', '@sorter']

function containerInheritableRules({ type, parentTypes }) {
    const notProps = [], exAbledProps = ["prop", "load"]

    if (!hasPropContainers.includes(type)) {
        notProps.push("prop")
    }

    if (parentTypes[parentTypes.length - 1] === 'row' && type === 'col') {
        notProps.push("span")
    }

    if (parentTypes[0] === 'Table' && type === 'tablecolgroup') {
        exAbledProps.push('label', 'width', ...tableConfigProps)
        notProps.push('width', ...tableConfigProps)
    }

    if (parentTypes?.some(pt => ['Form', 'FDialog', 'FDrawer'].includes(pt))) {
        if (['formitem'].includes(type) || parentTypes.includes('formitem')) {
            exAbledProps.push('rule')
            notProps.push("rule")
        } else if (['row', 'fragment'].includes(type)) {
            notProps.push("rule", "label", ...formConfigProps)
            exAbledProps.push('label', 'rule', ...formConfigProps)
        } else {
            notProps.push("rule", ...formConfigProps)

            if (parentTypes[parentTypes.length - 1] !== 'Table') {
                notProps.push("label")
            }
        }
    }

    return {
        notProps,
        exAbledProps
    }
}
//return { notProps: [], exAbledProps: [] }
function componentInheritableRules(_, { type: pType }) {
    const notProps = [], exAbledProps = []
    //&& parent.type 是容器类，现在容器类没有这两属性，所以先不写了
    if (!['DIV', 'Dialog', 'Drawer'].includes(pType))
        notProps.push('dataName', 'data', 'eventName')

    return {
        notProps,
        exAbledProps
    }
}

const cStyles = [
    {
        prop: 'className',
        label: 'className',
        type: 'input',
        placeholder: 'className, default prop/type',
        config: {
            help: '暂不支持多className'
        }
    }, {
        prop: '~less',
        label: lessLabel,
        render: codeRender_less,
        config: {
            help: '有less时使用局部样式, 否使全局的class'
        }
    }
]

const color = {
    render: codeRender_default_function,
    label: '颜色',
    prop: 'config.color',
    value: `({ value, data }) => {\n${getSpace()}return ""\n}`,
    config: { help: `fn:string/string 如：success、red、#ccc` }
}

const style = [
    ...cStyles,
    {
        label: styleLabel,
        prop: 'style',
        render: codeRender_style,
        value: `({ value, data }) => {\n${getSpace()}return {\n\n${getSpace()}}\n}`,
        config: { help: `处理动态数据，常态建议使用less` }
    }
]
const layoutCanPutGroup = ['layout', 'component', 'dialog']
const componentCanPutGroup = ['element', 'container', 'component']
const dialogCanPutGroup = ['layout', 'component']

const getDocLink = (name) => {
    return `/doc/freedomen/${name}`
}

const datas = [
    {
        title: elementLabel,
        group: 'element',
        children: [
            {
                title: 'Input',
                type: 'input',
                tooltip: '输入文本/区域/密码/查询',
                docLink: getDocLink('input'),
                data: {},
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            value: 'input',
                            label: typeLabel,
                            type: 'select',
                            options: "input,input@w200,input-area,input-password,input-password@w200,input-search"
                        },
                        value, placeholder,
                        {
                            prop: 'config.rows',
                            type: 'inputnumber',
                            label: 'rows(多少行)',
                            load: ({ data }) => data.type === 'input-area'
                        },
                        {
                            prop: '@search',
                            label: searchLabel,
                            render: codeRender_event,
                            value: `(params) => {\n${getSpace()}\n}`,
                            disabled: isDisabled,
                            load: ({ data }) => data.type === 'input-search'
                        },
                        onChange
                    ],
                    more: [
                        allowClear,
                        readOnly,
                        {
                            prop: 'config.changeEventType',
                            label: '触发change方式',
                            value: 'input',
                            options: 'input,blur',
                            ...radiosButtons
                        },
                        {
                            prop: 'config.submitEventType',
                            label: '确定键触发提交',
                            type: 'switch',
                            config: {
                                checkedValue: 'pressEnter',
                                uncheckedValue: ''
                            }
                        },
                        {
                            prop: 'config.addonBefore',
                            label: '前置标签文案',
                            type: 'input',
                            load: ({ data }) => !data.type || data.type === 'input' || data.type === 'input@w200'
                        },
                        {
                            prop: 'config.addonAfter',
                            label: '后置标签文案',
                            type: 'input',
                            load: ({ data }) => !data.type || data.type === 'input' || data.type === 'input@w200'
                        },
                        {
                            prop: 'config.maxLength',
                            label: 'maxLength(最多输入个数)',
                            type: 'inputnumber'
                        }, {
                            prop: 'config.showCount',
                            label: 'showCount(展示字数)',
                            type: 'switch',
                            load: ({ data }) => data.type === 'input-area'
                        },
                        size,
                        autoFocus,
                        bordered,
                        disabled
                    ],
                    style
                }
            }, {
                title: 'Select',
                type: 'select',
                tooltip: '单/多选下拉',
                docLink: getDocLink('select'),
                data: { options: '选项一,选项二' },
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            value: 'select',
                            type: 'select',
                            options: "select,select@w200,select-multiple,select-multiple@w200"
                        },
                        value, placeholder, onChange, options
                    ],
                    more: [
                        allowClear,
                        {
                            prop: 'config.defaultOpen',
                            label: '默认展开下拉菜单',
                            type: 'switch'
                        },
                        {
                            prop: 'config.maxcount',
                            label: '最多选择的数量',
                            type: 'inputnumber',
                            load: ({ data }) => data.type?.includes('select-multiple')
                        },
                        size,
                        filterable,
                        labelname,
                        valuename,
                        optionvalue,
                        bordered,
                        disabled
                    ],
                    style
                }
            }, {
                title: 'Segmented',
                type: 'segmented',
                tooltip: '分段控制器',
                docLink: getDocLink('segmented'),
                data: { options: '选项一,选项二' },
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            value: 'segmented',
                            type: 'select',
                            options: "segmented"
                        },
                        value, placeholder, onChange, options
                    ],
                    more: [
                        {
                            prop: "config.block",
                            label: "将宽度调整为父元素宽度",
                            type: 'switch',
                        },
                        size,
                        labelname,
                        valuename,
                        disabled
                    ],
                    style
                }
            }, {
                title: 'Mentions',
                type: 'mentions',
                tooltip: '提及',
                docLink: getDocLink('mentions'),
                data: { options: '选项一,选项二' },
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            value: 'mentions',
                            type: 'select',
                            options: "mentions,mentions@w200"
                        },
                        value, placeholder, onChange, options
                    ],
                    more: [
                        allowClear,
                        autoFocus,
                        {
                            prop: 'config.placement',
                            label: 'placement',
                            options: 'top,bottom',
                            config: {
                                help: '弹出层展示位置'
                            },
                            ...radiosButtons
                        },
                        size,
                        bordered,
                        disabled
                    ],
                    style
                }
            }, {
                title: 'AutoComplete',
                type: 'autocomplete',
                tooltip: '自动完成输入',
                docLink: getDocLink('autocomplete'),
                data: {},
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            value: 'autocomplete',
                            label: typeLabel,
                            type: 'select',
                            options: "autocomplete,autocomplete@w200"
                        },
                        value, placeholder, options, onChange
                    ],
                    more: [
                        allowClear,
                        {
                            prop: 'config.maxLength',
                            label: 'maxLength(最多输入个数)',
                            type: 'inputnumber'
                        },
                        autoFocus,
                        {
                            prop: 'config.backfill',
                            label: 'backfill',
                            type: 'switch',
                            config: { help: '使用键盘选择选项时把选中项回填到输入框中' }
                        },
                        {
                            prop: 'config.open',
                            label: 'open',
                            type: 'switch',
                            config: { help: '是否默认展开下拉菜单' }
                        },
                        size,
                        disabled
                    ],
                    style
                }
            }, {
                title: 'Button',
                type: 'button',
                tooltip: '按钮',
                docLink: getDocLink('button'),
                data: { value: 'button', type: 'button' },
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            type: 'select',
                            value: 'button',
                            options: "button,button-primary,button-dashed,button-text,button-link"
                        },
                        value, icon, filter, loading, onClick
                    ],
                    more: [
                        disabled,
                        {
                            prop: 'config.danger',
                            label: 'danger(红色)',
                            type: 'switch'
                        },
                        {
                            prop: 'config.ghost',
                            label: 'ghost',
                            type: 'switch'
                        },
                        {
                            prop: 'config.block',
                            label: 'block',
                            type: 'switch'
                        },
                        {
                            prop: 'config.href',
                            label: 'href',
                            type: 'input',
                            placeholder: '如https://www.baidu.com'
                        },
                        size,
                        {
                            prop: 'config.shape',
                            label: '形状',
                            options: 'default,circle,round',
                            ...radiosButtons
                        }
                    ],
                    style
                }
            }, {
                title: 'Date',
                type: 'date',
                tooltip: '日期',
                docLink: getDocLink('date'),
                data: {},
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            type: 'select',
                            value: 'date',
                            options: "date,date@w200,date-year,date-year@w200,date-month,date-month@w200,date-week,date-week@w200,date-quarter,date-quarter@w200,date-datetime,date-datetime@w200"
                        },
                        value, placeholder, onChange
                    ],
                    more: [
                        disabled
                    ],
                    style
                }
            }, {
                title: 'DateRange',
                type: 'daterange',
                tooltip: '日期范围',
                docLink: getDocLink('daterange'),
                data: {},
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            type: 'select',
                            value: 'daterange',
                            options: "daterange,daterange-year,daterange-month,daterange-week,daterange-quarter"
                        },
                        valueDateRange,
                        {
                            ...placeholder,
                            placeholder: "数组，如：['第一个','第二个']"
                        },
                        onChange
                    ],
                    more: [
                        disabled
                    ],
                    style
                }
            }, {
                title: 'TimePicker',
                type: 'timepicker',
                tooltip: '时间选择框',
                docLink: getDocLink('timepicker'),
                data: {},
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            type: 'select',
                            value: 'timepicker',
                            options: "timepicker"
                        },
                        value, placeholder, onChange, allowClear,
                        {
                            prop: 'config.use12Hours',
                            label: '十二小时制',
                            type: 'switch'
                        },
                        {
                            prop: 'config.format',
                            type: 'input',
                            label: '格式化',
                            placeholder: '缺省h:mm:ss A'
                        }
                    ],
                    more: [
                        disabled,
                        autoFocus,
                        bordered,
                        size
                    ],
                    style
                }
            }, {
                title: 'TimeRange',
                type: 'timerange',
                tooltip: '时间范围',
                docLink: getDocLink('timerange'),
                data: {},
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            type: 'select',
                            value: 'timerange',
                            options: "timerange"
                        },
                        value, placeholder, onChange, allowClear,
                        {
                            prop: 'config.use12Hours',
                            label: '十二小时制',
                            type: 'switch'
                        },
                        {
                            prop: 'config.format',
                            type: 'input',
                            label: '格式化',
                            placeholder: '缺省h:mm:ss A'
                        }
                    ],
                    more: [
                        disabled,
                        autoFocus,
                        bordered,
                        size
                    ],
                    style
                }
            }, {
                title: 'Progress',
                type: 'progress',
                tooltip: '进度条',
                docLink: getDocLink('progress'),
                data: {},
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            type: 'select',
                            value: 'progress',
                            options: "progress,progress-circle,progress-dashboard"
                        },
                        numberValue
                    ],
                    more: [],
                    style
                }
            }, {
                title: 'Dropdown',
                type: 'dropdown',
                tooltip: '下拉菜单',
                docLink: getDocLink('dropdown'),
                data: {},
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            type: 'select',
                            value: 'dropdown',
                            options: "dropdown,dropdown-a"
                        }, {
                            prop: 'text',
                            label: 'text',
                            type: 'input',
                            value: '请选择'
                        },
                        options, onClick
                    ],
                    more: [
                        {
                            prop: 'config.placement',
                            label: '弹出位置',
                            value: 'bottomLeft',
                            options: 'bottomLeft,bottomCenter,bottomRight,topLeft,topCenter,topRight'
                        },
                        {
                            prop: 'config.arrow',
                            label: '下拉框箭头',
                            type: 'switch'
                        },
                        disabled
                    ],
                    style
                }
            }, {
                title: 'Slider',
                type: 'slider',
                tooltip: '滑条',
                docLink: getDocLink('slider'),
                data: {},
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            type: 'select',
                            value: 'slider',
                            options: "slider,slider-range"
                        },
                        value, onChange
                    ],
                    more: [
                        min,
                        max,
                        {
                            prop: 'config.step',
                            label: "步长(step)",
                            type: "inputnumber"
                        },
                        disabled
                    ],
                    style
                }
            }, {
                title: 'InputNumber',
                type: 'inputnumber',
                tooltip: '计数器',
                docLink: getDocLink('inputnumber'),
                data: {},
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            type: 'select',
                            value: 'inputnumber',
                            options: "inputnumber,inputnumber@w200"
                        },
                        value, onChange
                    ],
                    more: [
                        disabled,
                        readOnly,
                        {
                            prop: 'config.autoFocus',
                            label: '自动聚焦',
                            type: 'switch'
                        },
                        min,
                        max
                    ],
                    style
                }
            }, {
                title: 'CheckBoxs',
                type: 'checkboxs',
                tooltip: '多选框',
                docLink: getDocLink('checkboxs'),
                data: { options: '选项一,选项二' },
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            type: 'select',
                            value: 'checkboxs',
                            options: "checkboxs"
                        },
                        value, onChange, options
                    ],
                    more: [
                        disabled,
                        optionvalue,
                        labelname,
                        valuename,
                        size
                    ],
                    style
                }
            }, {
                title: 'Cascader',
                type: 'cascader',
                tooltip: '级联',
                docLink: getDocLink('cascader'),
                data: { options: '选项一,选项二' },
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            type: 'select',
                            value: 'cascader',
                            options: "cascader,cascader@w200"
                        },
                        placeholder, value, onChange, treeOptions
                    ],
                    more: [
                        disabled,
                        allowClear,
                        bordered,
                        {
                            prop: 'config.expandTrigger',
                            options: 'click,hover',
                            label: '次级菜单的展开方式',
                            ...radiosButtons
                        },
                        {
                            prop: 'config.maxTagCount',
                            label: '最多显示tag数',
                            type: 'inputnumber'
                        },
                        size,
                        {
                            prop: 'config.maxTagPlaceholder',
                            label: '隐藏 tag 时显示文案',
                            placeholder: "null",
                            type: 'input'
                        },
                        ...treeFieldNames
                    ],
                    style
                }
            }, {
                title: 'Radios',
                type: 'radios',
                tooltip: '单选框',
                docLink: getDocLink('radios'),
                data: { options: '选项一,选项二' },
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            type: 'select',
                            value: 'radios',
                            options: "radios,radios-button"
                        },
                        value, onChange, options
                    ],
                    more: [
                        disabled,
                        autoFocus,
                        optionvalue,
                        {
                            prop: 'config.buttonStyle',
                            label: '风格样式',
                            value: 'outline',
                            ...radiosButtons,
                            options: 'outline,solid',
                            load: ({ data }) => data.type === 'radios-button'
                        },
                        labelname,
                        valuename,
                        size
                    ],
                    style
                }
            }, {
                title: 'TreeSelect',
                type: 'treeselect',
                tooltip: '树选择器',
                docLink: getDocLink('treeselect'),
                data: {},
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            type: 'select',
                            value: 'treeselect',
                            options: "treeselect,treeselect@w200,treeselect-multiple,treeselect-multiple@w200"
                        },
                        value, onChange, placeholder, allowClear, treeOptions
                    ],
                    more: [
                        disabled,
                        bordered,
                        filterable,
                        ...treeFieldNames,
                        size
                    ],
                    style
                }
            }, {
                title: 'Tree',
                type: 'tree',
                tooltip: '树',
                docLink: getDocLink('tree'),
                data: {},
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            type: 'select',
                            value: 'tree',
                            options: "tree,tree-select"
                        },
                        value, onChange, treeOptions
                    ],
                    more: [
                        disabled,
                        {
                            prop: 'config.autoExpandParent',
                            label: '自动展开父节点',
                            type: 'switch'
                        },
                        {
                            prop: 'config.checkStrictly',
                            label: '使父子节点不关联（checkStrictly）',
                            type: 'switch',
                            load: ({ data }) => data.type === 'tree-select'
                        },
                        {
                            prop: 'config.blockNode',
                            label: '节点占据一行',
                            type: 'switch'
                        },
                        {
                            prop: 'config.defaultExpandAll',
                            label: '默认展开所有树节点',
                            type: 'switch'
                        },
                        {
                            prop: 'config.defaultExpandParent',
                            label: '默认展开父节点',
                            type: 'switch'
                        },
                        {
                            prop: 'config.height',
                            label: '高度（虚拟滚动）',
                            type: 'inputnumber',
                            config: { min: 10 }
                        },
                        ...treeFieldNames
                    ],
                    style
                }
            }, {
                title: 'Rate',
                type: 'rate',
                tooltip: '评分',
                docLink: getDocLink('rate'),
                data: {},
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            type: 'select',
                            value: 'rate',
                            options: "rate"
                        },
                        {
                            prop: 'config.count',
                            label: 'star 总数',
                            type: 'inputnumber',
                            config: { min: 0 }
                        },
                        numberValue,
                        onChange
                    ],
                    more: [
                        disabled,
                        {
                            prop: 'config.allowHalf',
                            label: '允许半选',
                            type: 'switch'
                        },
                        autoFocus
                    ],
                    style
                }
            }, {
                title: 'Switch',
                type: 'switch',
                tooltip: '开关',
                docLink: getDocLink('switch'),
                data: {},
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            type: 'select',
                            value: 'switch',
                            options: "switch"
                        },
                        value, onChange
                    ],
                    more: [
                        size,
                        autoFocus,
                        loading,
                        {
                            prop: 'config.checkedChildren',
                            label: '选中显示的内容',
                            placeholder: '如：已选中',
                            type: 'input'
                        },
                        {
                            prop: 'config.unCheckedChildren',
                            label: '非选中显示的内容',
                            placeholder: '如：未选中',
                            type: 'input'
                        },
                        {
                            prop: 'config.checkedValue',
                            label: '选中时值',
                            placeholder: '如：1、yes，default: true',
                            type: 'input'
                        },
                        {
                            prop: 'config.uncheckedValue',
                            label: '取消选中时值',
                            placeholder: '如：0、no，default: false',
                            type: 'input'
                        }
                    ],
                    style
                }
            }, {
                title: 'Avatar',
                type: 'avatar',
                tooltip: '头像',
                docLink: getDocLink('avatar'),
                data: {},
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            type: 'select',
                            value: 'avatar',
                            options: "avatar"
                        },
                        value
                    ],
                    more: [],
                    style
                }
            }, {
                title: 'Img',
                type: 'img',
                tooltip: 'img 标签',
                docLink: getDocLink('img'),
                data: {},
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            type: 'select',
                            value: 'image',
                            options: "image"
                        },
                        value, filter
                    ],
                    more: [],
                    style
                }
            }, {
                title: 'Image',
                type: 'image',
                tooltip: '图片',
                docLink: getDocLink('image'),
                data: {},
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            type: 'select',
                            value: 'image',
                            options: "image"
                        },
                        value, filter
                    ],
                    more: [],
                    style
                }
            }, {
                title: 'Tag',
                type: 'tag',
                tooltip: '标签',
                docLink: getDocLink('tag'),
                data: {},
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            type: 'select',
                            value: 'tag',
                            options: "tag"
                        },

                        value, filter
                    ],
                    more: [
                        color
                    ],
                    style
                }
            }, {
                title: 'Tags',
                type: 'tags',
                tooltip: '标签组',
                docLink: getDocLink('tags'),
                data: {},
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            type: 'select',
                            value: 'tags',
                            options: "tags,tags-close,tags-create"
                        },
                        valueTags
                    ],
                    more: [],
                    style
                }
            }, {
                title: 'Upload',
                type: 'upload',
                tooltip: '上传',
                docLink: getDocLink('upload'),
                data: {},
                props: {
                    mustProps: ['prop', 'config.action'],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            type: 'select',
                            value: 'upload',
                            options: "upload,upload-primary,upload-img,upload-imgs,upload-dragger"
                        },
                        value,
                        {
                            prop: 'config.filter',
                            label: uploadFilterLabel,
                            render: codeRender_filter,
                            value: `({ value, data }) => {\n${getSpace()}return value\n}`
                        }, {
                            prop: 'config.action',
                            label: uploadActionLabel,
                            type: 'input',
                            placeholder: '建议在项目母版中全局配置',
                            config: {
                                help: '上传的地址'
                            }
                        }, {
                            prop: 'config.onSuccess',
                            label: uploadOnSuccessLabel,
                            render: codeRender_onSuccess,
                            value: `(response) => {\n${getSpace()}return response\n}`,
                            config: {
                                help: '服务端返回数据处理'
                            }
                        },
                        onChange
                    ],
                    more: [
                        disabled,
                        {
                            type: 'inputnumber',
                            prop: "config.maxcount",
                            label: "最多上传数量",
                            load: ({ data }) => data.type !== 'upload-img',
                            config: {
                                min: 1,
                                max: 999
                            }
                        },
                        {
                            type: 'input',
                            prop: 'config.text',
                            label: '按钮文本',
                            value: '点击上传',
                            load: ({ data }) => ['upload', 'upload-primary'].includes(data.type) || !data.type
                        },
                        {
                            type: 'input',
                            prop: 'config.fileexts',
                            label: '允许的文件后缀',
                            placeholder: '数组，如["jpg", "png"]'
                        },
                        {
                            type: 'input',
                            prop: 'config.filetypes',
                            label: '允许的文件类型',
                            placeholder: '数组，如：["image/png", "video/mp4"]',
                        },
                        {
                            type: 'input',
                            prop: 'config.filesize',
                            label: '允许上传的文件最大值',
                            placeholder: '数值，如：2',
                            config: {
                                addonAfter: "MB",
                                type: 'number'
                            }
                        }
                    ],
                    style
                }
            }, {
                title: 'Text',
                type: 'text',
                tooltip: '文本',
                docLink: getDocLink('text'),
                data: { value: 'text' },
                props: {
                    mustProps: ['prop'],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            type: 'select',
                            value: 'text',
                            options: "text,text-div,text-a,text-p,text-pre,text-i,text-b,text-strong,text-h1,text-h2,text-h3,text-h4,text-h5"
                        },
                        value, filter, onClick
                    ],
                    more: [
                        {
                            prop: 'config.href',
                            label: '链接(href)',
                            type: 'input',
                            placeholder: '如: https//baidu.com',
                            load: ({ data }) => data.type === 'text-a'
                        },
                        {
                            prop: 'config.maxlength',
                            label: '最多显示字符数(1英=0.5中，超长：...)',
                            type: 'inputnumber',
                            config: {
                                min: 1
                            }
                        },
                        {
                            prop: 'config.target',
                            label: '目标(target)',
                            type: 'input',
                            placeholder: '如: _blank, _self, _parent, _top',
                            load: ({ data }) => data.type === 'text-a'
                        },
                        {
                            prop: 'config.title',
                            label: 'title(鼠标放上提示文案)',
                            type: 'input'
                        }
                    ],
                    style
                }
            }, {
                title: 'Divider',
                type: 'divider',
                tooltip: '线',
                docLink: getDocLink('divider'),
                data: {},
                props: {
                    mustProps: [],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            type: 'select',
                            value: 'divider',
                            options: "divider,divider-vertical"
                        },
                        {
                            ...value,
                            load: ({ data }) => data.type !== 'divider-vertical'
                        },
                        {
                            prop: 'config.dashed',
                            type: 'switch',
                            label: '虚线'
                        }
                    ],
                    more: [
                        {
                            prop: 'config.plain',
                            type: 'switch',
                            label: '文字显示为普通正文样式(plain)',
                            load: ({ data }) => data.type !== 'divider-vertical'
                        },
                        {
                            prop: 'config.orientation',
                            label: 'value位置',
                            options: "left,right,center",
                            value: 'center',
                            ...radiosButtons
                        }
                    ],
                    style
                }
            }, {
                title: 'Steps',
                type: 'steps',
                tooltip: '步骤条',
                docLink: getDocLink('steps'),
                data: {},
                props: {
                    mustProps: [],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            type: 'select',
                            value: 'steps',
                            options: "steps,steps-vertical"
                        },
                        value,
                        onChange,
                        {
                            render: codeRender_step_options,
                            prop: 'options',
                            label: stepOptionsLabel,
                            placeholder: '步骤1,步骤2...',
                            config: { help: "特殊字符符串加引号: \"1,2,+3\", \"+,-,%\"" }
                        },
                        {
                            prop: 'config.progressDot',
                            label: '点状',
                            type: 'switch',

                        }
                    ],
                    more: [
                        {
                            prop: 'config.labelPlacement',
                            value: 'horizontal',
                            label: '标签位置',
                            options: {
                                'vertical': '垂直',
                                'horizontal': '水平'
                            },
                            ...radiosButtons
                        },
                        disabled,
                        {
                            prop: 'config.percent',
                            label: 'percent(进度条)',
                            type: 'inputnumber'
                        },
                        size,
                        {
                            prop: 'config.status',
                            value: 'horizontal',
                            label: '标签位置',
                            options: "wait,process,finish,error",
                            ...radiosButtons
                        },
                    ],
                    style
                }
            }, {
                title: 'Alert',
                type: 'alert',
                tooltip: '警告提示',
                docLink: getDocLink('alert'),
                data: {},
                props: {
                    mustProps: [],
                    base: [
                        {
                            prop: 'type',
                            label: typeLabel,
                            type: 'select',
                            value: 'alert',
                            options: "alert,alert-info,alert-success,alert-warning,alert-error"
                        },
                        value
                    ],
                    more: [
                        {
                            type: 'switch',
                            label: '是否用作顶部公告',
                            prop: 'config.banner'
                        },
                        {
                            type: 'switch',
                            label: '是否可关闭',
                            prop: 'config.closable'
                        },
                        {
                            type: 'switch',
                            label: '显示辅助图标',
                            prop: 'config.showIcon'
                        },
                        {
                            type: 'input-area',
                            label: '辅助性文字介绍（description）',
                            prop: 'config.description',
                        }
                    ],
                    style
                }
            }, {
                title: 'TODO',
                type: 'text',
                tooltip: '系统中不存在组件时，用于埋点注释，待后面下载到本地处理',
                docLink: getDocLink('text'),
                data: { value: '待完成(TODO)', type: 'text-b' },
                props: {
                    base: [value],
                    more: [],
                    style
                }
            }
        ]
    }, {
        title: containerLabel,
        group: 'container',
        children: [
            {
                title: 'Div',
                type: 'div',
                tooltip: '可以入在组件中的div容器',
                docLink: getDocLink('div'),
                isContainer: true,
                canPutGroup: componentCanPutGroup,
                data: {},
                props: {
                    mustProps: [],
                    base: [],
                    more: [
                        verticalVisible
                    ],
                    style,
                    baseInheritable: [],
                    moreInheritable: [],
                    inheritableRules: containerInheritableRules
                }
            }, {
                title: 'Spin',
                type: 'spin',
                tooltip: '显示loading...',
                docLink: getDocLink('spin'),
                isContainer: true,
                canPutGroup: componentCanPutGroup,
                data: {},
                props: {
                    mustProps: [],
                    base: [
                        value,
                        size,
                        {
                            prop: 'config.delay',
                            label: '延迟加载(毫秒)',
                            type: 'inputnumber'
                        }
                    ],
                    more: [
                        verticalVisible
                    ],
                    style,
                    baseInheritable: [],
                    moreInheritable: [],
                    inheritableRules: containerInheritableRules
                }
            }, {
                title: 'Space',
                type: 'space',
                tooltip: '让子元素/容器留空的容器',
                docLink: getDocLink('space'),
                isContainer: true,
                canPutGroup: componentCanPutGroup,
                data: {},
                props: {
                    mustProps: [],
                    base: [
                        {
                            prop: 'type',
                            value: 'space',
                            label: typeLabel,
                            type: 'select',
                            options: "space,space-vertical"
                        },
                        {
                            prop: 'config.align',
                            label: '对齐方式',
                            options: 'start,end,center,baseline',
                            ...radiosButtons
                        },
                        {
                            prop: 'config.split',
                            label: '设置拆分',
                            type: 'select',
                            options: [
                                {
                                    value: '<Divider type="vertical" />',
                                    label: <Divider type="vertical" />
                                }
                            ]
                        },
                        size
                    ],
                    more: [
                        verticalVisible
                    ],
                    style,
                    baseInheritable: [],
                    moreInheritable: [],
                    inheritableRules: containerInheritableRules
                }
            }, {
                title: 'InputGroup',
                type: 'inputgroup',
                tooltip: '输入控件组',
                docLink: getDocLink('inputgroup'),
                isContainer: true,
                canPutGroup: componentCanPutGroup,
                data: {},
                props: {
                    mustProps: [],
                    base: [],
                    more: [
                        verticalVisible
                    ],
                    baseInheritable: [],
                    moreInheritable: [],
                    inheritableRules: containerInheritableRules
                }
            }, {
                title: 'FormItem',
                type: 'formitem',
                tooltip: '表单行,放到Search/Form中才有效果',
                docLink: getDocLink('formitem'),
                isContainer: true,
                canPutGroup: componentCanPutGroup,
                data: {},
                props: {
                    mustProps: [],
                    base: [],
                    more: [
                        verticalVisible,
                        {
                            prop: 'config.required',
                            label: '必填样式(加 * 号)',
                            type: 'switch'
                        }
                    ],
                    baseInheritable: [],
                    moreInheritable: [],
                    inheritableRules: containerInheritableRules
                }
            }, {
                title: 'TableColGroup',
                type: 'tablecolgroup',
                tooltip: '表格的分组表头容器',
                docLink: getDocLink('table'),
                isContainer: true,
                canPutGroup: componentCanPutGroup,
                data: {},
                props: {
                    mustProps: [],
                    base: [],
                    more: [
                        verticalVisible,
                    ],
                    baseInheritable: [],
                    moreInheritable: [],
                    inheritableRules: containerInheritableRules
                }
            }, {
                title: 'Card',
                type: 'card',
                tooltip: '卡片',
                docLink: getDocLink('card'),
                isContainer: true,
                canPutGroup: componentCanPutGroup,
                data: {},
                props: {
                    mustProps: [],
                    base: [
                        title
                    ],
                    more: [
                        verticalVisible
                    ],
                    style,
                    baseInheritable: [],
                    moreInheritable: [],
                    inheritableRules: containerInheritableRules
                }
            }, {
                title: 'Tooltip',
                type: 'tooltip',
                tooltip: 'Tooltip 提示',
                docLink: getDocLink('tooltip'),
                isContainer: true,
                canPutGroup: componentCanPutGroup,
                data: {},
                props: {
                    mustProps: [],
                    base: [
                        title,
                        filter
                    ],
                    more: [
                        verticalVisible
                    ],
                    baseInheritable: [],
                    moreInheritable: [],
                    inheritableRules: containerInheritableRules
                }
            }, {
                title: 'Popconfirm',
                type: 'popconfirm',
                tooltip: '气泡确认',
                docLink: getDocLink('popconfirm'),
                isContainer: true,
                canPutGroup: componentCanPutGroup,
                data: {},
                props: {
                    mustProps: [],
                    base: [
                        title,
                        filter,
                        {
                            prop: '@cancel',
                            label: cancelLabel,
                            render: codeRender_event,
                            value: `(params) => {\n${getSpace()}\n}`
                        },
                        {
                            prop: '@confirm',
                            label: confirmLabel,
                            render: codeRender_event,
                            value: `(params) => {\n${getSpace()}\n}`
                        }
                    ],
                    more: [
                        verticalVisible,
                        {
                            prop: 'config.okText',
                            label: '确认按钮文字',
                            type: 'input',
                            placeholder: '缺省：确认'
                        },
                        {
                            prop: 'config.showCancel',
                            label: '显示取消按钮',
                            value: true,
                            type: 'switch'
                        },
                        {
                            prop: 'config.cancelText',
                            label: '取消按钮文字',
                            type: 'input',
                            placeholder: '缺省：取消',
                            load: ({ data }) => data.config?.showCancel !== false
                        }
                    ],
                    style,
                    baseInheritable: [],
                    moreInheritable: [],
                    inheritableRules: containerInheritableRules
                }

            }, {
                title: 'Row',
                type: 'row',
                tooltip: 'row 行',
                docLink: getDocLink('row'),
                isContainer: true,
                canPutGroup: componentCanPutGroup,
                data: { '~isVertical': true },
                props: {
                    mustProps: [],
                    base: [],
                    more: [
                        verticalVisible,
                        {
                            prop: '~itemSpan',
                            label: 'itemSpan（子元素缺省span）',
                            type: 'inputnumber@w60',
                            config: { max: 24, min: 1, size: 'small', help: '第一次放入的有span属性会使用此值' }
                        }
                    ],
                    style,
                    baseInheritable: [],
                    moreInheritable: [
                        span
                    ],
                    inheritableRules: containerInheritableRules
                }
            }, {
                title: 'Col',
                type: 'col',
                tooltip: 'Col 列',
                docLink: getDocLink('col'),
                isContainer: true,
                canPutGroup: componentCanPutGroup,
                data: {},
                props: {
                    mustProps: [],
                    base: [
                        {
                            prop: 'value',
                            label: 'span(占列数)',
                            type: 'inputnumber@w60',
                            config: { max: 24, min: 1, size: 'small' }
                        },
                        {
                            prop: 'config.offset',
                            label: 'offset(间隔格数)',
                            type: 'inputnumber@w60',
                            config: { max: 24, min: 1, size: 'small' }
                        }
                    ],
                    more: [
                        verticalVisible
                    ],
                    style,
                    baseInheritable: [],
                    moreInheritable: [],
                    inheritableRules: containerInheritableRules
                }
            }, {
                title: 'Affix',
                type: 'affix',
                tooltip: '固钉',
                docLink: getDocLink('affix'),
                isContainer: true,
                canPutGroup: componentCanPutGroup,
                data: {},
                props: {
                    mustProps: [],
                    base: [
                        {
                            type: 'inputnumber',
                            label: 'offsetTop',
                            prop: 'config.offsetTop'
                        }, {
                            type: 'inputnumber',
                            label: 'offsetBottom',
                            prop: 'config.offsetBottom'
                        }
                    ],
                    more: [
                        verticalVisible
                    ],
                    baseInheritable: [],
                    moreInheritable: [],
                    inheritableRules: containerInheritableRules
                }
            }, {
                title: 'Fragment',
                type: 'fragment',
                docLink: getDocLink('fragment'),
                tooltip: '<></>',
                isContainer: true,
                canPutGroup: componentCanPutGroup,
                data: { '~isVertical': true },
                props: {
                    mustProps: [],
                    base: [],
                    more: [
                        verticalVisible
                    ],
                    baseInheritable: [],
                    moreInheritable: [],
                    inheritableRules: containerInheritableRules
                }
            }
        ]
    }, {
        title: componentLabel,
        group: 'component',
        children: [
            {
                title: 'Region',
                type: 'Region',
                tooltip: "域",
                useTip: regionUseTipLabel,
                docLink: getDocLink('region'),
                isContainer: true,
                canPutGroup: componentCanPutGroup,
                data: {},
                defaultStateData: "{}",
                codeRule: regionCodeRule,
                props: {
                    mustProps: [],
                    base: [
                        data,
                        ref,
                        dataName,
                        eventName,
                        compOnChange
                    ],
                    more: [
                        verticalVisible
                    ],
                    style: cStyles,
                    baseInheritable: [
                        prop,
                        load
                    ],
                    moreInheritable: [],
                    inheritableRules: componentInheritableRules
                }
            }, {
                title: 'Search',
                isContainer: true,
                canPutGroup: componentCanPutGroup,
                type: 'Search',
                tooltip: '通常用于搜索区域',
                useTip: searchUseTipLabel,
                docLink: getDocLink('search'),
                data: {},
                defaultStateData: "{}",
                codeRule: searchCodeRule,
                props: {
                    mustProps: [],
                    base: [
                        data,
                        dataName,
                        eventName,
                        compOnChange
                    ],
                    more: [
                        verticalVisible
                    ],
                    style: cStyles,
                    baseInheritable: [
                        prop,
                        label,
                        rule,
                        load
                    ],
                    moreInheritable: [tooltip],
                    inheritableRules: componentInheritableRules
                }
            }, {
                title: 'Form',
                type: 'Form',
                isContainer: true,
                canPutGroup: componentCanPutGroup,
                useTip: formUseTipLabel,
                tooltip: '用于表单或者复杂查询',
                docLink: getDocLink('form'),
                data: { '~isVertical': true },
                defaultStateData: "{}",
                codeRule: formCodeRule,
                props: {
                    mustProps: [],
                    base: [
                        data,
                        ref,
                        dataName,
                        eventName,
                        compOnChange,
                        submit
                    ],
                    more: formMore,
                    style: cStyles,
                    baseInheritable: [
                        prop,
                        label,
                        load,
                        rule
                    ],
                    moreInheritable: [
                        labelCol, tooltip, wrapperCol, ...formConfigs
                    ],
                    inheritableRules: componentInheritableRules
                }
            }, {
                title: 'FormList',
                type: 'FormList',
                isContainer: true,
                canPutGroup: componentCanPutGroup,
                tooltip: '仅放于表单中，用于组数据',
                useTip: formListTipLabel,
                docLink: getDocLink('form'),
                data: { '~isVertical': true },
                defaultStateData: "[]",
                codeRule: formListCodeRule,
                props: {
                    mustProps: [],
                    base: [
                        arrayData,
                        dataName,
                        eventName,
                        compOnChange,
                        submit
                    ],
                    more: [],
                    style: cStyles,
                    baseInheritable: [
                        prop,
                        label,
                        load,
                        rule
                    ],
                    moreInheritable: [
                        labelCol, tooltip, wrapperCol, ...formConfigs
                    ],
                    inheritableRules: componentInheritableRules
                }
            }, {
                title: 'Table',
                isContainer: true,
                canPutGroup: componentCanPutGroup,
                type: 'Table',
                tooltip: '用于表格',
                useTip: tableUseTipLabel,
                docLink: getDocLink('table'),
                data: { isPagination: false },
                defaultStateData: "[]",
                codeRule: tableCodeRule,
                props: {
                    mustProps: [],
                    base: [
                        arrayData,
                        dataName,
                        eventName,
                        compOnChange,
                        loading,
                        {
                            prop: 'config.selection',
                            label: '是否可选(表格可选中行)',
                            type: 'switch'
                        }, {
                            prop: '@selection',
                            label: selectionLabel,
                            render: codeRender_event_selection,
                            value: `(params) => {\n${getSpace()}\n}`,
                            load: ({ data }) => data.config?.selection
                        }, {
                            prop: 'config.disabled',
                            label: selectionDisabledLabel,
                            render: codeRender_table_disabled,
                            value: `(row) => {\n${getSpace()}return false\n}`,
                            load: ({ data }) => data.config?.selection
                        }, {
                            prop: 'config.selectionType',
                            label: '选择器类型',
                            ...radiosButtons,
                            value: 'checkbox',
                            options: 'checkbox,radio',
                            load: ({ data }) => data.config?.selection
                        }, {
                            prop: 'isPagination',
                            label: '是否分页（底部有分页）',
                            type: 'switch',
                        },
                        pagination,
                        {
                            prop: '@page',
                            label: pageLabel,
                            render: codeRender_event_pagination,
                            value: `(params) => {\n${getSpace()}\n}`,
                            load: ({ data }) => data['isPagination'] !== false,
                        }],
                    more: [
                        verticalVisible,
                        { ...bordered, value: false },
                        {
                            prop: '~itemWidth',
                            label: 'itemWidth（子元素缺省宽度）',
                            type: 'inputnumber@w60',
                            config: { min: 1, size: 'small', help: '第一次放入的子元素会被赋值' }
                        },
                        {
                            prop: 'config.showHeader',
                            label: 'showHeader(是否显示表头)',
                            value: true,
                            type: 'switch'
                        },
                        size,
                        align,
                        {
                            prop: 'config.scroll.x',
                            label: 'scrollX（X坐标到达滚动）',
                            type: 'inputnumber'
                        },
                        {
                            prop: 'config.scroll.y',
                            label: 'scrollY（Y坐标到达滚动）',
                            type: 'inputnumber'
                        }
                    ],
                    style: cStyles,
                    baseInheritable: [
                        prop,
                        label,
                        tableColumnwidth,
                        load,
                        {
                            ...radiosButtons,
                            prop: 'config.fixed',
                            label: '固定(fixed)',
                            options: 'left,right'
                        }
                    ],
                    moreInheritable: [
                        align,
                        {
                            prop: 'config.ellipsis',
                            label: '超宽自动省略(ellipsis)',
                            type: 'switch'
                        },
                        {
                            prop: 'config.onCell',
                            label: tableOnCellLabel,
                            render: codeRender_default_function,
                            value: `(_, index) => {\n${getSpace()}return {}\n}`,
                        },
                        {
                            prop: 'config.sorter',
                            label: tableSortLabel,
                            render: codeRender_table_sorter,
                            value: `(a, b) => {\n${getSpace()}//return a.name - b.name\n}`
                        }, {
                            prop: '@sorter',
                            label: tableSortEventLabel,
                            render: codeRender_sorter_event,
                            value: `(params) => {\n${getSpace()}\n}`,
                            load: ({ data }) => data.config?.sorter === 'true'
                        }
                    ],
                    inheritableRules: componentInheritableRules
                }
            }, {
                title: 'List',
                type: 'List',
                tooltip: "列表",
                useTip: listUseTipLabel,
                docLink: getDocLink('list'),
                isContainer: true,
                canPutGroup: componentCanPutGroup,
                data: {},
                defaultStateData: "[]",
                codeRule: listCodeRule,
                props: {
                    mustProps: [],
                    base: [
                        arrayData,
                        dataName,
                        eventName,
                        compOnChange
                    ],
                    more: [
                        verticalVisible
                    ],
                    style: cStyles,
                    baseInheritable: [
                        prop,
                        load
                    ],
                    moreInheritable: [],
                    inheritableRules: componentInheritableRules
                }
            }
        ]
    }, {
        title: dialogLabel,
        group: 'dialog',
        children: [
            {
                title: 'FDialog',
                type: 'FDialog',
                isContainer: true,
                canPutGroup: componentCanPutGroup,
                tooltip: '弹窗+表单:同Dialog中放入个Form',
                useTip: fdialogUseTipLabel,
                docLink: getDocLink('dialog'),
                data: { '~isVertical': true },
                codeRule: fdialogCodeRule,
                props: {
                    mustProps: ['name'],
                    base: [
                        ...dialogBase,
                        modelRef
                    ],
                    more: [
                        ...formMore,
                        ...dialogMore
                    ],
                    style: cStyles,
                    baseInheritable: [
                        prop,
                        label,
                        load,
                        rule
                    ],
                    moreInheritable: [
                        labelCol, tooltip, wrapperCol, ...formConfigs
                    ]
                }
            }, {
                title: 'Dialog',
                type: 'Dialog',
                isContainer: true,
                canPutGroup: dialogCanPutGroup,
                tooltip: '常见弹窗',
                useTip: dialogUseTipLabel,
                docLink: getDocLink('dialog'),
                data: { '~isVertical': true, noForm: true },
                codeRule: dialogCodeRule,
                props: {
                    mustProps: [],
                    base: dialogBase,
                    more: [
                        verticalVisible,
                        ...dialogMore,
                        noForm
                    ],
                    style: cStyles,
                    baseInheritable: [],
                    moreInheritable: []
                }
            }, {
                title: 'FDrawer',
                type: 'FDrawer',
                isContainer: true,
                canPutGroup: componentCanPutGroup,
                tooltip: '抽屉+表单,同Drawer中放入个Form',
                useTip: fdialogUseTipLabel,
                docLink: getDocLink('drawer'),
                data: { '~isVertical': true },
                codeRule: fdrawerCodeRule,
                props: {
                    mustProps: ['name'],
                    base: [
                        ...drawerBase,
                        modelRef
                    ],
                    more: [
                        ...formMore,
                        ...drawerMore
                    ],
                    style: cStyles,
                    baseInheritable: [
                        prop,
                        label,
                        load,
                        rule
                    ],
                    moreInheritable: [
                        labelCol, tooltip, wrapperCol, ...formConfigs
                    ]
                }
            }, {
                title: 'Drawer',
                type: 'Drawer',
                isContainer: true,
                canPutGroup: dialogCanPutGroup,
                tooltip: '常见抽屉',
                useTip: drawerUseTipLabel,
                docLink: getDocLink('drawer'),
                data: { '~isVertical': true, noForm: true },
                codeRule: drawerCodeRule,
                props: {
                    mustProps: ['name'],
                    base: drawerBase,
                    more: [
                        verticalVisible,
                        ...drawerMore,
                        noForm
                    ],
                    style: cStyles,
                    baseInheritable: [],
                    moreInheritable: []
                }
            }
        ]
    }, {
        title: layoutLabel,
        group: 'layout',
        children: [
            {
                title: 'Div',
                type: 'DIV',
                tooltip: "放在主设计中的div标签",
                useTip: divUseTipLabel,
                docLink: getDocLink('div'),
                isContainer: true,
                usedType: UsedType.LAYOUT,
                canPutGroup: layoutCanPutGroup,
                data: { '~isVertical': true },
                props: {
                    mustProps: [],
                    base: [],
                    more: [
                        verticalVisible
                    ],
                    style: cStyles,
                    baseInheritable: [],
                    moreInheritable: []
                }
            }, {
                title: 'Tabs',
                type: 'Tabs',
                tooltip: "切换面板",
                useTip: tabsUseTipLabel,
                docLink: getDocLink("tabs"),
                isContainer: true,
                usedType: UsedType.LAYOUT,
                canPutGroup: ['layout'],
                data: { '~isVertical': true },
                props: {
                    mustProps: ['tab'],
                    base: [
                        tabKey,
                        {
                            prop: 'tabPosition',
                            label: '页签位置',
                            options: 'top,right,bottom,left',
                            ...radiosButtons
                        },
                        {
                            prop: 'type',
                            label: '样式',
                            options: 'line,card',
                            ...radiosButtons
                        },
                        {
                            prop: 'centered',
                            label: '居中',
                            ...radiosButtons,
                            options: 'true,false'
                        },
                        {
                            prop: 'onChange',
                            label: 'onChange',
                            render: codeRender_event,
                            value: `(next) => {\n${getSpace()}\n}`,
                            config: {
                                help: '正常在面板key使用变量（$var）时使用'
                            }
                        }
                    ],
                    more: [
                        verticalVisible
                    ],
                    style: cStyles,
                    baseInheritable: [
                        { type: 'input', prop: 'label', label: '卡头文案', rule: 'must' },
                        { type: 'input', prop: 'key', label: '对应activeKey', placeholder: '可缺省' },
                        { prop: 'forceRender', label: '隐藏是否渲染', value: 'false', options: "true,false", ...radiosButtons },
                    ],
                    moreInheritable: []
                }
            }
        ]
    }
]
var componentDataList = [], currentList = null
/**
 * 将后台的数据转换成组件
 * @param {PlugUsePO & PlugPO} item 
 * @returns compoentItem
 */
function toNetComponent(item) {
    const base = [],
        more = [{
            prop: 'config.shouldUpdate',
            label: shouldUpdateLabel,
            render: codeRender_shouldUpdate,
            value: `(pre, cur) => {\n\n}`,
            config: {
                help: '是否在其它数据变化时也更新'
            }
        }],
        plugBaseProps = JSON.parse(item.plugBaseProps), plugCustomProps = JSON.parse(item.plugCustomProps)

    for (let name of plugBaseProps) {
        if (name === 'placeholder') {
            base.push(placeholder)
        } else if (name === 'onClick') {
            base.push(onClick)
        } else if (name === 'onChange') {
            base.push(onChange)
        } else if (name === 'disabled') {
            more.push(disabled)
        }
    }
    const { plugId } = item
    for (let plug of plugCustomProps) {
        const item = {
            prop: plug.prop,
            label: getFormItemLabel(plug.prop, plug.prop, undefined, plugId),
            config: { help: plug.help }
        }

        if (plug.type === PropType.string) {
            item.type = 'input'
        } else if (plug.type === PropType.number) {
            item.type = 'inputnumber'
        } else if (plug.type === PropType.json) {
            item.render = codeRender_data
        } else if (plug.type === PropType.boolean) {
            item.type = 'switch'
        } else {
            item.render = codeRender_event
        }

        if (!item.prop.includes('.') || base.length < 5) {
            base.push(item)
        } else {
            more.push(item)
        }
    }
    //todo style className, config.*
    const component = {
        title: item.plugUseType,
        type: item.plugUseType,
        tooltip: (item.plugUseName || item.plugTooltip) + `(版本: ${item.plugUseVersion})`,
        docLink: '/plug/detail?plugId=' + item.plugId,
        data: {},
        isCustom: true,
        hasNewVersion: item.hasNewVersion,
        props: { mustProps: ['prop'], base, more, style }
    }
    return component
}

export function getDataList() {
    const netComponents = Bus.get(BUS_KEYS.componentList) || []

    if (currentList !== netComponents) {
        const tempDatas = [], elements = [], container = []

        for (let comp of netComponents) {
            if (comp.plugType === ComponentType.element) {
                elements.push(toNetComponent(comp))
            } else if (comp.plugType === ComponentType.container) {
                container.push(toNetComponent(comp))
            }
        }

        for (let item of datas) {
            let itemTemp = item

            if (item.group === 'element') {
                let children = item.children.concat(elements)
                itemTemp = { ...item, children }
            } else if (item.group === 'container') {
                let children = item.children.concat(container)
                itemTemp = { ...item, children }
            }

            tempDatas.push(itemTemp)
        }
        currentList = netComponents
        componentDataList = tempDatas
    }

    return componentDataList
}

export function getConfigItem(type) {
    for (let item of getDataList()) {
        let config = item.children.find(el => el.type === type)
        if (config) {
            return { ...config }
        }
    }
}

export function getPageConfigItem({ uuid, isContainer, pageStyle, pageClass, pageLess }) {
    const data = { pageStyle, pageClass, pageLess }

    return {
        uuid,
        data,
        isContainer,
        props: {
            style: [
                {
                    render: () => <b>当前页面样式配置：</b>
                },
                {
                    type: 'input',
                    prop: 'pageClass',
                    label: 'className',
                    placeholder: 'className',
                    value: 'freedomen-page'
                }, {
                    prop: 'pageLess',
                    label: lessLabel,
                    render: codeRender_less,
                    config: {
                        help: '使用less, 当前class的全局样式将被覆盖'
                    }
                }
            ]
        }
    }
}

export const getCurrentLevelComponent = ({ type }) => {
    for (let data of datas) {
        for (let item of data.children) {
            if (item.type === type) {
                return data.children
            }
        }
    }
    return []
}