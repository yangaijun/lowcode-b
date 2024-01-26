import { useState, useMemo, useEffect, useCallback } from 'react'
import Page from './page'
import Component from './component'
import Model from './model'
import PreCode from './precode'
import Api from './api'
import Document from './document'
import File from './file'
import classnames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { Drawer, message } from 'antd'
import { setPageVisble } from 'slices/temporarySlice'
import { Dialog, Form } from 'freedomen'
import { configColumns } from 'views/lib/public/masterplate/project/detail'
import { getConstNameByStr, parseURLParams, replaceOrAddQuery } from 'libs/utils'
import { setGlobalDataCompletions, setGlobalTmpCompletions } from './component/renders'
import ApiMasterplateProject from 'services/masterplate_project';
import ApiMasterplatePage from 'services/masterplate_page';
import { setProject } from 'slices/projectSlice';
import history from 'libs/history';
import { currentChooseKeys } from 'views/light/config';
import { FdGlobalDataEditor } from 'components/Editors';
import styles from './index.module.less'

export const initSelectPage = {
    selectedKeys: []
}

function getTemplateValue(value, msg) {
    try {
        return (new Function("return " + value))()
    } catch (e) {
        if (msg) {
            message.error(msg)
        }
        return null
    }
}

function setTemplateTip(strValue) {
    let objValue = getTemplateValue(strValue)
    if (objValue) {
        window.$temp = objValue
        setGlobalTmpCompletions(objValue)
    }
}

function clearTemplateTip() {
    delete window.$temp
    setGlobalTmpCompletions({})
}

