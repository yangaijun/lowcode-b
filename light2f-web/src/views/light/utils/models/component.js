import Element from './element'
import { getSpace, getFnContainer, objectMerge, objectToString, isPlainObject, isNullObject, getEventItemString, safeString, getCodeData, unSafeString, toFirstUpperCase } from '../util'
import { moduleNames } from './imodule'

const pageType = ['DIV', 'Dialog', 'Tabs', 'Drawer']
export default class Component {
    type = null
    refs = {}
    data = {}
    rules = {}
    //@page ? @selection?
    event = {}
    //regionEvent = (params) => {} ...
    functions = {}
    children = []
    props = {}
    getName = null
    iModules = null
    iReactBatch = null
    defaultStateData = null
    iInfo = null

    constructor(design, params) {
        const { getName, iModules, iReactBatch, iInfo } = params

        this.defaultStateData = design.defaultStateData
        this.type = design.type
        this.getName = getName
        this.iModules = iModules
        this.iReactBatch = iReactBatch
        this.iInfo = iInfo
        this.rules = design.codeRule?.value

        const data = getCodeData(design.data, design.codeRule?.value)

        for (let itemKey in data) {
            if (itemKey.indexOf('@') === 0) {
                this.event[itemKey] = data[itemKey]
            }
            this.data[itemKey] = data[itemKey]
        }
        this.setClassName()
        //children columns   
        if (design.children) {
            for (let item of design.children) {
                if (pageType.includes(this.type)) { 
                    this.children.push(new Component(item, params))
                } else {
                    this.children.push(new Element(item, this.type, params))
                }
            }
        }
        //event, FDialog event 放在Form 里
        if (this.type !== 'FDialog' && this.type !== 'FDrawer' && !pageType.includes(this.type)) {
            let eventString = this.getEvents()
            if (eventString || this.data.eventName) {
                const funName = this.getName(this.data.eventName || this.type.toLowerCase() + 'Event')
                this.data.eventName = funName
                this.functions[funName] = `(params) => {\n${getSpace(1)}${eventString}\n}`

                this.iReactBatch.setEvent(funName, `(params) => {\n${eventString}\n}`)
            }
        }
        //state
        this.setStates()
        //props
        this.setProps()
        //getform
        if (this.type === 'FDialog') {
            const funName = this.getName('getDialogForm') 
            this.data.getFormName = funName
            this.iInfo.putNAndFn(unSafeString(this.props.name), funName)
            this.iReactBatch.setEvent(funName, this.getFormDomString(this.getFmodalFormProps(this.data)))
        } else if (this.type === 'FDrawer') {
            const funName = this.getName('getDrawerForm')
            this.data.getFormName = funName
            this.iInfo.putNAndFn(unSafeString(this.props.name), funName)
            this.iReactBatch.setEvent(funName, this.getFormDomString(this.getFmodalFormProps(this.data)))
        }

        this.setChildrenEvents()

        if (this.type === 'Tabs') {
            iModules.pushP(moduleNames.antd, 'Tabs')
        } else if (this.type === 'FDialog') {
            iModules.pushP(moduleNames.freedomen, 'Dialog')
                .pushP(moduleNames.freedomen, 'Form')
        } else if (this.type === 'FDrawer') {
            iModules.pushP(moduleNames.freedomen, 'Drawer')
                .pushP(moduleNames.freedomen, 'Form')
        } else if (this.type !== 'DIV' && this.type !== 'Tabs') {
            iModules.pushP(moduleNames.freedomen, this.type)
        }
    }
    //从props中取出form的props  config,....
    getFmodalFormProps(props, step = 1) {
        let formProps = {}
        if (props.submit) {
            formProps.onSubmit = `(data) => {${getFnContainer(props.submit, '(data)=>{')}}`
        }
        if (props.config) {
            formProps.config = objectToString(props.config)
        }
        if (props.ref) {
            formProps.ref = props.ref
        }
        let eventString = this.getEvents()
        if (eventString) {
            // +2 ? 被剥离过的event内容前面没有空格
            formProps.onEvent = `(params) => {\n${getSpace(step + 2)}${eventString}\n${getSpace(step + 1)}}`
        }
        return formProps
    }
    //form jsx
    getFormDomString(formProps, step = 1) {
        let props = {
            ...formProps,
            data: 'formData',
            columns: this.getColumns(step + 1)
        }
        return `(formData${this.data.data ? ` = ${this.data.data}` : ''}) => {\n${getSpace(step)}return ${this.getNormalDomString('Form', props, step).trim()}\n}`
    }
    setClassName = () => {
        if (this.data.className) {
            this.props['className'] = safeString(this.data.className)
        }
        //處理一下樣式文件
        if (this.data['~less']) {
            if (this.data.className) {
                this.props['className'] = `styles[${safeString(this.data.className)}]`
            } else {
                this.props['className'] = `styles[${safeString(this.getName(this.data.type || this.type).toLowerCase())}]`
            }
        }
    }
    setChildrenEvents = () => {
        if (pageType.includes(this.type)) {
            for (let item of this.children) {
                objectMerge(this.event, item.event)
            }
        }
    }
    //props
    setProps = () => {
        const set = (key, sourceKey, value) => {
            if (sourceKey === void 0) sourceKey = key

            if ((key in this.data) && !isNullObject(this.data[key])) {
                this.props[sourceKey] = this.data[key]
            }

            if (value !== undefined) {
                this.props[sourceKey] = value
            }
            return {
                toString: () => {
                    const value = this.props[sourceKey]

                    if (value !== undefined) {
                        if (isPlainObject(value)) {
                            this.props[sourceKey] = objectToString(value)
                        } else {
                            this.props[sourceKey] = safeString(value.toString())
                        }
                    }
                },
                toRef: ({ functions } = {}) => {
                    if (this.props[sourceKey]) {
                        this.iModules.pushP(moduleNames.react, 'useRef')
                        const refName = this.getName(this.props[sourceKey])
                        this.refs[key] = refName
                        this.data[key] = refName

                        this.iReactBatch.setRef(refName, { functions })
                    }
                }
            }
        }
        switch (this.type) {
            case 'Region':
            case 'Search':
            case 'Table':
            case 'Form':
            case 'List':
                set('dataName', 'data')
                set('eventName', 'onEvent')
                set('onChange', 'onChange')
                if (this.type === 'Table') {
                    this.data.isPagination
                        ? set('pagination')
                        : set('pagination', undefined, false)
                }
                set('config').toString()
                set('submit', 'onSubmit')
                set('ref').toRef(this.rules?.['ref'])
                break;
            case 'Drawer':
            case 'FDrawer':
            case 'Dialog':
            case 'FDialog':
                set('onOk')
                set('onCancel')
                set('width')
                set('noForm')
                set('placement')
                set('name').toString()
                set('title').toString()
                set('okText').toString()
                set('cancelText').toString()
                set('footer')
                set('ref').toRef(this.rules?.['ref'])
                break;
            case 'DIV':
                set('style')
                break;
            case 'Tabs':
                set('onChange')
                set('style')
                set('type').toString()
                set('tabPosition').toString()
                set('activeKey')
                break;
        }
    }
    //所有state
    setStates = () => {
        const data = this.data
        if (data.data) {
            const dataName = this.getName(data.dataName || this.type.toLowerCase() + 'Data')
            data.dataName = dataName

            this.iReactBatch.setState(dataName, data.data)
        } else if (data.dataName && !data.data) {
            this.iReactBatch.setState(data.dataName, this.defaultStateData)
        }
    }

