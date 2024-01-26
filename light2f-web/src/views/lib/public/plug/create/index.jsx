import { Button, Col, message, Modal, Row, Space, Spin } from "antd";
import { Dialog, Form, FormList } from "freedomen";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadComponents, parseURLParams } from "libs/utils";
import { PlusOutlined } from '@ant-design/icons';
import { getPlugPropForm, defaultPlugColumn, customType } from '../components'
import ApiPlug from "services/plug";
import ApiComponentPropDoc from "services/component_prop_doc";
import { ComponentType, PropType } from "views/light/types";
import { propDocColumns } from "views/admin/propDoc/columns";
import history from "libs/history";
import styles from './index.module.less';
import { basePropLabel, customPropLabel } from "views/light/components/panel/component/doc";
import user from "libs/user";

const propTypes = {
    [PropType.string]: '字符串',
    [PropType.number]: '数值',
    [PropType.fn]: '事件/其它',
    [PropType.boolean]: '布尔值',
    [PropType.json]: 'JSON对象'
}

const cTypes = {
    add: 1,
    edit: 2,
    detail: 3
}

const viewDoc = <Button type="link" size="small" href="#/plug/doc" target="_blank">如何创建自定义组件？</Button>

export default function CreatePlug() {
    //uv update version
    const { plugId } = parseURLParams();

    const form = useRef()
    const ref = useRef({})

    const [data, setData] = useState({
        plugType: ComponentType.element,
        plugCustomProps: [],
        plugTags: [],
        plugBaseProps: ["prop", "disabled", "onChange", "style", "className"]
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (plugId) {
            setLoading(true)
            Promise.all([ApiPlug.selectById(plugId), ApiComponentPropDoc.select({ plugId })]).then(([r1, r2]) => {
                r1.plugTags = JSON.parse(r1.plugTags)
                r1.plugBaseProps = JSON.parse(r1.plugBaseProps)
                r1.plugCustomProps = JSON.parse(r1.plugCustomProps)
                if (r1.userId === user.getUserId()) {
                    r1.plugLog = null
                }

                r1.plugCustomProps.forEach(el => {
                    const list = r2.filter(k => k.componentPropDocName === el.prop)
                    if (list.length) {
                        const key = el.$key || el.key
                        ref.current[key] = { key, list }
                    }
                })

                setData(r1)
                setLoading(false)
            })
        }
    }, [plugId])

    const loadComponent = useCallback((data, callback) => {
        loadComponents([{
            ...data,
            plugUseType: customType
        }], callback)
    }, [])

    const errorTip = () => message.error('组件加载失败！，请检查代码或打包是否有问题。')

    const onSubmit = useCallback((data, column) => {
        const onOk = () => {
            setLoading(true)
            if (column.prop === '$submit-test') {
                setData(data)
                loadComponent(data, (correct) => {
                    setLoading(false)

                    correct ? Dialog.open('plugCreate', { title: '自定义组件使用测试' }).then(set =>
                        set(plugForm([defaultPlugColumn]))
                    ) : errorTip()
                })

            } else {
                loadComponent(data, (correct) => {
                    setLoading(false)
                    if (correct) {
                        const keyValues = new Map();
                        data.plugCustomProps.forEach(el => {
                            keyValues.set(el.$key || el.key, el)
                        })

                        const componentPropDocs = []
                        for (let key in ref.current) {
                            if (keyValues.has(key)) {
                                ref.current[key]?.list.forEach(e => {
                                    e.componentPropDocName = e.componentPropDocProp = keyValues.get(key).prop

                                    componentPropDocs.push(e)
                                })
                            }
                        }

                        data.componentPropDocs = componentPropDocs
                        data.plugTags = JSON.stringify(data.plugTags)
                        data.plugBaseProps = JSON.stringify(data.plugBaseProps)
                        data.plugCustomProps = JSON.stringify(data.plugCustomProps)


                        ApiPlug.insertOrUpdate(data).then(res => {
                            message.success((data.plugId ? '修改' : '添加') + '成功')
                            history.goBack()
                        })
                    } else {
                        errorTip()
                    }
                })
            }
        }
        if (!data.plugNpmLibs && column.prop !== '$submit-test') {
            Modal.confirm({
                content: '确定没有依赖库直接提交么？',
                onOk
            })
        } else {
            onOk()
        }
    }, [])

    const plugForm = useCallback((columns = [], data) => {
        return <div className={styles.preview}>
            <Form
                ref={form}
                data={data}
                onEvent={params => {
                    console.log(params)
                }}
                onSubmit={data => {
                    Dialog.close("plugCreate")
                }}
                columns={columns}
            />
        </div>
    }, [])

    const getForm = useCallback((data) => {
        return <Form
            data={data}
            className={styles.dform}
            onEvent={({ prop, row }) => {
                if (prop === 'add') {
                    row.list = row.list.concat([{}])
                    return row
                }
            }}
            onSubmit={data => {
                ref.current[data.key] = data
                Dialog.close('cpd')
            }}
            columns={[...propDocColumns]}
        />
    }, [])

    const onSetProps = useCallback(() => {
        const form = getPlugPropForm({ ...data, doc: ref.current }, (data) => {
            const newColumns = [{
                ...defaultPlugColumn,
                ...data
            }]

            Dialog.close("plugProps")
            Dialog.open("plugCreate")
                .then(set => set(plugForm(newColumns)))
        })

        Dialog.open("plugProps")
            .then(set => set(form))
    }, [plugForm, data])

    const cType = useMemo(() => {
        if (plugId) {
            return user.getUserId() === data.userId ? cTypes.edit : cTypes.detail
        } else {
            return cTypes.add
        }
    }, [data, plugId])

    return <div className={styles.main}>
        <Dialog name="cpd" width={680} config={{ maskClosable: false }} />

        <Dialog name="plugCreate" width={760} footer={
            <Space>
                <Button onClick={onSetProps}>属性配置</Button>
                <Button type="primary" onClick={_ => {
                    form.current?.submit()
                }}>确定</Button>
            </Space>
        } />
        <Dialog name="plugProps" width={660} title="组件属性设置" />
        <Row >
            <Col offset={4}>
                <div className={styles.title}>
                    {cType === cTypes.add ? "添加自定义组件" :
                        (cType === cTypes.detail ? "组件配置详情" : "修改自定义组件")}
                    {viewDoc}
                </div>

            </Col>
            {
                (cType === cTypes.edit) && <div className={styles.modifyText}>
                    每修改一次，将会自动升级一次版本
                </div>
            }
        </Row>
        <Spin spinning={loading}>
            <Form
                data={data}
                onSubmit={onSubmit}
                onEvent={params => {
                    if (params.prop === 'add') {
                        return {
                            ...params.row,
                            plugCustomProps: [
                                ...params.row.plugCustomProps,
                                { type: PropType.string }
                            ]
                        }
                    }
                }}
                columns={[
                    { type: 'input', prop: 'plugName', label: '组件名称', placeholder: '输入您的组件名称，如：图表，input等', config: { maxLength: 40 }, rule: 'must' },
                    { type: 'input', prop: 'plugTname', label: '组件使用类型', placeholder: '如：input、button、slider等，请使用英文并且全部小写', config: { maxLength: 40 } },
                    { type: 'input', prop: 'plugTooltip', label: '组件提示文案', placeholder: '如：用于流程图', config: { maxLength: 40 } },
                    { type: 'tags-create', prop: 'plugTags', label: '关键词', config: { help: '用于搜索时的关键词， 如：date, 日期等', maxcount: 5, maxlength: 20 } },
                    {
                        type: 'radios-button',
                        prop: 'plugType',
                        label: '组件类型',
                        options: {
                            [ComponentType.element]: '元素',
                            [ComponentType.container]: '容器'
                        },
                        //改类型后，列表中按类型搜索的版本显示不全
                        disabled: plugId,
                        config: { buttonStyle: 'solid', help: '元素：如input、button；容器：如div' }
                    },
                    { type: 'input-area', prop: 'plugDes', label: '描述', placeholder: '请输入组件相关描述', config: { rows: 4, maxLength: 220 } },
                    {
                        type: 'uploadFolder',
                        prop: 'plugUid',
                        label: '组件',
                        config: {
                            help: <>请选择你要上传的组件文件夹（打包后的文件）， 如不清楚上传的文件请{viewDoc}</>,
                        },
                        rule: 'must'
                    },
                    {
                        type: 'input',
                        prop: 'plugNpmLibs',
                        label: '依赖库',
                        placeholder: '组件所依赖的除脚手架已有之外的node模块库，多个以英文逗号分隔,如: "react-ace": "^9.5.0","react-ace": "^9.5.0"',
                        config: {
                            help: '请先查看 package.json 中已经依赖的库，避免安装重复'
                        },
                        rule({ value }) {
                            if (value) {
                                if (value.split("").filter(c => c === '"').length % 2 || !value.includes(":")) {
                                    return Promise.reject("格式不正确！")
                                }
                            }
                            return Promise.resolve()
                        }
                    },
                    {
                        type: 'checkboxs',
                        prop: 'plugBaseProps',
                        label: basePropLabel,
                        options: [
                            { label: 'prop', value: 'prop', disabled: true },
                            { label: 'disabled', value: 'disabled' },
                            { label: 'placeholder', value: 'placeholder' },
                            { label: 'onClick事件', value: 'onClick' },
                            { label: 'onChange事件', value: 'onChange' },
                            { label: 'style', value: 'style' },
                            { label: 'className', value: 'className' },
                            { label: 'filter', value: 'filter' }
                        ],
                        config: { help: '已定义基本属性，如果你的组件中没有这些属性，可以取消' }
                    },
                    {
                        prop: 'plugCustomProps',
                        label: customPropLabel,
                        load: ({ value }) => value.length,
                        render() {
                            return <FormList
                                onEvent={params => {
                                    if (params.prop === 'doc') {
                                        const key = params.row.$key || params.row.key

                                        if (!ref.current[key]) {
                                            ref.current[key] = { key, list: [] }
                                        }

                                        Dialog.open('cpd', { title: '方案设置' }).then(s => {
                                            s(getForm({ ...ref.current[key] }))
                                        })
                                    }
                                }}
                                columns={[
                                    [
                                        [
                                            [
                                                { type: 'input', rule: 'must', placeholder: '请输入属性名如config.max', prop: 'prop', style: { width: 200, maxLength: 25 } },
                                                { type: 'input', placeholder: '请输入提示文案', prop: 'help', style: { width: 220, maxLength: 15 } },
                                                { type: 'select', prop: 'type', placeholder: '值类型', style: { width: 120 }, options: propTypes },
                                                { type: 'button-primary', prop: 'doc', value: '方案设置' },
                                                { type: 'inputgroup' }
                                            ],
                                            { type: 'button', value: '删除', prop: '$delete', config: { danger: true } },
                                            { type: 'space'}
                                        ],
                                        { type: 'formitem' }
                                    ]
                                ]}
                            />
                        },
                        config: { help: '主要属性值请用value字段，自定义属性：如ok(属性名),事件(值类型)；其它配置请放在config中，如：config.max: 数值, config.other: 字符串' }
                    },
                    { type: 'button-dashed', prop: 'add', value: '添加自定义属性', style: { width: 640 }, config: { icon: <PlusOutlined />, wrapperCol: { offset: 4 } } },
                    { type: 'quill', prop: 'plugDoc', placeholder: '请介绍相关使用', label: '使用文档' },
                    { type: 'quill', prop: 'plugLog', label: '更新日志', placeholder: '请输入当前版本更新的内容或修复的BUG', rule: 'must', load: () => plugId },
                    [
                        [
                            { type: 'button-primary', prop: '$submit', value: '提交', load: () => cType !== cTypes.detail },
                            { type: 'button', prop: '$submit-test', value: '组件测试' },
                            { type: 'space' },
                        ],
                        { type: 'formitem', config: { wrapperCol: { offset: 4 } } }
                    ]
                ]}
            />
        </Spin>
    </div>
}