export default function Index(props) {
    const { projectId, activityColumn } = props

    const { masterplatePageId, ...rst } = parseURLParams()
    const [current, setCurrent] = useState(rst[currentChooseKeys.fnName])
    const { selectPage } = useSelector(state => state.page)
    const { pageVisible } = useSelector(state => state.temporary)
    const { masterplateProject } = useSelector(state => state.project)
    const { hasPermission } = useSelector(state => state.temporary)
    const [formData, setFormData] = useState()
    const [masterplatePage, setMasterplatePage] = useState({})
    const dispatch = useDispatch()

    const fns = useMemo(() => {
        const models = [
            {
                name: 'component',
                tooltip: '组件',
                icon: 'iconfont icon-zujian'
            }, {
                name: 'template',
                tooltip: '变量模板(template)',
                icon: 'iconfont icon-template',
                isBtn: true
            }, {
                name: 'model',
                tooltip: '模块',
                icon: 'iconfont icon-mokuai'
            }, {
                name: 'precode',
                tooltip: '预定义',
                icon: 'iconfont icon-program-code'
            }, {
                name: 'api',
                tooltip: '接口',
                icon: 'iconfont icon-APIguanli'
            }, {
                name: 'file',
                tooltip: '静态文件',
                icon: 'iconfont icon-tupiantianjia'
            }, {
                name: 'setting',
                tooltip: '项目母版设置',
                icon: 'iconfont icon-peizhi',
                isBtn: true
            }
            // , {
            //     name: 'document',
            //     tooltip: '文档',
            //     icon: 'iconfont icon-wendang'
            // }
        ]

        return models.filter(el => {
            if ((!masterplateProject?.masterplateProjectId || !hasPermission) && el.name === 'setting') {
                return false
            }
            if (!projectId && ['model', 'file'].includes(el.name)) {
                return false
            } else if (projectId && ['template'].includes(el.name)) {
                return false
            }
            return true
        })
    }, [selectPage, masterplateProject, hasPermission, projectId])

    useEffect(() => {
        if (!current) {
            setCurrent(fns[0].name)
        }
    }, [current, fns])

    useEffect(() => {
        setFormData({ ...masterplateProject })
    }, [masterplateProject])

    useEffect(() => {
        if (masterplatePageId) {
            ApiMasterplatePage.selectById(masterplatePageId).then(res => {
                setTemplateTip(res.masterplatePageTmp)
                setMasterplatePage(res)
            })

            return () => {
                clearTemplateTip()
            }
        }
    }, [masterplatePageId])

    const getTmpForm = (formData) => {
        return <div>
            任何地方用到的模版名，代码生成时会被对应值替换。如：{`{ ps: 'pageSize' }`}，使用：$temp.ps
            <Form
                data={formData}
                style={{ marginTop: 2 }}
                onSubmit={data => {
                    const masterplatePageTmp = getTemplateValue(data.masterplatePageTmp, "语法格式错误！")

                    if (masterplatePageTmp) {
                        Dialog.loading("template")
                        ApiMasterplatePage.insertOrUpdate(data).then(res => {
                            setTemplateTip(data.masterplatePageTmp)
                            setMasterplatePage(data)

                            message.success("保存成功！")
                            Dialog.close("template")
                        })
                    }
                }}
                columns={[
                    { render: FdGlobalDataEditor, prop: 'masterplatePageTmp', placeholder: "const $temp = {}" },
                ]}
            />
        </div>
    }

    const getPanelBody = useCallback((k, Dom) => {
        return <div style={{ display: current === k ? 'block' : 'none' }}>
            {Dom}
        </div>
    }, [current])

    return (
        <>
            <div className={styles["panel-model"]}>
                {
                    fns.map(fn => {
                        return <div key={fn.name} title={fn.tooltip} onClick={_ => {
                            if (fn.isBtn) {
                                if (fn.name === 'setting') {
                                    Dialog.open("config")
                                } else if (fn.name === 'template') {
                                    Dialog.open("template").then(set => set(getTmpForm({ ...masterplatePage })))
                                }
                            } else {
                                history.replace(replaceOrAddQuery({ [currentChooseKeys.fnName]: fn.name }))
                                setCurrent(fn.name)
                            }
                        }} className={classnames({ [styles['panel-activity']]: current === fn.name })}>
                            <i className={fn.icon} />
                        </div>
                    })
                }
            </div>
            <div className={styles["panel-body"]}>
                {
                    getPanelBody('component', <Component />)
                }
                {
                    getPanelBody('model', <Model activityColumn={activityColumn} />)
                }
                {
                    getPanelBody('api', <Api />)
                }
                {
                    getPanelBody('precode', <PreCode />)
                }
                {
                    getPanelBody('file', <File />)
                }
                {
                    getPanelBody('document', <Document />)
                }
            </div>
            <Dialog name="template" width={820} title="变量模型定义" />
            <Dialog name="config" width={820} title="当前使用的项目母版配置" onCancel={() => {
                setFormData({ ...masterplateProject })
            }}>
                <Form
                    className='dialog-content'
                    data={formData}
                    onSubmit={data => {
                        if (data.masterplateProjectData) {
                            try {
                                data.masterplateProjectData = window.codeFormart(data.masterplateProjectData)
                            } catch (error) {
                                message.error('全局数据语法错误，请检查！')
                                return
                            }
                        }
                        if (data.masterplateProjectFreedomenConfig) {
                            try {
                                data.masterplateProjectFreedomenConfig = window.codeFormart(data.masterplateProjectFreedomenConfig)
                            } catch (error) {
                                message.error('freedomen配置语法错误，请检查！')
                                return
                            }
                        }
                        Dialog.loading('config')
                        ApiMasterplateProject.insertOrUpdate(data).then(_ => {
                            message.success('项目母版配置修改成功!')
                            dispatch(setProject({ masterplateProject: { ...data } }))
                            Dialog.close("config")
                        })
                    }}
                    onEvent={(params) => {
                        if (params.type === 'blur' && params.prop === 'masterplateProjectData') {
                            setGlobalDataCompletions(getConstNameByStr(params.value), false)
                        }
                    }}
                    config={{ layout: 'vertical', labelCol: undefined }}
                    columns={configColumns}
                />
            </Dialog>
            <Drawer
                forceRender
                width={307}
                bodyStyle={{ padding: 11 }}
                closable={false}
                placement="left"
                open={pageVisible}
                onClose={() => {
                    dispatch(setPageVisble(false))
                }}
            >
                <Page />
            </Drawer>
        </>
    )
}