    getColumns = (step) => {
        let columns = '[\n'
        for (let column of this.children) {
            columns += column.getColumn(step + 1) + ',\n'
        }
        if (columns.length > 2) {
            columns = columns.substring(0, columns.length - 2)
        }
        columns += `\n${getSpace(step)}]`

        return columns
    }

    getEvents = (step) => {
        let eventString = ''
        for (let column of this.children) {
            if (column instanceof Component) {

            } else {
                let itemEventString = column.getEvent(step)

                if (eventString && itemEventString) {
                    eventString += ' else ' + itemEventString
                } else {
                    eventString += itemEventString
                }
            }
        }
        //TOTEST  如果data中有事件 ，日前针对Table，@page,@selection => $page, $selection
        for (let key in this.event) {
            eventString += getEventItemString({
                prop: key,
                content: getFnContainer(this.event[key]),
                ifOrElse: eventString ? 'else if' : 'if'
            })
        }

        return eventString
    }
    //props: columns, data, event, submit, ...
    getNormalDomString = (type, props = {}, step = 0) => {
        let domString = `${getSpace(step)}<${type}\n` 
        for (let key in props) {
            let values = props[key]
            domString += `${getSpace(step + 1)}${key}={${values}}\n`
        }

        domString += `${getSpace(step)}/>\n`
        return domString
    }
    //Dialog and Form string dom
    getFDialogDomString = (props, step) => {
        return this.getNormalDomString('Dialog', props, step);
    }
    getFDrawerDomString = (props, step) => {
        return this.getNormalDomString('Drawer', props, step);
    }
    //dialog, div ...
    getPageTypeDom = (step) => {
        const tarName = this.type === 'DIV' ? 'div' : this.type

        if (['Dialog', 'Drawer'].includes(this.type)) {
            this.iInfo?.putDialogOrDrawerName(unSafeString(this.props.name))
        }

        let content = `<${tarName}`
        let hasProps = Object.keys(this.props).length
        if (hasProps) content += '\n'

        for (let key in this.props) {
            if (this.props[key] === '' || this.props[key] === false)
                continue
            else if (this.props[key] === true)
                content += `${key}\n`
            else
                content += `${key}={${this.props[key]}}\n`
        }
        content += `${hasProps ? getSpace(step) : ''}>\n`
        for (let item of this.children) {
            if (item.getDomString) {
                content += item.getDomString(step + 1)
            }
        }
        content += `${getSpace(step)}</${tarName}>\n`
        return content
    }
    getTabPaneItems = (children) => {
        let items = "["

        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            let item = objectToString({ key: i, ...child.data})
            item = item.substring(0, item.length - 1) + `, children:${child.getDomString()}},`
            items += item
        }

        items += "]"
        
        return items
    }
    //tabs
    getTabsDom = (step) => {
        let content = `${getSpace(step)}<Tabs `
        for (let key in this.props) {
            content += `${getSpace(step + 1)}${key}={${this.props[key]}}\n`
        }

        const items = this.getTabPaneItems(this.children)

        content += `items={${items}}/>\n`

        return content
    }
    //external
    getDomString = (step = 1) => {
        if (this.type === 'FDialog') {
            return this.getFDialogDomString(this.props, step)
        } else if (this.type === 'FDrawer') {
            return this.getFDrawerDomString(this.props, step)
        } else if (this.type === 'Tabs') {
            return this.getTabsDom(step)
        } else if (pageType.includes(this.type)) {
            return this.getPageTypeDom(step)
        } else {
            this.props.columns = this.getColumns(step)
            return this.getNormalDomString(this.type, this.props, step)
        }
    }
}