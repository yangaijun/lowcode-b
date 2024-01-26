import { useCallback, useEffect, useState } from 'react'
import CodeEdit from 'components/CodeEditor'
import ApiInitCode from 'services/initcode'
import { Region, List, Dialog, Form } from 'freedomen'
import { Button, Divider, message, Spin } from 'antd'
import { renderJs } from 'components/codeText'
import { toInitCodeItem, toInitCodeStates } from 'views/light/utils/icode'
import { InitCodeType } from 'views/light/types'
import { setInitCodeInfo } from 'slices/pageSlice'
import { cloneDeep } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from 'antd'
import Bus, { BUS_KEYS } from 'views/light/bus'
import { PlusOutlined } from '@ant-design/icons'
import { defaultCompletions, getDialogCompletions, getDrawerCompletions, getRefCompletions, modalAsyncCompletions, modalCompletions, utilCompletions } from '../component/renders'
import { openPage } from 'slices/temporarySlice'
import { effectLabel, preCodeLabel } from '../component/doc'
import styles from './index.module.less'
import ILink from 'components/ILink'

const fnBtnStyle = { width: 95, marginTop: 5 }
const systemVars = ['history', 'message', 'urlState']

const getOptions = (varOrFnCodes, formData) => {
    const effectOptions = []
    varOrFnCodes.forEach(el => {
        if (el.initCodeName !== formData.initCodeName) {
            effectOptions.push({
                value: el.initCodeName,
                label: el.initCodeName
            })
        }
    })
    return effectOptions
}

var completions = [], asycCompletions = []


