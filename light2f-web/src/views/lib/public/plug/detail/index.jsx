import { Alert, Button, Card, Divider, message, Select, Tag } from 'antd'
import { Form, Dialog } from 'freedomen'
import { useCallback, useEffect, useState } from 'react'
import { loadComponents, parseURLParams, replaceOrAddQuery } from 'libs/utils'
import { EyeOutlined, LoadingOutlined } from '@ant-design/icons'
import { getPlugPropForm, defaultPlugColumn, customType, submitButtonColumns, getTypeTag } from '../components'
import ApiPlug from 'services/plug'
import ApiPlugUse from 'services/plug_use'
import ApiComponentPropDoc from 'services/component_prop_doc'
import { HttpErrorData } from 'libs/axios'
import { Link } from 'react-router-dom'
import styles from './index.module.less'
import AddPlugButton from '../components/AddPlugButton'
import { useRef } from 'react'
import history from 'libs/history' 

export default function PlugDetail() {
    const { plugId, projectId } = parseURLParams();

    const [loading, setLoading] = useState(true)
    const [plug, setPlug] = useState(null)
    const [plugUses, setPlugUses] = useState([])
    const [isError, setIsError] = useState(false)
    const [text, setText] = useState("")
    const [columns, setColumns] = useState([defaultPlugColumn, submitButtonColumns])
    const [plugSameId, setPlugSameId] = useState()
    const [versions, setVersions] = useState([])

    const ref = useRef({})

    const loadData = useCallback(() => {
        if (!plugId) return

        setLoading(true)
        Promise.all([ApiPlug.selectById(plugId), ApiPlugUse.select(), ApiComponentPropDoc.select({ plugId })]).then(([res, plugUses, r3]) => { 
            if (res !== HttpErrorData) {
                res.plugTags = JSON.parse(res.plugTags)
                res.plugBaseProps = JSON.parse(res.plugBaseProps)
                res.plugCustomProps = JSON.parse(res.plugCustomProps)

                setPlugSameId(res.plugSameId)

                res.plugCustomProps.forEach(el => {
                    const list = r3.filter(k => k.componentPropDocName === el.prop)
                    if (list.length) {
                        ref.current[el.$key] = { key: el.$key, list }
                    }
                })
                setPlug(res)

                loadComponents([{
                    ...res,
                    plugUseType: customType
                }], (correct) => {
                    setLoading(false)

                    if (!correct) {
                        setIsError(true)
                    }
                })
            } else {
                setText("不存在的组件")
            }

            setPlugUses(plugUses)
        })
    }, [plugId])

    const openTest = useCallback(() => {
        Dialog.open("plugProps").then(set => {
            set(getPlugPropForm({
                plugBaseProps: plug.plugBaseProps,
                plugCustomProps: plug.plugCustomProps,
                doc: ref.current
            }, (data) => {
                setColumns([
                    {
                        ...defaultPlugColumn,
                        ...data
                    },
                    submitButtonColumns
                ])
                Dialog.close("plugProps")
            }))
        })
    }, [plug])

    useEffect(() => {
        plugSameId && ApiPlug.selectBySameId(plugSameId).then(res => {
            setVersions(res)
        })
    }, [plugSameId])

    useEffect(() => {
        loadData()
    }, [loadData])

    const plugNpmLibs = plug?.plugNpmLibs ? plug?.plugNpmLibs.split(",") : []

    if (!plug) return <div className={styles.main}>{text}</div>

    return <div className={styles.main}>
        <Dialog name="plugProps" width={660} title="组件属性设置" />
        <Dialog name="addToMe" />
        <div className={styles.title}>
            组件详情 {
                !!versions.length && <div className={styles.v}>
                    切换对应版本文档： <Select size='small' bordered={false} value={Number(plugId)} onChange={value => {
                        history.replace(replaceOrAddQuery({ plugId: value }))
                    }}>
                        {
                            versions.map(v => <Select.Option className={styles.select} key={v.plugId} value={v.plugId}>
                                version: {v.plugVersion}
                            </Select.Option>)
                        }
                    </Select>
                </div>
            }
        </div>
        <Divider className={styles.line} />
        <div className={styles.header}>
            <div className={styles.name}>
                {plug.plugName}
                <span className={styles.type}>
                    {getTypeTag(plug.plugType)}
                </span>
                <Link to={`/plug/create?plugId=${plug.plugId}`} target="_blank" className={styles.vconfig}>
                    查看配置
                </Link>
            </div>
            <AddPlugButton plug={plug} plugUses={plugUses} projectId={projectId} callBack={loadData} />
        </div>
        <Divider className={styles.line} dashed />
        <div className={styles.tags}>
            {
                plug.plugTags.map((tag, i) => {
                    return <Tag key={i} color="geekblue">{tag}</Tag>
                })
            }
        </div>
        <p className='des'>
            {plug.plugDes}
        </p>
        <div className={styles.docTitle}>
            文档
        </div>
        <div className={styles.docContent} dangerouslySetInnerHTML={{ __html: plug?.plugDoc || "<div class='des'>暂无文档信息</div>" }} />
        {plug.plugLog && <>
            <div className={styles.docTitle}>
                更新日志
            </div>
            <div className={styles.docContent} dangerouslySetInnerHTML={{ __html: plug?.plugLog || "" }} />
        </>}
        {!!plugNpmLibs.length && <>
            <div className={styles.docTitle} >
                依赖库
            </div>
            <div className={styles.libs}>
                <ul>
                    {
                        plugNpmLibs.length ? plugNpmLibs.map((el, index) => <li key={index}>
                            {el}
                        </li>) : <div className='des'>无依赖</div>
                    }
                </ul>
            </div>
        </>}
        <div className={styles.testTitle}>
            使用测试  <Link to={`/plug/code-view?id=${plug.plugUid}`} target="_blank" className={styles.view}>
                <EyeOutlined /> 代码预览
            </Link>
        </div>
        {
            loading ? <LoadingOutlined /> : (
                isError ?
                    <Alert type='error' message="该组件加载失败，不能够正常使用" />
                    : <>
                        <div className={styles.testDes}> 测试组件，会将组件放到form中，并将其prop定义为 {customType} ，以测试组件是否正确，下面 "自定义的组件：" 后则是当前组件。 </div>
                        <Card className={styles.card}>
                            <Form
                                onEvent={params => {
                                    console.log(params)
                                }}
                                onSubmit={data => {
                                    message.success('提交成功，打开控制台查看数据！')

                                    console.log(data)
                                }}
                                columns={columns}
                            />
                        </Card>
                        <Button type='primary' onClick={openTest}>
                            设置属性，修改参数，检查结果是否符合预期
                        </Button>
                    </>
            )
        }
    </div>
}