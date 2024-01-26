import { useState, useEffect, useRef } from 'react'
import { Alert, Collapse, message, Tag } from 'antd'
import { CaretRightOutlined } from '@ant-design/icons';
import { ReactSortable } from 'react-sortablejs';
import { getDataList } from './config'
import Bus, { BUS_KEYS } from 'views/light/bus'
import { useDispatch } from 'react-redux';
import { setComponentDrag } from 'slices/eventSlice';
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ComponentType } from 'views/light/types';
import { useIKnow, useLongKeyDown } from 'hooks';
import { openPage } from 'slices/temporarySlice';
import { libTabKey } from 'components/columns';
import { messageAndConfirmLabel } from './doc';
import ILink from 'components/ILink';
import cn from 'classnames'
import styles from './index.module.less'
import { testInInputActiveElement } from 'views/light/utils/util';

const { Panel } = Collapse;

const iknowKey = "iknowcomp"

const hasString = (mstr = "", sstr = "") => {
    return sstr !== '' && mstr.toUpperCase().indexOf(sstr.toUpperCase()) === 0
}

const clearTimer = (timer) => {
    timer && clearInterval(timer)
}

export default function Index() {
    const dispatch = useDispatch()
    const [pressKey, setPressKey] = useState('')
    const { hasPermission } = useSelector(state => state.temporary)
    const { pageId } = useSelector(state => state.page)
    const { projectId } = useSelector(state => state.project)
    const cachePresskey = useRef("")
    const [comps, setComps] = useState(() => getDataList())
    const { ctrlKey } = useLongKeyDown()

    useEffect(() => {
        let timer
        const key = Bus.on(BUS_KEYS.keypress, ({ key }) => { 
            if (testInInputActiveElement() || key?.length !== 1) return

            cachePresskey.current += key.toUpperCase()
            setPressKey(cachePresskey.current)
            clearTimer(timer)
            timer = setInterval(() => {
                cachePresskey.current = ""
            }, 600)
        })
        return () => {
            clearTimer(timer)
            Bus.remove(key)
        }
    }, [clearTimer])

    useEffect(() => {
        const key = Bus.on(BUS_KEYS.componentList, () => {
            setComps(getDataList())
        })
        return () => {
            Bus.remove(key)
        }
    }, [])

    const { iKnow, confirm } = useIKnow(iknowKey)

    return <div className={styles["left-body"]}>
        {!iKnow && <Alert type='info' message="点击或拖拽到设计容器，按住ctrl单击查看相关文档" closable className={styles['alert']} onClose={confirm} />}
        <div className={styles["messageAndConfirm"]}>
            {messageAndConfirmLabel} <ILink url={'/doc/light/component'} fontSize={12}>更多文档</ILink>
            {pressKey ?
                <Tag closable color="geekblue" onClose={(e) => {
                    setPressKey("")
                    e.preventDefault()
                }} >
                    {pressKey.substring(0, 6)}
                </Tag>
                :
                <span style={{ color: '#ccc', fontSize: 10 }}>press key filter</span>
            }
        </div> 
        <Collapse
            ghost
            bordered={false}
            defaultActiveKey={[0, 1, 2, 3, 4]}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        >
            {
                comps.map((el, key) => {
                    return <Panel header={el.title} key={key} >
                        <ReactSortable
                            group={{
                                put: false,
                                pull: 'clone',
                                name: el.group
                            }}
                            sort={false}
                            list={el.children}
                            setList={_ => { /**donothing*/ }}
                            style={{ marginTop: -10 }}
                            onStart={(e) => {
                                if (!pageId) {
                                    dispatch(openPage(true))
                                }

                                dispatch(setComponentDrag({ group: el.group, type: el.children[e.oldIndex].type }))
                            }}
                            onEnd={(e) => {
                                if (pageId && !e.pullMode && e.from !== e.to) {
                                    message.warning({
                                        title: '提示',
                                        content: <>无法放入，点击对应标题查看详情！</>
                                    })
                                }

                                Bus.emit(BUS_KEYS.putEnd)
                                dispatch(setComponentDrag(null))
                            }}
                        >
                            {
                                el.children.map((child, key) => {
                                    return <div
                                        key={key}
                                        className={cn(styles["item"], {
                                            [styles["custom-item"]]: child.isCustom
                                        })}
                                        title={child.tooltip}
                                        style={{
                                            border: hasString(child.title, pressKey) && '1px solid #40A9FF',
                                            display: !pressKey || hasString(child.title, pressKey) ? "inline-block" : "none"
                                        }}
                                        onClick={_ => {
                                            _.stopPropagation()
                                            if (!pageId) {
                                                dispatch(openPage(true))
                                            } else {
                                                Bus.emit(BUS_KEYS.putEnd, child)
                                            }
                                        }}
                                    >
                                        {child.hasNewVersion && <div className={styles["hasNew"]} title='有新版本，点击添加更多可更新'></div>}
                                        {child.icon && <span className={child.icon} style={{ fontSize: 12, marginRight: 6, color: '#666' }} />}
                                        {child.title}
                                        {ctrlKey && <Link className={cn(styles["cmpDoc"], styles["cmpDocShow"])} to={child.docLink} target="_blank" onClick={e => e.stopPropagation()}>
                                            {child.title}文档
                                        </Link>}
                                    </div>
                                })
                            }
                        </ReactSortable>
                        {
                            hasPermission && ['element', 'container'].includes(el.group) && <Link
                                to={`/lib?type=${libTabKey.comp}&projectId=${projectId}&plugType=${el.group === 'element' ? ComponentType.element : ComponentType.container}`}
                                target="_blank"
                                className={cn(styles["item"], styles["add"])}
                                title="添加或更新更多外部组件"
                            >
                                添加更多
                            </Link>
                        }
                    </Panel>
                })
            }
        </Collapse>
    </div>
}