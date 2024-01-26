import { useCallback, useEffect, useMemo, useState } from 'react'
import { List, Table, Dialog, Form } from 'freedomen'
import { Divider, message, Button, Spin, Modal, Alert } from 'antd'
import { renderJs } from 'components/codeText'
import { testSomeUseInData, exchangeDataString, testSomeUseInPreCode, exchangePreCodeString, designListToDataList, openTokenSet } from 'views/light/utils/util'
import { useDispatch, useSelector } from 'react-redux'
import { toServiceItem } from 'views/light/utils/icode'
import { setPage, setPageInfo, setServiceInfo } from 'slices/pageSlice'
import { cloneDeep } from 'lodash'
import Bus, { BUS_KEYS } from 'views/light/bus'
import ApiService from 'services/service'
import ApiInitcode from 'services/initcode'
import ApiPage from 'services/page'
import { setLight } from 'slices/loadingSlice'
import { PlusOutlined } from '@ant-design/icons'
import { openPage } from 'slices/temporarySlice'
import { preApiLabel } from '../component/doc'
import { INSTRUCTS } from 'views/light/config'
import ILink from 'components/ILink'
import styles from './index.module.less'
import { parseURLParams } from 'libs/utils'

export default function Index() {
    const page = useSelector(selector => selector.page)
    const { projectId } = parseURLParams();
    const { designInfo: { designType } } = useSelector(state => state.temporary)
    const dispatch = useDispatch()
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)
    const { hasPermission } = useSelector(state => state.temporary)

    const loadData = useCallback(async (useLight) => {
        const { pageId } = page
        if (pageId) {
            await dispatch(setServiceInfo(pageId))
            useLight ? dispatch(setLight(false)) : setLoading(false)
        }
    }, [page, dispatch])

    useEffect(() => {
        setList(cloneDeep(page.services))
    }, [page.services])

    const designTips = useMemo(() => {
        return designType
            ? <Alert
                type="info"
                message="路径中使用 ${fileName} 代码生成时会替换为创建页面时的文件名称, ${fileName.toLower}、 ${fileName.toUpper} 对应文件名称的全小/大写"
                style={{ marginBottom: 12 }}
            /> : null
    }, [designType])

    const addForm = () => {
        return <div>
            {designTips}
            <Form
                data={{ list: [{ pageId: page.pageId }] }}
                onEvent={params => {
                    if (params.prop === 'add') {
                        const { list } = params.row
                        list.push({ pageId: page.pageId })
                        return { list }
                    }
                }}
                onSubmit={data => {
                    Dialog.loading('addApis')
                    ApiService.inserts(data.list).then(_ => {
                        Dialog.close('addApis')
                        loadData()
                    })
                }}
                columns={[
                    {
                        prop: 'list',
                        render() {
                            return <Table
                                pagination={false}
                                columns={[
                                    { type: 'select@w100', label: '*Method', value: 'post', prop: 'serviceMethod', options: 'get,post,put,delete', config: { allowClear: false } },
                                    { type: 'input@w200', label: '*路径', prop: 'serviceUrl', placeholder: '如 page/select', config: { maxLength: 65 } },
                                    { type: 'input@w160', label: '*名称', prop: 'serviceName', placeholder: '如 select', config: { maxLength: 25 } },
                                    { type: 'select@w180', label: '返回类型', prop: 'serviceResponseType', placeholder: '接口返回的数据类型', options: 'json,text,blob,arraybuffer,document,ms-stream' },
                                    { type: 'input@w180', label: '注释', prop: 'serviceComment', placeholder: '注释', config: { maxLength: 25 } }
                                ]}
                            />
                        },
                        rule({ value }) {
                            for (let item of value) {
                                if (!item.serviceName || !item.serviceUrl) {
                                    return Promise.reject('名称、路径都不能为空')
                                }
                            }
                            return Promise.resolve()
                        },
                        config: { extra: '路径带参数，可以：user/${params.id}。 ${}为语法，params 为固定参数名' }
                    },
                    { type: 'button-dashed@small', value: '新增一条', prop: 'add' }
                ]}
            />
        </div>
    }

    return (
        <div className={styles["api-body"]}>
            <Spin spinning={loading}>
                <div className={styles["api-title"]}>
                    <div style={{ flex: 1 }}>
                        {preApiLabel}
                        <ILink url={'/doc/light/api'} fontSize={12}>更多文档</ILink>
                    </div>
                    {projectId && <Button
                        size='small'
                        type='link'
                        style={{ marginRight: 4 }}
                        onClick={openTokenSet}>
                        调试参数
                    </Button>}
                </div>
                <Divider className={styles["api-line"]} />
                <div className={styles["api-list"]}>
                    <List
                        data={list}
                        onEvent={params => {
                            if (params.prop === 'delete') {
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
                                        ApiService.delete({
                                            serviceId: params.row.serviceId
                                        }).then(_ => {
                                            loadData()
                                        })
                                    }
                                })
                            } else if (params.prop === 'edit') {
                                const cloneRow = cloneDeep(params.row)
                                Dialog.open('apiEdit', { okButtonProps: { disabled: !hasPermission } }).then(s => s(
                                    <>
                                        {designTips}
                                        <Form
                                            data={params.row}
                                            onSubmit={data => {
                                                if (!hasPermission) {
                                                    message.error('无修改权限 ！')
                                                    return
                                                }

                                                const submit = (useLight) => {
                                                    Dialog.loading('apiEdit')
                                                    useLight ? dispatch(setLight(true)) : setLoading(true)
                                                    ApiService.update(data).then(_ => {
                                                        Dialog.close('apiEdit')
                                                        loadData(useLight)
                                                    })
                                                }
                                                const getApiString = (str) => INSTRUCTS.API + "." + str
                                                if (cloneRow.serviceName !== data.serviceName) {
                                                    const designDataList = Bus.get(BUS_KEYS.designDataList)
                                                    const preCodeChanges = [], dataChanges = []
                                                    const originString = getApiString(cloneRow.serviceName)
                                                    testSomeUseInPreCode(page.initCodes, originString, preCodeChanges)
                                                    testSomeUseInData(designDataList, originString, dataChanges)

                                                    if (preCodeChanges.length || dataChanges.length) {
                                                        Modal.confirm({
                                                            title: '提示',
                                                            content: '检测到接口名称发生更改，是否保存页面并更新当前已使用名称?',
                                                            onOk() {
                                                                const nextString = getApiString(data.serviceName)
                                                                if (preCodeChanges.length) {
                                                                    const _preCodeChanges = cloneDeep(preCodeChanges)
                                                                    exchangePreCodeString(_preCodeChanges, originString, nextString)
                                                                    _preCodeChanges.forEach(el => {
                                                                        if (el.initCodeEffect) {
                                                                            el.initCodeEffect = JSON.stringify(el.initCodeEffect)
                                                                        }
                                                                    })
                                                                    ApiInitcode.updates(_preCodeChanges).then(_ => dispatch(setPageInfo(page)))
                                                                }
                                                                if (dataChanges.length) {
                                                                    exchangeDataString(dataChanges, originString, nextString)
                                                                    const pageDataList = JSON.stringify(designListToDataList(designDataList))
                                                                    ApiPage.update({
                                                                        pageId: page.pageId,
                                                                        pageDataList
                                                                    }).then(_ => dispatch(setPage({ pageDataList })))
                                                                }
                                                                submit(true)
                                                            }
                                                        })
                                                        return
                                                    }
                                                }
                                                submit()
                                            }}
                                            columns={[
                                                { type: 'select@w120', label: 'Method', value: 'post', prop: 'serviceMethod', options: 'get,post,put,delete' },
                                                { type: 'input@w200', label: '名称', prop: 'serviceName', placeholder: '使用名称', rule: 'must', config: { maxLength: 25 } },
                                                { type: 'input@w300', label: '路径', prop: 'serviceUrl', placeholder: '如 page/select', rule: 'must', config: { maxLength: 65, help: '路径带参数，可以这样：user/${params.id}' } },
                                                { type: 'select@w180', label: '返回类型', placeholder: '接口返回的数据类型', prop: 'serviceResponseType', options: 'json,text,blob,arraybuffer,document,ms-stream' },
                                                { type: 'input@w200', label: '注释', prop: 'serviceComment', placeholder: '注释', config: { maxLength: 25 } },
                                                {
                                                    render: () => <div style={{ marginBottom: 2, fontWeight: 'bold' }}>
                                                        代码预览:
                                                    </div>
                                                },
                                                {
                                                    render: ({ data, $base: { shouldUpdate } }) => {
                                                        shouldUpdate(() => true)
                                                        return renderJs({ value: toServiceItem(data) })
                                                    }
                                                }
                                            ]}
                                        />
                                    </>
                                ))
                            }
                        }}
                        columns={[
                            [
                                { type: 'text-b', prop: 'serviceName', config: { maxlength: 15, title: "调用的方法名" }, style: { flex: 1 } },
                                { type: 'button-text', value: '删除', prop: 'delete', disabled: !hasPermission, config: { size: 'small', danger: true } },
                                { type: 'button-link', value: '编辑', prop: 'edit', config: { size: 'small' }, style: { margin: '0 5px' } },
                                { type: 'div', style: { display: 'flex', flexWrap: 'wrap' } }
                            ],
                            { type: 'text-div', prop: 'serviceComment', config: { maxlength: 30 }, style: { color: 'grey' } },
                            [
                                { type: 'tag@small', prop: 'serviceMethod', style: { marginRight: 5 }, filter: ({ value }) => value.toUpperCase(), config: { color: ({ value }) => ({ get: "#2db7f5", post: "#87d068", delete: "#f50", put: "#108ee9" }[value]) } },
                                { type: 'text-div', prop: 'serviceUrl', config: { maxlength: 25 }, style: { backgroundColor: '#595959', color: 'white', padding: '0 10px', borderRadius: 5 } },
                                { type: 'div', style: { display: 'flex', marginTop: 5 } }
                            ],
                            { type: 'divider', style: { margin: '8px 0' } }
                        ]}
                    />
                    <Button
                        size="small"
                        disabled={!hasPermission}
                        icon={<PlusOutlined />}
                        type='dashed'
                        style={{ marginTop: 5, width: 95 }}
                        onClick={_ => {
                            if (page.pageId) {
                                Dialog.open('addApis').then(s => s(addForm()))
                            } else {
                                dispatch(openPage(true))
                            }
                        }}
                    >
                        添加
                    </Button>
                </div>
            </Spin>
            <Dialog name="addApis" title="添加接口" width={1024} />
            <Dialog name="apiEdit" title="编辑" width={600} />
        </div>
    )
}