export default function Precode() {
    const [effectCodes, setEffectCodes] = useState([])
    const [varOrFnCodes, setVarOrFnCodes] = useState([])
    const [loading, setLoading] = useState(false)
    const page = useSelector(selector => selector.page)
    const { hasPermission } = useSelector(state => state.temporary)
    const dispatch = useDispatch()

    const loadData = useCallback(async () => {
        const { pageId } = page
        if (pageId) {
            await dispatch(setInitCodeInfo(pageId))
            setLoading(false)
        }
    }, [page, dispatch])

    const insertOrUpdateCode = (data, dialogName) => {
        if (!hasPermission) {
            message.error('无修改权限 ！')
            return
        }

        Dialog.loading(dialogName)

        data.initCodeEffect = JSON.stringify(data.initCodeEffect || [])
        ApiInitCode.insertOrUpdate({
            ...data,
            pageId: page.pageId
        }).then(_ => {
            setLoading(true)
            Dialog.close(dialogName)
            loadData()
        })
    }

    useEffect(() => {
        const sets = (dlist = []) => {
            const initCodes = cloneDeep(page.initCodes)
            setVarOrFnCodes(initCodes.filter(el => el.initCodeType !== InitCodeType.EFFECT)
                .concat(toInitCodeStates(dlist))
            )
            setEffectCodes(initCodes.filter(el => el.initCodeType === InitCodeType.EFFECT))
            setLoading(false)
        }
        sets(Bus.get(BUS_KEYS.designDataList))

        const key = Bus.on(BUS_KEYS.designDataList, sets)
        return () => { Bus.remove(key) }
    }, [page])

    //加載代碼提示
    useEffect(() => {
        const [dialogCompletions, dialogAsyncCompletions] = getDialogCompletions()
        const [drawerCompletions, drawerAsyncCompletions] = getDrawerCompletions()

        completions = [
            ...defaultCompletions.varCompletions,
            ...defaultCompletions.varSetCompletions,
            ...defaultCompletions.serviceCompletions,
            ...defaultCompletions.functionCompletions,
            ...defaultCompletions.globalDataCompletions,
            ...defaultCompletions.routerCompletions,
            ...defaultCompletions.globalTmpCompletions,
            ...defaultCompletions.refCompletions,
            ...utilCompletions,
            ...dialogCompletions,
            ...modalCompletions,
            ...drawerCompletions,
            ...getRefCompletions()
        ]
        asycCompletions = [...dialogAsyncCompletions, ...modalAsyncCompletions, ...drawerAsyncCompletions]
    }, [
        defaultCompletions.varCompletions,
        defaultCompletions.varSetCompletions,
        defaultCompletions.serviceCompletions,
        defaultCompletions.functionCompletions,
        defaultCompletions.globalDataCompletions,
        defaultCompletions.routerCompletions,
        defaultCompletions.globalTmpCompletions,
        defaultCompletions.refCompletions,
        utilCompletions,
        modalCompletions
    ])

    const deleteCode = (row) => {
        if (!hasPermission) {
            message.error('无修改权限 ！')
            return
        }

        Modal.confirm({
            title: '确认删除？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                setLoading(true)
                ApiInitCode.delete({
                    initCodeId: row.initCodeId
                }).then(_ => loadData())
            }
        })
    }

    const codeRender = {
        label: '代码预览',
        render: ({ data, $base: { shouldUpdate } }) => {
            shouldUpdate(() => true)
            return <div style={{ marginTop: -12 }}>
                {renderJs({ value: toInitCodeItem(data, page) })}
            </div>
        }
    }

    const varOrFnForm = (formData = { initCodeType: InitCodeType.VAR }) => {
        const effectOptions = getOptions(varOrFnCodes, formData)

        return <Form
            className={'dialog-content'}
            data={formData}
            onSubmit={data => {
                insertOrUpdateCode(data, 'varOrFn')
            }}
            onEvent={params => {
                if (params.prop === 'initCodeType') {
                    return {
                        ...params.row,
                        initCodeValue: params.value === InitCodeType.FN ? '() => {\n    \n}' : ''
                    }
                }
            }}
            columns={[
                {
                    type: 'radios',
                    label: '类型',
                    prop: 'initCodeType',
                    options: {
                        [InitCodeType.VAR]: "变量",
                        [InitCodeType.FN]: "函数",
                        [InitCodeType.REF]: "ref"
                    }
                },
                {
                    type: 'input@w420',
                    label: '名称',
                    prop: 'initCodeName',
                    placeholder: '请输入变量名，如searchParams',
                    rule: ({ value, data }) => {
                        if (!value) {
                            return Promise.reject("请输入名称")
                        } else if (systemVars.includes(value)) {
                            return Promise.reject("系统预定义变量不可以使用")
                            //编辑时候的变量名要可以使用自己
                        } else if (varOrFnCodes.find(el => value === el.initCodeName && data.initCodeId !== el.initCodeId)) {
                            return Promise.reject("请不要使用重复变量名")
                        }
                        return Promise.resolve()
                    },
                    config: { maxLength: 20, extra: '请使用字母数字下划线组合，且不以数字开头' }
                },
                {
                    type: 'select-multiple@w420',
                    label: '影响',
                    prop: 'initCodeEffect',
                    options: effectOptions,
                    placeholder: '请选择影响变量',
                    config: { extra: '请选择函数里用到的变量或函数，防闭包' },
                    load: ({ data }) => data.initCodeType === InitCodeType.FN
                },
                {
                    label: '初始值',
                    prop: 'initCodeValue',
                    render({ value, $base: { onChange } }) {
                        return <CodeEdit
                            value={value}
                            completions={completions}
                            asycCompletions={asycCompletions}
                            style={{ width: 580, height: 200 }}
                            onChange={onChange}
                        />
                    }
                },
                codeRender
            ]}
        />
    }

    const effectForm = (formData = { initCodeType: InitCodeType.EFFECT, initCodeValue: '() => {\n\n}' }) => {
        const effectOptions = getOptions(varOrFnCodes, formData)

        return <Form
            data={formData}
            onSubmit={data => {
                insertOrUpdateCode(data, 'effect')
            }}
            className={'dialog-content'}
            columns={[
                {
                    type: 'select-multiple@w420',
                    label: '影响',
                    prop: 'initCodeEffect',
                    options: effectOptions,
                    placeholder: '请选择影响变量',
                    config: { extra: '当选择的影响变量发成改变，重新执行函数' }
                },
                {
                    label: '值', prop: 'initCodeValue', render({ value, $base: { onChange } }) {
                        return <CodeEdit
                            completions={completions}
                            asycCompletions={asycCompletions}
                            value={value}
                            style={{ width: 540, height: 180 }}
                            onChange={onChange}
                        />
                    }
                },
                codeRender
            ]}
        />
    }

    return (<div className={styles["precode-body"]}>
        <Spin spinning={loading}>
            <div className={styles["precode-title"]}>
                {preCodeLabel}<ILink url={'/doc/light/code'} fontSize={12}>更多文档</ILink>
            </div>
            <Divider className={styles["precode-line"]} />
            <div className={styles["precode-list"]}>
                <List
                    data={varOrFnCodes}
                    onEvent={params => {
                        if (params.prop === 'delete') {
                            deleteCode(params.row)
                        } else if (params.prop === 'edit') {
                            Dialog.open("varOrFn", { title: "编辑变量/函数", okButtonProps: { disabled: !hasPermission } }).then(s => s(varOrFnForm(params.row)))
                        } else if (params.prop === 'detail') {
                            Dialog.open('detail', { title: '代码预览' }).then(s => s(
                                <Region
                                    className='dialog-content'
                                    columns={[
                                        {
                                            label: '代码预览', render: ({ $base: { shouldUpdate } }) => {
                                                shouldUpdate(() => true)
                                                return renderJs({ value: toInitCodeItem(params.row, page) })
                                            }
                                        }
                                    ]}
                                />)
                            )
                        }
                    }}
                    columns={[
                        [
                            {
                                type: 'text-b',
                                prop: 'initCodeName',
                                style: { flex: 1 },
                                filter: ({ value, data }) => {
                                    const isFn = data.initCodeType === InitCodeType.FN
                                    return <div
                                        style={{ display: 'flex', color: isFn ? '#409eff' : (data.readOnly ? '#666' : '#000') }}
                                    >
                                        <div
                                            className='text-ellipsis'
                                            style={{ width: 150 }}
                                            title={data.readOnly ? "来自组件内定义，" + value : (isFn ? '函数：' : '变量：' + value)}>
                                            {value}{isFn ? "()" : ""}
                                        </div>
                                    </div>
                                }
                            },
                            { type: 'button-text', value: '详情', prop: 'detail', config: { size: 'small' }, style: { marginRight: 5 }, load: ({ data }) => data.readOnly },
                            [
                                { type: 'button-link', value: '删除', prop: 'delete', disabled: !hasPermission, config: { size: 'small', danger: true }, style: { marginRight: 5 } },
                                { type: 'button-link', value: '编辑', prop: 'edit', config: { size: 'small' }, style: { marginRight: 5 } },
                                { type: 'fragment', load: ({ data }) => !data.readOnly }
                            ],
                            { type: 'div', style: { display: 'flex', flexWrap: 'wrap', marginBottom: -6 } }
                        ],
                        [
                            { prop: 'initCodeValue', render: ({ value }) => renderJs({ value: value || 'undefined' }) },
                            { type: 'div' }
                        ],
                        { type: 'divider', style: { margin: '8px 0' } }
                    ]}
                />
                <Button
                    size="small"
                    icon={<PlusOutlined />}
                    disabled={!hasPermission}
                    type="dashed"
                    style={fnBtnStyle}
                    onClick={_ => {
                        if (page.pageId) {
                            Dialog.open("varOrFn", { title: "创建变量/函数" }).then(s => s(varOrFnForm()))
                        } else {
                            dispatch(openPage(true))
                        }
                    }}
                >
                    添加
                </Button>
                <div className={styles["precode-title"]} style={{ marginTop: 18 }}>{effectLabel}</div>
                <Divider className={styles["precode-line"]} />
                <List
                    data={effectCodes}
                    onEvent={params => {
                        if (params.prop === 'delete') {
                            deleteCode(params.row)
                        } else if (params.prop === 'edit') {
                            Dialog.open("effect", { title: "编辑副作用函数", okButtonProps: { disabled: !hasPermission } }).then(s => s(effectForm(params.row)))
                        }
                    }}
                    columns={[
                        [
                            {
                                type: 'text-b',
                                prop: 'initCodeName',
                                style: { flex: 1 },
                                filter: ({ data }) => `${data.initCodeEffect ? `[${data.initCodeEffect.toString()}]` : '加载完成'}`,
                                config: { maxlength: 15 },
                            },
                            { type: 'button-link', value: '删除', prop: 'delete', disabled: !hasPermission, config: { size: 'small', danger: true }, style: { marginRight: 5 } },
                            { type: 'button-link', value: '编辑', prop: 'edit', config: { size: 'small' }, style: { marginRight: 5 } },
                            { type: 'div', style: { display: 'flex', marginBottom: -6 } }
                        ],
                        [
                            { prop: 'initCodeValue', render: ({ value }) => renderJs({ value: value || 'undefined' }) },
                            { type: 'div' }
                        ],
                        { type: 'divider', style: { margin: '8px 0' } }
                    ]}
                />
                <Button
                    size="small"
                    disabled={!hasPermission}
                    icon={<PlusOutlined />}
                    style={fnBtnStyle}
                    type="dashed"
                    onClick={_ => {
                        if (page.pageId) {
                            Dialog.open("effect", { title: "创建副作用函数" }).then(s => s(effectForm()))
                        } else {
                            dispatch(openPage(true))
                        }
                    }}
                >
                    新建
                </Button>
            </div>
        </Spin>
        <Dialog name="detail" width={800} />
        <Dialog name="varOrFn" width={800} config={{ maskClosable: false }} />
        <Dialog name="effect" width={800} config={{ maskClosable: false }} />
    </div>)
}