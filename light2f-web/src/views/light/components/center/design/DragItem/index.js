import React, { useState, useEffect, useCallback, useMemo, useLayoutEffect } from 'react'
import { ReactSortable } from 'react-sortablejs'
import {
    defaultContainerBorder,
    activityContainerBorder,
    activityDIVLeftBorder,
    defaultDIVLeftBorder,
    defaultElementBgColor,
    activityElementBgColor
} from 'views/light/config'
import { clone, isSort } from 'views/light/utils/util'
import classnames from 'classnames'
import update from 'immutability-helper'
import Bus, { BUS_KEYS } from 'views/light/bus'
import { useCanPutIn, useClickPutTo } from 'hooks'
import { useSelector } from 'react-redux'
import { UsedType } from 'views/light/types'
import { ExclamationCircleOutlined, RightOutlined, DownOutlined } from '@ant-design/icons'
import './index.less'

function getShortTitle(title) {
    if (title.length > 8) {
        let newTitle = ''
        for (let i = 0; i < title.length; i ++) {
            const char = title.charAt(i)
            if (char >= 'A' && char <= 'Z') {
                newTitle += char
            }
        }
        return newTitle
    }
    return title
}

export default function DragItem(props) {
    const { column, activityColumn, updateList: parentUpdateList = () => { } } = props
    const { children = [], data, canPutGroup } = column
    const { rightFormChange } = useSelector(state => state.event)
    const [list, setList] = useState(children)
    const [closed, setClosed] = useState(false)
    const canPutbackgroundColor = useCanPutIn(canPutGroup)
    //右边数据更新，可以要更新设计器
    useEffect(() => {
        if (rightFormChange) { 
            setList([...children])
        }
    }, [rightFormChange])
    //更新列表
    useLayoutEffect(() => {
        setList(children)
    }, [column.children])
    //column 更新 
    const updateList = (newChildren, index) => {
        if (index === void 0) {
            if (isSort(list, newChildren)) {
                parentUpdateList(newChildren)
            }
        } else if (newChildren) {
            const newList = update(list, {
                [index]: {
                    children: {
                        $set: newChildren
                    }
                }
            })
            parentUpdateList(newList)
        }
    }
    //拦截一下，单击放入
    const interceptClickPutTo = (newChildren, index) => {
        props.onUpdate?.()
        updateList(newChildren, index)
    }
    //点击添加
    useClickPutTo(activityColumn, {list, parent: column}, interceptClickPutTo)
    //聚焦，
    const onFocus = useCallback((evt) => {
        evt.stopPropagation()

        if ((column.uuid !== activityColumn.uuid)
            || (column.children?.length !== activityColumn.children?.length)
        ) {
            Bus.emit(BUS_KEYS.focus, column)
        }
    }, [column, activityColumn.uuid])
    //当前组件是否活跃
    const isActive = useMemo(() => {
        return activityColumn.uuid === column.uuid
    }, [activityColumn.uuid, column.uuid])
    //容器样式
    const containerStyle = useMemo(() => {
        const style = {
            border: isActive ? activityContainerBorder : defaultContainerBorder,
            backgroundColor: canPutbackgroundColor
        }
        if (column.usedType === UsedType.LAYOUT) {
            style.borderLeft = isActive ? activityDIVLeftBorder : defaultDIVLeftBorder
        }
        return style
    }, [column, isActive, canPutbackgroundColor])
    //元素样式
    const elementStyle = useMemo(() => {
        return {
            backgroundColor: isActive ? activityElementBgColor : defaultElementBgColor,
            color: isActive ? 'white' : '#696768',
            fontWeight: isActive ? 700 : 400
            // width: width
        }
    }, [column, isActive])
    //title樣式
    const titleStyle = useMemo(() => {
        return {
            backgroundColor: column.icon ? '#f5f5f5' : 'white',
            fontWeight: isActive && 'bold'
        }
    }, [column, isActive])
    //文案
    const text = useMemo(() => {
        return data.label || data.value || data.placeholder || data.type || column.title
    }, [data.label, data.value, data.placeholder, data.type, column.title])
    //event 方案
    const eventText = Object.keys(data).some(k => k.indexOf('@') === 0 || k === 'submit') ? '@' : ''

    const collapseStyle = useMemo(() => {
        if (column.usedType !== UsedType.LAYOUT) {
            return { left: 0 }
        } else {
            return { right: 0 }
        }
    }, [column.usedType])

    const collapse = useMemo(() => (
        isActive && <div
            className={'collapse'}
            onClick={() => { setClosed(c => !c) }}
            style={{ backgroundColor: '#409EFF', ...collapseStyle }}
        >
            {
                closed ? <div> <RightOutlined /> 展开 </div>
                    : <div> <DownOutlined /> 折叠 </div>
            }
        </div>
    ), [closed, isActive, collapseStyle])

    const tipContent = <>
        <b>{getShortTitle(column.title)}</b>
        {!!column.useTip && column.useTip}
        <div className={classnames('text-ellipsis', 'drag-item-container-title-tip')}>
            {data.name || data.ref || data.prop || data.label || data.tab || data.title || data.dataName}
        </div>
        <div className={'drag-item-container-title-evt'} title="事件">{eventText}</div>
    </>

    const elTopLeftText = useMemo(() => {
        return data.type || column.title
    }, [data.type, column.title])

    if (column.isContainer) {
        return <div className="drag-item-container"
            style={containerStyle}
            onMouseDown={onFocus}
            title={column.tooltip}
        >
            {collapse}
            {closed ? <div className='closed-content'>
                {tipContent}
            </div>
                : <>
                    {
                        column.usedType !== UsedType.LAYOUT ?
                            <div
                                className="drag-item-container-title"
                                style={titleStyle}
                            >
                                {tipContent}
                            </div>
                            : <div className="drag-item-container-layout-tip">
                                {isActive ?
                                    <div className="drag-item-container-layout-tip-select">{column.title}
                                        {!!column.useTip && column.useTip}
                                    </div>
                                    : <div className="drag-item-container-layout-tip-item" title={column.title}>
                                        {column.title[0]}
                                    </div>
                                }
                            </div>
                    }
                    <ReactSortable
                        sort
                        list={list}
                        animation={180}
                        className={classnames("container-sortable", {
                            vertical: data['~isVertical'],
                            horizontal: !data['~isVertical']
                        })}
                        group={{
                            push: true,
                            pull: false,
                            put: canPutGroup,
                            name: 'icontainer'
                        }}
                        onUpdate={props.onUpdate}
                        clone={(currentItem) => {
                            props.onUpdate?.()
                            return clone(currentItem, column)
                        }}
                        setList={newList => {
                            updateList(newList)
                        }}
                    >
                        {
                            list.map((el, key) => {
                                return <DragItem key={el.uuid}
                                    onUpdate={props.onUpdate}
                                    activityColumn={activityColumn}
                                    column={el}
                                    updateList={(newChildren) => {
                                        updateList(newChildren, key)
                                    }}
                                />
                            })
                        }
                    </ReactSortable>
                </>
            }
        </div >
    } else {
        return <div
            className="drag-item-element"
            style={elementStyle}
            onMouseDown={onFocus}
            title={column.tooltip}
            onClick={e => e.stopPropagation()}
        >
            <div className="drag-item-element-tip-type">
                {text !== elTopLeftText && <div className={classnames('text-ellipsis', 'drag-item-element-tip-type-item')} title={elTopLeftText}>
                    {elTopLeftText}
                </div>}
            </div>
            <div className="drag-item-element-tip-evt">
                <div className={'drag-item-element-tip-evt-item'} title="事件">
                    {eventText}
                </div>
            </div>
            <div className={classnames('text-ellipsis', 'drag-item-element-item')} title={text}>
                {data.rule && <span title={data.rule} style={{ color: 'red' }}>* </span>}
                {text}
            </div>
            <div className="drag-item-element-tip-prop">
                {
                    data.prop
                        ? <div
                            className={classnames('text-ellipsis', 'drag-item-element-tip-prop-item')}
                            title={data.prop}
                        >
                            {data.prop}
                        </div>
                        : <ExclamationCircleOutlined className="warning" title='可能需要配置字段名，没有字段名将不会数据收集与数值注入' />
                }
            </div>
        </div>
    }
}