import { useState, useEffect, useLayoutEffect } from 'react'
import { Modal, Tabs } from 'antd';
import { Form, Dialog } from 'freedomen'
import uniqueId from 'lodash/uniqueId'
import CodeEdit from 'components/CodeEditor'
import { setRightFormChange } from 'slices/eventSlice';
import { useDispatch, useSelector } from 'react-redux';
import { renderJs, renderLess } from 'components/codeText'
import Draggable from "draggable"
import className from 'classnames'
import styles from './index.module.less'
import Bus, { BUS_KEYS } from 'views/light/bus';
import { DocDialogName } from 'views/light/config';
import { setChainValueByString } from 'views/light/utils/util';

var currentProp = null
var currentValue = null
var preValue = null
const config = {
    layout: 'vertical',
    labelCol: undefined,
}
const tabKeys = {
    base: '0',
    more: '1',
    style: '2'
}

function getSubString(str, len = 380) {
    if (!str || str.length < len) return str

    return str.substring(0, len) + "..."
}

export default function Right(props) {
    const { activityColumn } = props

    const { masterplateProject } = useSelector(state => state.project)
    const [defaultBase, setDefaultBase] = useState([])
    const [activeKey, setActiveKey] = useState()
    const [baseColumns, setBaseColumns] = useState([])
    const [moreColumns, setMoreColumns] = useState([])
    const [styleColumns, setStyleColumns] = useState([])
    const [formData, setFormData] = useState({})
    const dispatch = useDispatch()

    const [key, setKey] = useState(uniqueId)
    //处理缺省页面配置显示
    useEffect(() => {
        const base = []
        const {
            masterplateProjectData, masterplateProjectFreedomenConfig, masterplateProjectStyle,
            //axios
            masterplateProjectBaseUrl, masterplateProjectTokenName, masterplateProjectContentType
        } = masterplateProject

        if (masterplateProjectTokenName) {
            base.push({
                label: 'Token名',
                value: getSubString(masterplateProjectTokenName),
                render: renderJs
            })
        }

        if (masterplateProjectBaseUrl) {
            base.push({
                label: '服务器基本路径',
                value: getSubString(masterplateProjectBaseUrl),
                render: renderJs
            })
        }

        if (masterplateProjectContentType) {
            base.push({
                label: '到服务端的数据类型',
                value: getSubString(masterplateProjectContentType),
                render: renderJs
            })
        }

        if (masterplateProjectData) {
            base.push({
                label: '全局数据',
                value: getSubString(masterplateProjectData),
                render: renderJs
            })
        }
        if (masterplateProjectFreedomenConfig) {
            base.push({
                label: 'Freedomen 配置',
                value: getSubString(masterplateProjectFreedomenConfig),
                render: renderJs
            })
        }
        //加载一下项目模板的样式
        if (masterplateProjectStyle) {
            base.push({
                label: '全局样式',
                value: getSubString(masterplateProjectStyle),
                render: renderLess
            })
        }

        if (base.length) {
            base.splice(0, 0, {
                render: () => <b>当前项目母版配置展示：</b>
            })
        }

        setDefaultBase(base)
    }, [masterplateProject])

    useLayoutEffect(() => {
        const { base = defaultBase, more = [], style = [] } = activityColumn.props || {}
        setKey(uniqueId())
        
        setBaseColumns(base)
        setMoreColumns(more)
        setStyleColumns(style)
        setFormData(activityColumn.data)

        setActiveKey(key => {
            const ms = [base.length, more.length, style.length]
            if (!key || !ms[Number(key)]) {
                return String(ms.findIndex(i => i))
            }
            return key
        })

        const useKey = Bus.on(BUS_KEYS.useCode, ({ key, value }) => {
            Dialog.close(DocDialogName)
            setChainValueByString(activityColumn.data, key, value)
            setKey(uniqueId())
            setFormData({ ...activityColumn.data })
            dispatchRightFormChange(activityColumn)
        })
        return () => {
            Bus.remove(useKey)
        }
    }, [activityColumn, defaultBase])

    const formEvent = ({ type, value, prop }) => {
        if (type === 'dbclick') {
            currentProp = prop
            currentValue = value.value
            preValue = value.value

            Dialog.open('code', { title: `代码编辑` }).then(s => {
                setTimeout(() => {
                    const ele = document.querySelector(".drag-dialog");
                    ele && new Draggable(ele, {
                        // 拖拽handle设置为Modal头部，不设置此参数表示整个Modal都可拖拽
                        handle: document.querySelector(".ant-modal-header")
                    });
                });

                return s(
                    <div style={{ marginTop: -12 }}>
                        <div className="des">
                            提示：输入$ 会有可使用的变量或函数等提示，输入tip: 会有属性等提示
                        </div>
                        <CodeEdit
                            focus
                            {...value}
                            style={{ width: 850, marginTop: 5 }}
                            onChange={value => {
                                currentValue = value
                            }}
                        />
                    </div>
                )
            })
        } else if (type === 'change') {
            prop && setChainValueByString(activityColumn.data, prop, value)
            dispatchRightFormChange(activityColumn)
        }
    }

    const dispatchRightFormChange = (column) => {
        const { uuid } = column
        //column 内容太多，只存 UUID
        dispatch(setRightFormChange({ uuid }))
    }

    const applyChange = () => { 
        setChainValueByString(activityColumn.data, currentProp, currentValue)
        dispatchRightFormChange({ uuid: activityColumn.uuid })
        setKey(uniqueId())
        setFormData({ ...activityColumn.data })
    }

    const items = []

    if (baseColumns.length) {
        items.push({
            key: tabKeys.base,
            label: "常用",
            children: <div className={className(styles["right-body-panel"], "scroll-bar")}>
                {activeKey === tabKeys.base && <Form
                    key={key}
                    data={formData}
                    config={config}
                    onEvent={formEvent}
                    columns={baseColumns}
                />}
            </div>
        })
    }
    if (moreColumns.length) {
        items.push({
            key: tabKeys.more,
            label: "更多",
            children: <div className={className(styles["right-body-panel"], "scroll-bar")}>
                {activeKey === tabKeys.more && <Form
                    key={key}
                    data={formData}
                    onEvent={formEvent}
                    config={config}
                    columns={moreColumns}
                />}
            </div>
        })
    }
    if (styleColumns.length) {
        items.push({
            key: tabKeys.style,
            label: "样式",
            children: <div className={className(styles["right-body-panel"], "scroll-bar")}>
                {activeKey === tabKeys.style && <Form
                    key={key}
                    data={formData}
                    onEvent={formEvent}
                    config={config}
                    columns={styleColumns}
                />}
            </div>
        })
    }

    return <div className={styles["right-body"]}>
        <Dialog
            name="code"
            title="代码编辑"
            className="drag-dialog"
            width={900}
            config={{ maskClosable: false, okText: '应用' }}
            onOk={applyChange}
            onCancel={_ => {
                if (preValue !== currentValue) {
                    Modal.confirm({
                        content: "检测到数据变化并且未应用，是否应用修改？",
                        onOk() {
                            applyChange()
                        }
                    })
                }
            }}
        />
        <Tabs activeKey={activeKey} items={items} onChange={setActiveKey} />
    </div>
}