import { validate } from './rule';
import util, { getChainValueByString, splitConfig } from '../utils/util';
import { isContainer } from '../region';
import { emptyValue, emptyKey, formItemProps } from '../config/props'
import { CONTAINER_NAMES } from '../containers';
import utils from '../utils/util';

const isNoStyle = (type: string = '') => {
    for (let item of CONTAINER_NAMES) {
        if (item === 'fragment') continue

        if (type.indexOf(item) === 0) {
            return true
        }
    }
    return false
}
//index 可以未空
const resetRule = (data: any, column: any, index?: number) => {
    let tempData = data
    if (index) {
        tempData = data[index]
    }
    if (typeof column.rule === 'string' || util.isPlainObject(column.rule)) {
        let message = validate(getChainValueByString(tempData, column.prop), column.rule, tempData)
        if (message === null || message === undefined || message === '') return Promise.resolve()
        else return Promise.reject(message)
    } else if (typeof column.rule === 'function') {
        return validate(getChainValueByString(tempData, column.prop), column.rule, tempData)
    }
    return Promise.resolve()
};

export const setColumns = (data: any, columns: any[], index?: number, noStyle = false): any[] => {
    const setRule = (column: any) => {
        if (column.rule) {
            if (typeof column.rule === 'string' && column.rule.includes(emptyValue)) {
                column[emptyKey] = true
            }
            column.rules = [{
                validator: () => {
                    return resetRule(data, column, index)
                }
            }];
        }
    };
    const newColumns: any[] = []
    columns.forEach(c => {
        const column = utils.clone(c)

        if (util.isPlainObject(column)) {
            setRule(column)
            const formItemConfig = splitConfig(column.config, formItemProps)

            let newItem = [column]
            if (column.type || column.label !== undefined || column.rule || formItemConfig.wrapperCol || formItemConfig.labelCol) {
                newItem.push({
                    ...column,
                    noStyle: noStyle,
                    config: formItemConfig,
                    type: 'formitem',
                    style: undefined,
                    className: undefined
                })
            }
            //特殊处理添加 col, 下面还有个
            if (column.span) {
                delete newItem[newItem.length - 1].noStyle

                newColumns.push([newItem, { type: 'col', value: column.span }])
            } else {
                newColumns.push(newItem)
            }
        } else if (Array.isArray(column) && column.length) {
            let resetColumns
            if (isContainer(column[column.length - 1])) {
                let lastColumn = column[column.length - 1]
                resetRule(data, lastColumn)

                const children = column.slice(0, column.length - 1)

                resetColumns = setColumns(data, children, index, isNoStyle(lastColumn.type))

                resetColumns.push(lastColumn)
                //特殊处理添加 col，上面还有个
                if (lastColumn.span) {
                    newColumns.push([[resetColumns], { type: 'col', value: lastColumn.span }])
                } else {
                    newColumns.push(resetColumns)
                }
            } else {
                resetColumns = setColumns(data, column, index, true)
                resetColumns.push({ type: 'formitem' })
                newColumns.push(resetColumns)
            }
        }
    });
    
    return newColumns;
}

