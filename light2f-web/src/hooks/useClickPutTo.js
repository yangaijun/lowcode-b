import { useEffect } from 'react'
import Bus, { BUS_KEYS } from 'views/light/bus'
import { message } from 'antd'
import { canPutIn, clone, getChainValueByString, setChainValueByString } from 'views/light/utils/util'
import { PAGE_ACTIVE_COLUMN_UUID } from 'views/light/types'
import { getConfigItem } from 'views/light/components/panel/component/config'
import update from 'immutability-helper'
import { cloneDeep } from 'lodash'

function getNewItem(item, parent) {
    const newItem = clone(getConfigItem(item.type), parent)
    const cloneCildren = (children, parent) => {
        if (!Array.isArray(children)) return
        let c = []
        for (let i of children) {
            const tempItem = getConfigItem(i.type)
            tempItem.data = { ...tempItem.data, ...cloneDeep(i.data) }

            let newItem = clone(tempItem, parent)

            if (i.children) {
                newItem.children = cloneCildren(i.children, newItem)
            }
            c.push(newItem)
        }
        return c
    }
    newItem.data = { ...newItem.data, ...cloneDeep(item.data) }
    newItem.children = cloneCildren(item.children, newItem)

    return newItem
}

function getReplaceItem(oldItem, newType, parent) {
    const newItem = clone(getConfigItem(newType), parent)
    const { base = [], more = [], style = [] } = newItem.props
    const propItems = [...base, ...more, ...style]
    propItems.forEach(item => {
        if (item.prop !== 'type') {
            const value = getChainValueByString(oldItem.data, item.prop)
            if (value !== undefined) {
                setChainValueByString(newItem.data, item.prop, value)
            }
        }
    })
    newItem.children = oldItem.children

    return newItem
}

function showSuccessMsg(msg) {
    message.destroy()
    message.success(msg, 1)
}

function showErrorMsg(msg) {
    message.destroy()
    message.info(`操作失败：${msg}`, 2)
}

export default function useClickPutTo(activeColumn, { list, parent }, updateList, isCenter) {
    useEffect(() => {
        const putIndex = Bus.on(BUS_KEYS.putEnd, function (item) {
            if (!item) return
            const { uuid, isContainer } = activeColumn

            if (uuid === PAGE_ACTIVE_COLUMN_UUID && isCenter) {
                if (!canPutIn(item.type, activeColumn.parentTypes, '$page')) {
                    showErrorMsg(`${item.type}不可以直接放入页面中，请先选中容器！`)
                    return
                }
                //没有父对象，不要第二个参数
                const newItem = getNewItem(item)
                updateList(update(list, {
                    $push: [newItem]
                }))
                showSuccessMsg('添加' + item.type + '成功！')
            } else if (isContainer) {
                const index = list.findIndex(el => el.uuid === activeColumn.uuid)
                if (index !== -1) {
                    let { children = [] } = list[index]
                    if (!canPutIn(item.type, activeColumn.parentTypes, list[index].type)) {
                        showErrorMsg(`${item.type}不可以直接放入${list[index].type}中！`)
                        return
                    }
                    //複製的item 已經被污染了，要根據類型重新取；!? 要不要去掉没用的数据， props里的字段去掉？
                    const newItem = getNewItem(item, activeColumn)
                    //更新新列表
                    children = children.concat([newItem])
                    updateList(children, index)
                    showSuccessMsg('添加' + item.type + '成功！')
                }
            } else if (uuid !== PAGE_ACTIVE_COLUMN_UUID && list.findIndex(el => el.uuid === uuid)) {
                showErrorMsg('只可以放在容器里！')
            }
        })

        const replaceIndex = Bus.on(BUS_KEYS.replace, function (type) {
            const index = list.findIndex(el => el.uuid === activeColumn.uuid)
            if (index !== -1) {
                if (!canPutIn(type, activeColumn.parentTypes, parent.type)) {
                    showErrorMsg(`${type}不可以直接放入${parent.type}中！`)
                    return
                }

                const newItem = getReplaceItem(activeColumn, type, parent)
                updateList(update(list, {
                    $splice: [[index, 1, newItem]]
                }))
                Bus.emit(BUS_KEYS.focus, newItem)
                showSuccessMsg(`将${activeColumn.type}替换为${type}操作成功！`)
            }
        })

        return () => {
            Bus.remove(putIndex, replaceIndex)
        }
    }, [activeColumn, list, parent, updateList, isCenter])
}