import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Tabs, Button, Empty, Space, message } from 'antd';
import Design from './design';
import Preview, { previewTypes } from './preview';
import Code from './code';
import Api from './api';
import Less from './less';
import { dataListToDesignList, openTokenSet } from '../../utils/util'
import { SaveOutlined, FrownOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux';
import Bus, { BUS_KEYS } from 'views/light/bus';
import {
    setDefaultVarCompletions,
    setDefaultServiceCompletions,
    setDefaultFunctionCompletions,
    setGlobalDataCompletions,
    setDefaultRefCompletions
} from 'views/light/components/panel/component/renders';
import { InitCodeType, PAGE_ACTIVE_COLUMN_UUID } from 'views/light/types';
import { toInitCodeStates } from 'views/light/utils/icode';
import { setDesignListChange } from 'slices/eventSlice';
import { confirmUpdatePage, updatePage } from 'slices/pageSlice';
import { currentChooseKeys, inListenerClass, pressKeys } from 'views/light/config';
import { getConstNameByStr, parseURLParams } from 'libs/utils';
import history from 'libs/history';
import ErrorBoundary from 'components/ErrorBoundary';
import DragPreview from './components/dragpreview';
import DragDoc from './components/dragdoc'
import './index.less';

export const activeKeys = {
    design: 'design',
    preview: 'preview',
    code: 'code',
    api: 'api',
    less: 'less'
}

export default function Index(props) {
    const project = useSelector(state => state.project)
    const [loading, setLoading] = useState()
    const { activityColumn, onChangePanel } = props
    const [designList, setDesignList] = useState([])
    const [activityPanel, setActivityPanel] = useState(parseURLParams()[currentChooseKeys.designPanel] || activeKeys.design)
    const page = useSelector(selector => selector.page)
    const { componentDrag, rightFormChange, designListChange } = useSelector(state => state.event)
    const { activePanel, hasPermission } = useSelector(state => state.temporary)
    const dispatch = useDispatch()
    const saveRef = useRef()
    //需要保存
    const shouldSave = useMemo(() => designListChange.uuid !== null && hasPermission, [designListChange.uuid, hasPermission])
    saveRef.current = shouldSave
    //保存设计
    const saveDesignList = useCallback(async () => {
        if (page.pageId && hasPermission) {
            setLoading(true)
            await dispatch(updatePage(page.pageId))
            setLoading(false)
        }
    }, [page.pageId, hasPermission, dispatch])
    //切换面板改变
    const onChange = useCallback((key) => {
        setActivityPanel((pre) => {
            if (pre === activeKeys.design && pre !== key && shouldSave) {
                saveDesignList()
            }
            return key
        })
        onChangePanel && onChangePanel(key)
    }, [onChangePanel, shouldSave, saveDesignList])
    //數據發生變化
    const onUpdate = useCallback(() => {
        if (page.pageId) {
            dispatch(setDesignListChange({ uuid: page.pageId }))
        }
    }, [page.pageId, designList])
    //刷新未保存提示
    useEffect(() => {
        if (shouldSave) {
            const beforeunload = (evt) => {
                evt.preventDefault();
                evt.returnValue = '';
            }
            window.addEventListener('beforeunload', beforeunload)
            return () => {
                window.removeEventListener('beforeunload', beforeunload)
            }
        }
    }, [shouldSave])
    //更新最新數據，用於提示是否保持
    useEffect(() => {
        Bus.set(BUS_KEYS.designDataList, designList)

        if (rightFormChange.uuid !== null) { 
            onUpdate()
        }
        return () => {
            Bus.del(BUS_KEYS.designDataList)
        }
    }, [rightFormChange, designList])
    //页面数据
    useEffect(() => {
        if (activityColumn.uuid === PAGE_ACTIVE_COLUMN_UUID) {
            Bus.set(BUS_KEYS.pageData, activityColumn.data)
        }
    }, [rightFormChange, activityColumn])
    //活跃
    useEffect(() => {
        Bus.set(BUS_KEYS.activeUUID, activityColumn.uuid)
    }, [activityColumn])
    //组件被拽回到设计页面
    useEffect(() => {
        componentDrag && onChange(activeKeys.design)
    }, [componentDrag])
    //数据切换
    useEffect(() => {
        if (!page.pageDataList) {
            setDesignList([])
        } else {
            setDesignList(dataListToDesignList(JSON.parse(page.pageDataList)))
        }
    }, [page.pageId, page.pageDataList])
    //说明的时候到切换到设计页面
    useEffect(() => {
        if (activePanel) {
            onChange(activePanel)
        }
    }, [activePanel])
    //跟新代碼提示
    useEffect(() => {
        const { initCodes, services } = page
        const vars = [], fns = [], refs = []

        initCodes.forEach(el => {
            if (el.initCodeType === InitCodeType.VAR) {
                vars.push(el)
            } else if (el.initCodeType === InitCodeType.FN) {
                fns.push(el)
            } else if (el.initCodeType === InitCodeType.REF) {
                refs.push(el)
            }
        })
        setDefaultVarCompletions(vars.concat(toInitCodeStates(designList)))
        setDefaultFunctionCompletions(fns)
        setDefaultRefCompletions(refs)
        setDefaultServiceCompletions(services)
    }, [page.initCodes, page.services, designList, document.activeElement?.className])
    //global data提示
    useEffect(() => {
        const masterplateProjectData = project?.masterplateProject?.masterplateProjectData
        if (masterplateProjectData) {
            const constNames = getConstNameByStr(masterplateProjectData)
            setGlobalDataCompletions(constNames)
        }
    }, [project])
    //清掉不用数据
    useEffect(() => {
        const putEndKey = Bus.on(BUS_KEYS.putEnd, () => {
            if (activityPanel !== activeKeys.design) {
                onChange(activeKeys.design)
            }
        })
        const pressKey = Bus.on(BUS_KEYS.keypress, ({ key, evt }) => {
            switch (key) {
                case pressKeys.save:
                    shouldSave && saveDesignList()
                    evt.preventDefault();
                    break;
                case pressKeys.setToken:
                    openTokenSet()
                    evt.preventDefault();
                    break;
            }
        })
        //不能在preview页面，可能会有Freedomen配置（update）影响上传
        const updatePriviewStateKey = Bus.on(BUS_KEYS.updatePriviewState, (state) => {
            if (!state && activityPanel === activeKeys.preview) {
                onChange(activeKeys.design)
            }
        })
        return () => {
            Bus.remove(pressKey, putEndKey, updatePriviewStateKey)
        }
    }, [page.pageId, activityPanel, shouldSave])

    useEffect(() => {
        const unblock = history.block(({ pathname, search }) => {
            if (!saveRef.current || pathname === '/light/design') {
                return true
            } else {
                const backPath = pathname + search
                dispatch(confirmUpdatePage(page.pageId)).then(() => {
                    unblock?.()
                    setTimeout(() => {
                        history.push(backPath)
                    });
                });
                return false
            }
        })
        return () => { unblock?.() }
    }, [page.pageId])

    const emptyTips = useMemo(() => (
        <div className='emptyTips'>
            <ul>
                <li>按住 ctrl 单击组件模块对应内容查看其文档</li>
                <li>ctrl + c 复制选中</li>
                <li>ctrl + x 删除或剪切选中</li>
                <li>ctrl + v 将复制或剪切内容粘贴到当前选中内</li>
                <li>ctrl + z 撤销上一次操作</li>
                <li>ctrl + y 回到上一次操作</li>
                <li>ctrl + s 保存当前页面</li>
                <li>ctrl + q 打开设置Token、userId、http、提示等信息的弹窗</li>
            </ul>
        </div>
    ), [])

    const items = [
        {
            key: activeKeys.design,
            label: "设计",
            className: inListenerClass,
            children: <div className="panel-div">
                {page.pageId ? <div className="design-wrapper">
                    <Design
                        designList={designList}
                        activityColumn={activityColumn}
                        onChange={setDesignList}
                        onUpdate={onUpdate}
                    />
                    {
                        !designList.length &&
                        <div className="design-nodesign-tip">
                            <FrownOutlined style={{ fontSize: 48, marginBottom: 12 }} />
                            <div className="design-nodesign-tip-text">
                                空空如也，请选择左侧菜单的 组件模块，并将组件拖拽到此处
                            </div>
                            {emptyTips}
                        </div>
                    }
                </div> : <div className="design-nochoose-tip">
                    <Empty description="尚未选中任何页面，请点击左上角 选择要编辑的页面 选择页面" />
                    {emptyTips}
                </div>}
            </div>
        },
        {
            key: activeKeys.preview,
            label: "预览",
            children: activityPanel === activeKeys.preview && <div className='panel-div'>
                <ErrorBoundary title="数据解析失败">
                    <Preview designList={designList} />
                </ErrorBoundary>
            </div>
        },
        {
            key: activeKeys.code,
            label: "代码页",
            children: activityPanel === activeKeys.code && <div className='panel-div'>
                <Code designList={designList} />
            </div>
        },
        {
            key: activeKeys.api,
            label: "接口页",
            children: activityPanel === activeKeys.api && <div className='panel-div'>
                <Api designList={designList} />
            </div>
        },
        {
            key: activeKeys.less,
            label: "样式页",
            children: activityPanel === activeKeys.less && <div className='panel-div'>
                <Less designList={designList} />
            </div>
        }
    ]

    return <div className="center-body">
        {
            page.pageId && <DragPreview visible={activityPanel === activeKeys.design}>
                <ErrorBoundary title="数据解析失败">
                    <Preview designList={designList} type={previewTypes.design} />
                </ErrorBoundary>
            </DragPreview>
        }
        <DragDoc visible={activityPanel === activeKeys.design} />

        <Tabs
            items={items}
            onChange={onChange}
            activeKey={activityPanel}
            tabBarStyle={{ marginBottom: 0 }}
            tabBarExtraContent={
                hasPermission ? <Space>
                    <Button
                        size="small"
                        type="primary"
                        onClick={() => {
                            message.info("你好， 我是智障小呆，我现在什么都不会，还在学习中，请等我学成归来~")
                        }}
                    >
                        AI 小呆
                    </Button>
                    <Button
                        loading={loading}
                        size="small"
                        type="primary"
                        onClick={saveDesignList}
                        disabled={!shouldSave}
                        style={{ marginRight: 8 }}
                        icon={<SaveOutlined />}
                    >
                        保存
                    </Button>
                </Space> : <Button
                    size="small"
                    disabled
                    style={{ marginRight: 8 }}
                >
                    预览模式
                </Button>
            }
        />
    </div>
}