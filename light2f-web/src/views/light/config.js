export const canPutBgColor = 'rgb(225, 243, 216)'

export const activityContainerBorder = '1px solid #40A9FF'
export const defaultContainerBorder = '1px dashed #aaa'

export const activityDIVLeftBorder = '12px solid #40A9FF'
export const defaultDIVLeftBorder = '12px solid #aaa'

export const activityElementBgColor = '#69B7FF'
export const defaultElementBgColor = '#f2f3ff'

const formSequence = [
    'type',
    'prop',
    'label',
    'value',
    'config.count',
    'config.icon',
    'fixed',
    'width',
    'okText',
    'cancelText',
    'text',
    'activeKey',
    'placeholder',
    'config.use12Hours',
    'config.format',
    'config.checkedValue',
    'config.uncheckedValue',
    'config.rows',
    'eventName',
    'dataName',
    '@click',
    '@search',
    '@confirm',
    '@cancel',
    'data',
    'onChange',
    'config.loading',
    'config.selection',
    '@selection',
    'config.disabled',
    'config.selectionType',
    'isPagination',
    '@page',
    'config.action',
    'filter',
    'config.filter',
    'config.onSuccess',
    'options',
    '@change',
    '@selection',
    'name',
    'title',
    'ref',
    'submit',
    'onOk',
    'onCancel',
    'rule',
    'load',
    //more
    '~isVertical',
    'disabled',
    'config.maxLength',
    'span',
    'config.labelWrap',
    'config.labelCol',
    'config.wrapperCol',
    'config.danger',
]
const columnSequence = [
    'type',
    'prop',
    'label',
    'placeholder',
    'value',
    'filter',
    'width',
    'options',
    'style',
    'span',
    'rule',
    'class',
    'render',
    'load',
    'disabled',
    'config'
]
//没有的prop 排到最后
function getPropIndex(index, value = 1000) {
    return index === -1 ? value : index
}

export function sortFormSequence(arr = []) {
    arr.sort((a, b) => {
        let aProp = Array.isArray(a) ? a[0].prop : a.prop
        let bProp = Array.isArray(b) ? b[0].prop : b.prop
        return getPropIndex(formSequence.indexOf(aProp)) - getPropIndex(formSequence.indexOf(bProp))
    })
    return arr
}

export function sortColumnSequence(arr = []) {
    arr.sort((a, b) => {
        return columnSequence.indexOf(a) - columnSequence.indexOf(b)
    })
    return arr
}

const layouts = ['DIV', 'Tabs']
const modals = ['Dialog', 'Drawer', 'FDialog', 'FDrawer']
const forms = ['Form', 'Search']
const regions = ['Region', 'Table', 'List']
const alls = [
    ...layouts,
    ...forms,
    ...regions,
    ...modals
]

const baseContainerNots = [...layouts, ...modals, 'formitem', 'tablecolgroup']
const cr = {
    not: baseContainerNots
}

const containers = {
    formitem: cr,
    div: cr,
    spin: cr,
    space: cr,
    inputgroup: cr,
    card: cr,
    tooltip: cr,
    popconfirm: cr,
    col: cr,
    row: cr,
    fragment: cr
}

export const canPutMap = {
    $page: alls,
    //layouts
    DIV: alls,
    Tabs: ['DIV'],
    //components
    Region: {
        not: [...layouts, ...modals, 'formitem', 'tablecolgroup']
    },
    Search: {
        not: [...layouts, ...modals, 'tablecolgroup']
    },
    Form: {
        not: [...layouts, ...modals, 'tablecolgroup']
    },
    Table: {
        not: [...layouts, ...modals, 'formitem']
    },
    List: {
        not: [...layouts, ...modals, 'formitem', 'tablecolgroup']
    },
    Dialog: [layouts, ...forms, ...regions],
    FDialog: {
        not: [...layouts, ...modals, 'tablecolgroup']
    },
    Drawer: [layouts, ...forms, ...regions],
    FDrawer: {
        not: [...layouts, ...modals, 'tablecolgroup']
    },
    //containers
    ...containers
}
/**
 * service 文件后缀名
 */
export const serviceSuffix = 'Service'

export const pressKeys = {
    save: 'CTRLS',
    copy: 'CTRLC',
    delete: 'CTRLX',
    paste: 'CTRLV',
    rollback: 'CTRLZ',
    future: 'CTRLY',
    setToken: 'CTRLQ'
}

export const interceptPressKeys = Object.values(pressKeys)

//聚焦这些class 的时后快捷键有用
export const inListenerClass = 'in-control'

export const stopListenerClass = ['ql-editor', 'ace_text-input', 'ant-input', 'ant-select-selection-search-input']

export const componentTypes = ['Region', 'Search', 'Form', 'Table', 'List']

export const DocDialogName = 'doc'

export const TokenDialogName = 'tokendoc'

//预览跳转的时的参数的前缀
export const paramsKeyPrefix = "l2f$_"

export const INSTRUCTS = {
    //$dialog.open(name, {}, params)
    DIALOGOPEN: '$dialog.open',
    //$dialog.close(name)
    DIALOGCLOSE: '$dialog.close',
    //$dialog.loading(name)
    DIALOGLOADING: '$dialog.loading',
    //$drawer.open(name, {}, params)
    DRAWEROPEN: '$drawer.open',
    //$drawer.close(name)
    DRAWERCLOSE: '$drawer.close',
    //$drawer.loading(name)
    DRAWERLOADING: '$drawer.loading',
    //$set(stateName, newValue)
    SET: '$set',
    //$api.***
    API: '$api',
    //$history
    HISTORY: '$history.',
    //$history.push
    HISTORYPUSH: '$history.push',
    //$history.replace
    HISTORYREPLACE: '$history.replace',
    //$history.go
    HISTORYGO: '$history.go',
    //$history.get("name")
    HISTORYRSTATE: '$history.state',
    //$modal.message
    MESSAGE: '$modal.message.',
    //$modal
    MODAL: '$modal.',
    //ref
    REF: '$ref.',
    //util
    UTIL: '$util.',
    //sys 项目页面菜单选项
    SYS_PAGEMENUOPTIONS: '$sys.pageMenuOptions',
    //golablData
    GLOBAL: '$global.',
    //页面变量
    VAR: '$var.',
    //页面函数
    FN: '$fn.',
    //localStorage
    LS: '$localStorage'
} 

export const RENAMES = {
    //url 上的参数
    urlParams: 'urlParams',
    nullString: '',
    historyPush: 'history.push',
    historyReplace: 'history.replace',
    historyGo: 'history.go',
    globalData: 'globalData.',
    util: 'util.',
    ls: 'localStorage'
}

export const valueTypes = {
    'string': 1,
    'unString': 2,
    'fun': 3,
    'ref': 4
}

export const currentChooseKeys = {
    designPanel: 'v0o3',
    fnName: 'io9b',
    selectPage: 'sp1m'
}