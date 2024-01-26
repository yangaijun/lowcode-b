import { useState, useEffect, useRef, useMemo } from 'react'
import Bus, { BUS_KEYS } from './bus'
import Panel from './components/panel'
import Center, { activeKeys } from './components/center'
import Right from './components/right'
import { useDispatch, useSelector } from 'react-redux'
import { clearUserProjectMenuPaths, resetPage, setModelInfo, setPageInfo, setSelectPage } from 'slices/pageSlice'
import history from 'libs/history'
import ApiProject from 'services/project'
import { resetProject, setProject } from 'slices/projectSlice'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { DesignType, PAGE_ACTIVE_COLUMN_UUID } from './types'
import { openPage, resetPermission, resetTemporary, setDesignInfo, setPermission } from 'slices/temporarySlice'
import { currentChooseKeys, interceptPressKeys } from './config'
import { debounce } from 'lodash'
import { createGolbalStyleFromLessString, deleteGolbalStyle } from './components/center/preview/lessUtil'
import { getSubString, testInInputActiveElement } from './utils/util'
import { Button, Popconfirm } from 'antd'
import ApiPlugUse from 'services/plug_use'
import ApiPlug from 'services/plug'
import LOGO from 'imgs/logo.png'
import styles from './index.module.less'
import { getPageConfigItem } from './components/panel/component/config'
import user from 'libs/user'
import { useProject } from 'hooks'
import { getChannel, parseURLParams, replaceOrAddQuery } from 'libs/utils'
import { appendRuleCompletions } from './components/panel/component/renders'
import { resetRightAndDesignChange } from 'slices/eventSlice'
import utils from 'freedomen/utils/util'

const iknowKey = "iknowpmenu"

function selectPagetoNum(sp) {
    if (sp) {
        return {
            pageId: Number(sp.pageId),
            selectedKeys: sp.selectedKeys.map(item => Number(item))
        }
    }
}

