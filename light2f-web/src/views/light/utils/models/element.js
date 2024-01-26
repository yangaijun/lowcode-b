import { isPlainObject, objectToString, getSpace, getFnContainer, isComponentType, isNullObject, getEventItemString, safeString, isStrValuekey, getCodeData, getCodeValue, unSafeString } from '../util'
import { getIconNameByValue } from '../../components/panel/component/icons'
import { sortColumnSequence } from '../../config'
import { toValidClass } from '../icode'
import { IString } from '../string'
import { moduleNames } from './imodule'

const ridKeys = ['className']
//todo, table 分頁配置，是否可選， @選擇 @分頁
const ComponentColumnFilterDataKey = [
    'data', 'submit', 'pagination', 'ref', 'isPagination'
] //column 中type為組件， 過濾的data  Key
export default class Element {
    type = null
    children = []
    data = {}
    event = {}
    props = {}
    parentType = null

    getName = null
    iModules = null
    iReactBatch = null

    constructor(child, parentType, params) {
        const { getName, iModules, iReactBatch } = params

        this.getName = getName
        this.iModules = iModules
        this.iReactBatch = iReactBatch
        const data = getCodeData(child.data, child.codeRule?.value)
        this.props.type = this.type = child.type
        this.parentType = parentType
        //导入的icon图标
        if (data.config?.icon) {
            iModules.pushP(moduleNames.icon, getIconNameByValue(unSafeString(data.config.icon)))
        }
        //space 的分隔符号
        if (data.config?.split) {
            iModules.pushP(moduleNames.antd, 'Divider')
        }
        if (this.getIsComponentType()) {
            iModules.pushP(moduleNames.freedomen, this.type)
        }

        for (let itemKey in data) {
            if (itemKey.indexOf('@') === 0) {
                this.event[itemKey] = data[itemKey]
            } else {
                this.props[itemKey] = data[itemKey]
            }
            this.data[itemKey] = data[itemKey]
        }

        if (child.children) {
            this.children = []
            for (let item of child.children) {
                this.children.push(new Element(item, this.type, params))
            }
        }
    }

    getChildren = (step, ridComma = true) => {
        if (this.children == null || !this.children.length) {
            return null
        }
        const columns = IString()
        for (let item of this.children) {
            columns.append(item.getColumn(step + 1))
                .appendln(",")
        }
        if (ridComma) {
            columns.removeRight(2)
        }
        return columns.toString()
    }

    getComponentColumn = (step) => {
        const column = IString(`render() {\nreturn <${this.type}\n`)

        if (this.type === 'Table') {
            const { isPagination, pagination } = this.props
            if (isPagination && pagination) {
                column.appendln(`pagination={${this.props.pagination}}`)
            } else if (isPagination === false) {
                column.appendln(`pagination={false}`)
            }
        }
        if (this.props.ref) {
            let refName = this.getName(this.props.ref)
            this.iReactBatch.setRef(refName)
            column.appendln(`ref={${refName}}`)
        }

        if (this.props.data) {
            column.append(`data={${this.props.data}}`)
        }

        column.appendln(`${getSpace(step + 3)}columns={[\n${this.getChildren(step + 3)}\n${getSpace(step + 3)}]}`)

        //event
        const events = this.getEvent(step, true)
        if (events) {
            column.append(`onEvent={(params) => {${events}}}`)
        }

        if (this.props.submit) {
            column.append(`onSubmit={${this.props.submit}}`)
        }

        column.appendln(`${getSpace(step + 2)}/>`)
            .append(`${getSpace(step + 1)}}`)

        return column.toString()
    }

    getColumn = (step) => {
        const isComponent = this.getIsComponentType()
        const props = this.props
        let column = IString(getSpace(step) + "{ ")
        let sortColumns = sortColumnSequence(Object.keys(props))
        const isTableOrColGroup = this.parentType === 'Table' && this.props.type !== 'tablecolgroup' || this.parentType === 'tablecolgroup' && this.props.type !== 'tablecolgroup'
        //Table的子容器組件，如果加上会在render return 的数组容器属性中有，而实际只需要在外面的render中有即可，重复了
        if (isTableOrColGroup && this.children.length) {
            sortColumns = sortColumns.filter(el => {
                return !(['width', 'label'].includes(el))
            })
        }

        for (let key of sortColumns) {
            if (key.indexOf('~') === 0 || isNullObject(props[key]) || ridKeys.includes(key) || (isComponent && ComponentColumnFilterDataKey.includes(key))) continue
            //组件的data,要换成value
            if (isPlainObject(props[key])) {
                const objStr = objectToString(props[key])
                if (objStr !== null) {
                    column.append(`${key}: ${objStr}, `)
                }
            } else if (!isComponent || (isComponent && key !== 'type')) {
                column.append(`${key}: ${safeString(getCodeValue(props[key]), isStrValuekey(key))}, `)
            }
        }
        //處理一下less文件
        if (this.data['className'] || this.data['~less']) {
            const className = safeString(toValidClass(unSafeString(this.getName(this.data.className || this.data.prop || this.data.type || this.type))))
            column.append(`className: <!className!>, `)
                .template({
                    className: this.data['~less'] ? `styles[${className}]` : className
                })
        }

        if (isComponent) {
            column.append(('\n' + getSpace(step + 1)) + this.getComponentColumn(step))
        } else {
            column.removeRight(2).append(" ")
        }
        column.append(`}`)

        if (!isComponent) {
            let children = this.getChildren(step, false)
            if (children !== null) {
                if (isTableOrColGroup) {
                    column = IString(`{<!space!><!label!><!width!> render() {\n<!space1!>return [\n<!spaceOne!><!children!><!spaceOne!><!column!>\n<!space1!>]\n<!space!>}}`)
                        .template({
                            space: getSpace(step),
                            label: props.label ? ` label: ${props.label},` : '',
                            width: props.width ? ` width: ${props.width},` : '',
                            space1: getSpace(step + 1),
                            spaceOne: getSpace(1),
                            children: children,
                            column: column.toString(),
                        })
                } else {
                    column = IString(`${getSpace(step)}[\n${children}${getSpace(1)}${column.toString()}\n]`)
                }
            }
        }

        return column.toString()
    }

    getChildrenEvent = (step) => {
        let str = ''

        for (let item of this.children) {
            let itemEventString = item.getEvent(step)
            if (itemEventString) {
                str += str ? (' else ' + itemEventString) : itemEventString
            }
        }
        return str;
    }

    getEvent = (step, force) => {
        //component 组件有自己的事件逻辑
        if (this.getIsComponentType() && !force) return ""

        const istr = IString(this.getChildrenEvent(step))
        const keys = Object.keys(this.event)
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            istr.append(
                getEventItemString({
                    prop: this.props.prop,
                    content: getFnContainer(this.event[key]),
                    ifOrElse: i === 0 ? "if" : " else if",
                    type: key
                })
            )
        }
        return istr.toString()
    }

    getIsComponentType() {
        return isComponentType(this.type)
    }
}