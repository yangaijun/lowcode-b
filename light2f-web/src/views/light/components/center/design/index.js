import { useState, useEffect, useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { ReactSortable } from 'react-sortablejs';
import { Dialog } from 'freedomen';
import { Dropdown, message } from 'antd'
import { clone, isComponent, isSort } from 'views/light/utils/util'
import { useCanPutIn, useClickPutTo } from 'hooks';
import DragItem from './DragItem'
import update from 'immutability-helper'
import Bus, { BUS_KEYS } from 'views/light/bus'
import { useSelector } from 'react-redux';
import { cloneDeep, uniqueId } from 'lodash';
import { PAGE_ACTIVE_COLUMN_UUID } from 'views/light/types';
import { inListenerClass, pressKeys } from 'views/light/config';
import { getCurrentLevelComponent, getPageConfigItem } from 'views/light/components/panel/component/config'
import className from 'classnames'
import styles from './index.module.less'
import { getComponentForm } from './CreateComponentInfo';

const canPutGroup = ['layout', 'component', 'dialog']
//历史记录
const rollbacks = [], futures = [], dialogName = "addComponent"
//复制對象
var copyColumn = null

const getPageActiveColumn = (column = {}) => {
    //如果没有活跃，假设页面就是活跃的
    if (!column.uuid) {
        return { uuid: PAGE_ACTIVE_COLUMN_UUID, isContainer: true }
    }
    return column
}
//複製出來的重新設置UUID
const resetUuid = (column) => {
    column.uuid = uniqueId()
    if (column.children && column.children.length) {
        for (let item of column.children) {
            resetUuid(item)
        }
    }
}

export default function Design(props) {
    const { projectId } = useSelector(state => state.project)
    const { designList = [], activityColumn, onChange = () => { } } = props
    const [list, setList] = useState(designList)
    const canPutbackgroundColor = useCanPutIn(canPutGroup)
    const page = useSelector(state => state.page)
    const { hasPermission } = useSelector(state => state.temporary)
    //添加模块表单的 relation 对象数据
    const componentRelationRef = useRef()
    //没有活跃column
    const noActivityColumn = useMemo(() => {
        return !activityColumn.uuid || activityColumn.uuid === PAGE_ACTIVE_COLUMN_UUID
    }, [activityColumn])
    //获取删除后的List
    const getDeletedList = useCallback((list) => {
        let newList = []
        for (let item of list) {
            if (item.uuid !== activityColumn.uuid) {
                if (item.children && item.children.length) {
                    item.children = getDeletedList(item.children)
                }
                newList.push(item)
            }
        }
        return newList
    }, [activityColumn])
    //删除选中元素
    const deleteActivityItem = () => {
        if (noActivityColumn) {
            return
        }

        copyColumn = activityColumn
        Bus.emit(BUS_KEYS.focus, {})
        //保存还未删除时的记录
        rollbacks.push(cloneDeep(list))
        onChange(getDeletedList(list))
        message.success('已删除/剪切:' + activityColumn.type)
        props.onUpdate?.()
    }
    //拷贝
    const copyActivityItem = useCallback(() => {
        //没有选中元素，或者鼠标选中一些文案
        if (noActivityColumn || window.getSelection().toString()) {
            return
        }

        copyColumn = activityColumn
        message.success('已复制:' + activityColumn.type)
    }, [noActivityColumn, activityColumn])
    //粘贴
    const pasteToActivityItem = () => {
        if (copyColumn == null) {
            return
        }
        copyColumn = cloneDeep(copyColumn)
        resetUuid(copyColumn)
        Bus.emit(BUS_KEYS.putEnd, copyColumn)
    }
    //回滚
    const rollbackItem = () => {
        if (rollbacks.length) {
            let pop = rollbacks.pop()
            futures.push(pop)
            onChange(pop)
            props.onUpdate?.()
        } else {
            message.info('没有可回滚项！')
        }
    }
    //ctrl + y 重做
    const futureItem = () => { 
        if (futures.length) {
            let shift = futures.shift()
            rollbacks.push(shift)
            onChange(shift)
            props.onUpdate?.()
        } else {
            message.info('没有可重做项！')
        }
    }
    //拖拽, 点击，等更新 List
    const onUpdate = useCallback(() => {
        rollbacks.push(cloneDeep(designList))
        props?.onUpdate()
    }, [designList])
    //子元素更新
    const updateList = useCallback((newChildren, index) => {
        if (index === void 0) {
            if (isSort(list, newChildren)) {
                onChange(newChildren)
            }
        } else if (newChildren) {
            let newList = update(list, {
                [index]: {
                    children: {
                        $set: newChildren
                    }
                }
            })
            onChange(newList)
        }
    }, [list])
    //拦截一下，单击放入
    const interceptClickPutTo = (newChildren, index) => {
        onUpdate()
        updateList(newChildren, index)
    }
    //鼠标事件
    const onMouseDown = useCallback((evt) => {
        const { button } = evt
        if (button === 0) {
            //点击页面
            Bus.emit(BUS_KEYS.focus, getPageConfigItem({
                ...getPageActiveColumn(),
                ...Bus.get(BUS_KEYS.pageData)
            }))
        }
    }, [page.pageId])
    //清空，只保存本页数据记录 
    useEffect(() => {
        rollbacks.length = 0
    }, [page.pageId])
    //点击添加 
    useClickPutTo(getPageActiveColumn(activityColumn), { list }, interceptClickPutTo, true)
    //快捷键处理
    useEffect(() => {
        const cn = document.activeElement?.className
        //不在设计页面 ，快捷键不能用
        if (cn && !cn.includes(inListenerClass)) return

        const pressKey = Bus.on(BUS_KEYS.keypress, ({ key }) => {
            if (window.getSelection().toString()) return

            switch (key) {
                case pressKeys.delete:
                    deleteActivityItem()
                    break;
                case pressKeys.copy:
                    copyActivityItem()
                    break;
                case pressKeys.paste:
                    pasteToActivityItem()
                    break;
                case pressKeys.rollback:
                    rollbackItem()
                    break;
                case pressKeys.future:
                    futureItem()
                    break;
            }
        })
        return () => Bus.remove(pressKey)
    }, [document.activeElement?.className, list, activityColumn])
    //更新designList
    useLayoutEffect(() => {
        setList(designList)
    }, [designList])
    //右擊菜單
    const menu = useMemo(() => {
        const items = [
            { key: '1', disabled: noActivityColumn, label: '复制选中（ctrl + c）' },
            { key: '2', disabled: copyColumn == null, label: '粘贴（ctrl + v）' },
            { key: '3', disabled: noActivityColumn, label: '删除/剪切选中（ctrl + x）' },
            { key: '4', disabled: !rollbacks.length, label: '撤销删除/剪切（ctrl + z）' }
        ]

        if (!isComponent(activityColumn)) {
            const exchangeItems = getCurrentLevelComponent(activityColumn)
                .filter(el => el.type !== activityColumn.type)
                .map(el => {
                    return {
                        key: "5_" + el.type,
                        label: el.title
                    }
                })
            items.push({ key: '5', disabled: noActivityColumn, label: '将选中替换为', children: exchangeItems })
        }

        if (!!projectId && hasPermission) {
            items.push(
                { type: 'divider', },
                { key: '6', disabled: noActivityColumn, label: '将选中添加到模块' }
            )
        }
        return {
            items,
            onClick({ key }) {
                if (key === '1') {
                    copyActivityItem()
                } else if (key === '2') {
                    pasteToActivityItem()
                } else if (key === '3') {
                    deleteActivityItem()
                } else if (key === '4') {
                    rollbackItem()
                } else if (key.includes("5_")) {
                    Bus.emit(BUS_KEYS.replace, key.split("_")[1])
                } else if (key === '6') {
                    Bus.emit(BUS_KEYS.updatePriviewState, false)
                    Dialog.open(dialogName, { title: '添加到模块' }).then(s => s(
                        getComponentForm(componentRelationRef, dialogName, projectId, page.pageId, activityColumn)
                    ))
                }
            }
        }
    }, [activityColumn, hasPermission, page.pageId, projectId])

    return <div className={className(styles.page, {
        [styles['active-page']]: activityColumn.uuid === PAGE_ACTIVE_COLUMN_UUID
    })}>
        <Dialog name={dialogName} width={1024} config={{
            afterClose() {
                Bus.emit(BUS_KEYS.updatePriviewState, true)
            }
        }} />
        <Dropdown menu={menu} trigger={['contextMenu']}>
            <div className={styles["design-body"]} onMouseDown={onMouseDown} >
                <ReactSortable
                    sort
                    list={list}
                    animation={180}
                    onUpdate={onUpdate}
                    className={styles["drag-center"]}
                    style={{ backgroundColor: canPutbackgroundColor }}
                    group={{
                        name: 'component',
                        push: true,
                        pull: false,
                        put: canPutGroup
                    }}
                    setList={newList => {
                        updateList(newList)
                    }}
                    clone={(currentItem) => {
                        onUpdate()
                        return clone(currentItem)
                    }}
                >
                    {
                        list.map((el, index) => (<DragItem
                            key={el.uuid}
                            column={el}
                            onUpdate={onUpdate}
                            activityColumn={activityColumn}
                            updateList={(newChildren) => {
                                updateList(newChildren, index)
                            }}
                        />))
                    }
                </ReactSortable>
            </div>
        </Dropdown>
    </div>
}
