import { useState, useEffect, useCallback } from 'react'
import { Modal, Button, Spin, Empty, Affix, Space, Badge, message } from 'antd'
import { Dialog, Form } from 'freedomen'
import ApiProject from 'services/project'
import ApiMasterProject from 'services/masterplate_project'
import ApiMasterPage from 'services/masterplate_page'
import { PlusCircleOutlined } from '@ant-design/icons'
import { libTabKey, masterplateProjectId } from 'components/columns'
import classnames from 'classnames'
import ProjectCard from 'components/ProjectCard'
import { downloadProject, toDesign } from 'libs/utils'
import { TypeType } from 'views/light/types'
import styles from './index.module.less'
import user from 'libs/user'
import { HttpErrorData } from 'libs/axios'
import Igpt from './igpt'

export default function Index() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [aiOpen, setAiOpen] = useState(false)

    const loadData = useCallback(() => {
        ApiProject.select({ projectType: 'private' }).then(res => {
            setProjects(res)
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        loadData()
    }, [])

    function projectForm(formData) {
        formData.type = 1

        return <Form
            data={formData}
            onSubmit={data => {
                Dialog.loading('projectDialog')
                ApiProject.insertOrUpdate(data).then(_ => {
                    setLoading(true)
                    Dialog.close('projectDialog')
                    loadData()
                })
            }}
            columns={[
                // {
                //     type: 'radios-button',
                //     prop: 'type',
                //     label: "类型",
                //     options: { 1: "空项目", 2: "克隆项目" },
                //     config: { buttonStyle: "solid", help: "克隆项目，可以复制自己的项目或别人开放的项目进行修改" },
                //     load: ({ data }) => !data.projectId
                // },
                { type: 'input', label: '项目名称', prop: 'projectName', placeholder: '请输入项目名称', rule: { 'must': '项目名称为必填项', 'name': '不能有特殊字符' }, config: { maxLength: 10 } },
                {
                    type: 'select',
                    prop: 'parentId',
                    label: '父项目',
                    rule: 'must',
                    placeholder: '请选择要克隆的项目，输入id搜索',
                    options({ resolve }) {
                        ApiProject.selectPublic().then(res => {
                            resolve(res.map(el => {
                                return {
                                    label: el.projectName,
                                    value: el.projectId,
                                    option: <div>
                                        ID:{el.projectId}，名称：{el.projectName}{el.projectType === TypeType.public && el.userId !== user.getUserId() && " (公共)"}
                                    </div>
                                }
                            }))
                        })
                    },
                    config: {
                        filterable: true,
                        help: <>
                            选择可以克隆的项目作为基础项目, 可以到
                            <Button type='link' size='small' target='_blank' href={`#/lib?type=${libTabKey.project}`} >公共项目</Button>
                            中查看相关详情
                        </>
                    },
                    load: ({ data }) => data.type === 2
                },
                // { type: 'select', prop: 'projectType', label: '项目类型', options: { [TypeType.private]: "私有", [TypeType.public]: '公共' }, config: { help: '私有只有自己可以看到，公共的别人可以克隆并使用' } },
                { type: 'input-area', prop: 'projectDes', label: '描述', placeholder: '请输入项目描述', config: { maxLength: 225, rows: 4 } },
                masterplateProjectId,
                // [
                //     masterplateProjectId,
                //     [
                //         { type: 'switch', prop: 'generate', disabled: true },
                //         { type: 'text@tip', value: '开启后，连接数据库可以直接根据表信息自动生成所有页面' },
                //         { type: 'formitem', label: '自动生成', load: ({ data }) => !data.projectId }
                //     ], [
                //         masterplatePageId,
                //         { type: 'input', label: '字段过滤', prop: 'colFilter', placeholder: '如 id, create 多个以英文逗号隔开, ', config: { help: '在生成时，会跳过相应(包含关系，不分大小写)字段' } },
                //         { type: 'select', prop: 'generateRule', label: '生成规则', options: "缺省,医疗行业,建筑行业", value: '缺省' },
                //         { type: 'input', label: '数据源地址', prop: 'databaseUrl', placeholder: '地址:端口/库名，如：115.150.65.190:3306/demo' },
                //         { type: 'input', label: '用户名', prop: 'databaseUsername', placeholder: '登录账号，如：root' },
                //         { type: 'input-password', label: '密码', prop: 'databasePassword', placeholder: '登录数据库密码' },
                //         { type: 'fragment', load: ({ data }) => data.generate }
                //     ],
                //     { type: 'fragment', load: ({ data }) => data.type === 1 }
                // ]
            ]}
        />
    }

    const testMaxCreated = (onSuccess) => {
        setLoading(true)
        ApiProject.isMaxProject().then(max => {
            setLoading(false)
            !max ? onSuccess() : message.error("您创建项目数量已经超过限制，请联系管理员！")
        })
    }

    return <div className={classnames(styles.main, 'main-center-project')}>
        <Dialog name="projectDialog" config={{ destroyOnClose: true }} width={700} />
        <Dialog name="useServiceDialog" title='接口的配置'>
            <div>
                <p>
                    系统默认的增删改查中，更新和添加是同一个接口，每个接口的传参是查询接口返回的对象所有属性。
                </p>
                <p>
                    如果需要将更新与添加接口分开或更复杂的生成方案，可以查看-首页-开发提效-自定义项目生成视频。
                </p>
                <p>
                    如果路径中使用到变量参数，如后端定义这样一个接口： /update/{"{id}"}，那么我们这里配置应该是 /update/${"{params.id}"},
                    注意 params 是固定参数变量名，如果你查询接口返回的主键不是id，而是 uid 那么 这里配置的应该是 /update/${"{params.uid}"},
                    以此类推
                </p>
                <p>
                    路径中使用 ${"{fileName}"} 代码生成时会替换为创建页面时的文件名称，即下一步对应的文件名称,
                    ${"{fileName.toLower}"}、 ${"{fileName.toUpper}"} 对应文件名称的全小/大写。
                </p>
            </div>
        </Dialog>
        <Igpt open={aiOpen} onChange={setAiOpen} onFinish={loadData} />
        <Spin spinning={loading}>
            <Affix offsetTop={76}>
                <div className={styles.add}>
                    <Space size={18}>
                        <Button disabled={loading} shape='round' onClick={() => {
                            testMaxCreated(() => {
                                setAiOpen(true)
                            })
                        }}>
                            AI 智能创建项目
                        </Button>
                        <Button
                            shape='round'
                            type='primary'
                            icon={<PlusCircleOutlined />}
                            disabled={loading}
                            onClick={_ => {
                                testMaxCreated(() => {
                                    Dialog.open('projectDialog', { title: '新建项目' })
                                        .then(s => {
                                            s(<Spin />)
                                            Promise.all([
                                                ApiMasterProject.defaultId(),
                                                ApiMasterPage.defaultId()
                                            ]).then(res => {
                                                let [masterplateProjectId, masterplatePageId] = res
                                                if (masterplateProjectId === HttpErrorData) {
                                                    masterplateProjectId = undefined
                                                }
                                                if (masterplatePageId === HttpErrorData) {
                                                    masterplatePageId = undefined
                                                }

                                                s(projectForm({
                                                    masterplateProjectId: masterplateProjectId,
                                                    masterplatePageId: masterplatePageId,
                                                    projectType: TypeType.private
                                                    // colFilter: 'id,create,update,is', 
                                                    // databaseUrl: 'sh-cdb-96nrxv58.sql.tencentcdb.com:60733/Jupiter', 
                                                    // databaseUsername: 'root', 
                                                    // databasePassword: 'EzVKDD9-bm4sRvWpg0*r' 
                                                }))
                                            })
                                        })
                                })
                            }}>
                            新建项目
                        </Button>
                    </Space>
                </div>
            </Affix>
            {
                projects.length ? <div className={styles.cards} >
                    {
                        projects.map(project => (
                            <ProjectCard
                                key={project.projectId}
                                project={project}
                                onEdit={() => {
                                    Dialog.open('projectDialog', { title: `编辑项目(${project.projectName})` })
                                        .then(s => s(projectForm({ ...project })))
                                }}
                                onPreview={() => { }}
                                onDev={toDesign}
                                onDownLoad={() => {
                                    Modal.confirm({
                                        content: '确认下载此项目？',
                                        onOk() {
                                            setLoading(true)
                                            downloadProject(project, () => {
                                                setLoading(false)
                                            })
                                        }
                                    })
                                }} />
                        ))
                    }
                </div> : <div className={styles.empty}>
                    <Empty description="您还没有项目，请点击 新建项目 创建" />
                </div>
            }
        </Spin>
    </div>
}