export default function Index() {
    let {
        pn,
        projectId,
        designType,
        pageId,
        mpId,
        ...rest
    } = parseURLParams();

    if (designType) {
        designType = Number(designType)
    }

    if (pageId) {
        pageId = Number(pageId)
    }

    const dispatch = useDispatch()
    const dpk = rest[currentChooseKeys.designPanel]
    const [showRightPanel, setShowRightPanel] = useState(!dpk || dpk === activeKeys.design)
    const [activityColumn, setActivityColumn] = useState({})
    const page = useSelector(state => state.page)
    const [showTip, setShowTip] = useState(false)
    const lockRef = useRef(true)
    const { pageVisible, hasPermission } = useSelector(state => state.temporary)
    const project = useProject(projectId, mpId)
    const { masterplateProject } = useSelector(state => state.project)

    useEffect(() => {
        //页面菜单打开过才可以解锁
        if (pageVisible) {
            lockRef.current = false
            return
        }

        if (!lockRef.current) {
            if (!pageVisible && !user.getIknow(iknowKey)) {
                lockRef.current = true
                setShowTip(true)
            }
        }
    }, [pageVisible])

    useEffect(() => {
        if (page.pageId) {
            //有选中，初始化当前页面数据
            setActivityColumn(getPageConfigItem({
                uuid: PAGE_ACTIVE_COLUMN_UUID,
                isContainer: true,
                pageStyle: page.pageStyle,
                pageClass: page.pageClass,
                pageLess: page.pageLess
            }))
        } else {
            setActivityColumn({})
        }
    }, [page.pageId])

    useEffect(() => {
        if (designType === DesignType.MASTERPLATE) {
            dispatch(setPageInfo({ pageId }))
            dispatch(setDesignInfo({ designType, pageId }))
        }

        const focusStart = Bus.on(BUS_KEYS.focus, function (column) {
            //不要删除，防止属性配置表单的onChange不触发
            setTimeout(() => {
                setActivityColumn(column)
            });
        })

        return () => {
            dispatch(resetPage())
            dispatch(resetProject())
            dispatch(resetTemporary())

            Bus.remove(focusStart)
        }
    }, [designType, pageId])

    useEffect(() => {
        const emit = debounce((key, evt) => {
            Bus.emit(BUS_KEYS.keypress, { key, evt })
        }, 100, { leading: true, trailing: false })

        const onKeydown = (evt) => {
            if (testInInputActiveElement()) return

            const key = `${evt.ctrlKey ? 'CTRL' : ''}${evt.key?.toUpperCase()}`
            if (interceptPressKeys.includes(key)) {
                emit(key, evt)
            } else {
                Bus.emit(BUS_KEYS.keypress, evt)
            }
        }
        document.addEventListener('keydown', onKeydown, true)
        return () => {
            document.removeEventListener('keydown', onKeydown, true)
        }
    }, [window.document.activeElement?.className])

    useEffect(() => {
        if (project) {
            dispatch(setProject(project))
            dispatch(setModelInfo(project.projectId))

            const addOrUpdateModelOkKey = Bus.on(BUS_KEYS.addOrUpdateModelOk, () => {
                dispatch(setModelInfo(project.projectId))
            })

            return () => {
                Bus.remove(addOrUpdateModelOkKey)
            }
        }
    }, [project])

    useEffect(() => {
        createGolbalStyleFromLessString(masterplateProject?.masterplateProjectStyle)
        //rule提示
        if (masterplateProject?.masterplateProjectFreedomenConfig) {
            const freedomen = {
                setDefaultConfigs() { },
                setDefaultStyles() { },
                setDefaultClasses() { },
                setDisabled() { },
                setPermission() { },
                registerRules(rule) {
                    if (utils.isPlainObject(rule)) {
                        appendRuleCompletions(Object.keys(rule))
                    }
                }
            }
            try {
                new Function('Freedomen', masterplateProject.masterplateProjectFreedomenConfig)(freedomen)
            } catch (e) {
                console.log("加载自定义配置失败：" + e)
            }
        }
        return () => {
            deleteGolbalStyle()
        }
    }, [masterplateProject])

    useEffect(() => {
        const selectPage = selectPagetoNum(rest[currentChooseKeys.selectPage])
        const setDefaultPage = () => {
            if (selectPage) {
                dispatch(setSelectPage(selectPage))
                dispatch(setPageInfo(selectPage))
            }
        }
        if (!selectPage && !pageId) {
            dispatch(openPage())
        }

        let channel = null
        if (projectId) {
            const loadApiPlugUse = () => {
                ApiPlugUse.selectByProjectId(projectId).then(res => {
                    const plugSameIds = res.map(el => el.plugSameId)
                    //查找全部版本
                    ApiPlug.selectBySameIds(plugSameIds).then(plugs => {
                        const pmap = {}

                        plugs.map(plug => {
                            const mapVersion = pmap[plug.plugSameId]

                            if (!mapVersion || mapVersion < plug.plugVersion) {
                                pmap[plug.plugSameId] = plug.plugVersion
                            }
                        })
                        //组件是否有新版本可以更新
                        res.forEach(puse => {
                            if (pmap[puse.plugSameId] > puse.plugUseVersion) {
                                puse.hasNewVersion = true
                            }
                        })
                        Bus.set(BUS_KEYS.componentList, res)
                        setDefaultPage()
                    })
                })
            }
            loadApiPlugUse()
            channel = getChannel()
            channel.onmessage = (e) => {
                if (e.data === 'loadApiPlugUse') {
                    loadApiPlugUse()
                }
            }
        } else {
            setDefaultPage()
        }

        return () => {
            channel?.close()
            dispatch(resetRightAndDesignChange())
            dispatch(clearUserProjectMenuPaths())
            Bus.set(BUS_KEYS.componentList, [])
        }
    }, [projectId])
    //接下来的权限页面的权限
    useEffect(() => {
        ApiProject.permission({ projectId, pageId }).then(res => {
            dispatch(setPermission(res))
        })

        return () => {
            dispatch(resetPermission())
        }
    }, [projectId, pageId])

    const centerRender = useMemo(() => {
        return <Center
            onChangePanel={name => {
                history.replace(replaceOrAddQuery({
                    [currentChooseKeys.designPanel]: name
                }))

                setShowRightPanel(name === 'design')
            }}
            activityColumn={activityColumn}
        />
    }, [activityColumn])

    const rightRender = useMemo(() => {
        return showRightPanel && <Right activityColumn={activityColumn} />
    }, [showRightPanel, activityColumn])

    return <div className={styles.main}>
        <div className={styles.left}>
            <div className={styles.header}>
                <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => {
                    history.goBack()
                }}></Button>
                <span className={styles.logo} onClick={_ => {
                    history.push('/home')
                }}>
                    <img src={LOGO} alt="首页" title='首页' />
                </span>
                <div className={styles.page}>
                    <Popconfirm
                        open={showTip}
                        title="此处可以打开页面菜单！"
                        okText="知道了，不在提示"
                        onCancel={() => { setShowTip(false) }}
                        onConfirm={() => {
                            user.setIknow(iknowKey)
                            setShowTip(false)
                        }}
                    >
                        <Button type='text'
                            className={styles.grey}
                            size='small'
                            shape='round'
                            onClick={() => {
                                projectId && dispatch(openPage())
                            }}
                        >
                            {
                                projectId
                                    ? <div title={page.pageName}>
                                        {getSubString(page.pageName || `选择要${hasPermission ? "编辑" : "预览"}的页面`, 12)}
                                    </div>
                                    : <div style={{ color: '#333', maxWidth: 160 }} title={pn} className="text-ellipsis">
                                        {pn}
                                    </div>
                            }
                        </Button>
                    </Popconfirm>
                </div>
            </div>
            <div className={styles.panel}>
                <Panel projectId={projectId} activityColumn={activityColumn} />
            </div>
        </div>
        {centerRender}
        {rightRender}
    </div>
}