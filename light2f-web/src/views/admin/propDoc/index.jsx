
import { Affix, Button, message } from "antd"
import { Dialog, Table, Form } from "freedomen"
import { HttpErrorData } from "libs/axios"
import { useCallback, useEffect, useState } from "react"
import cpdApi from "services/component_prop_doc"
import { getFormItemLabelWithDocs } from "views/light/components/panel/component/doc"
import { propDocColumns } from "./columns"
import styles from './index.module.less'

export default function PropDoc() {
    const [tableData, setTableData] = useState([])
    const [allData, setAllData] = useState([])
    const [permission, setPermission] = useState(false)

    const loadData = useCallback(() => {
        cpdApi.selectAdmin().then(res => {
            if (res === HttpErrorData) return

            const componentPropDocNames = []
            const nextTableData = []
            res.forEach(el => {
                if (!componentPropDocNames.includes(el.componentPropDocName)) {
                    nextTableData.push(el)
                    componentPropDocNames.push(el.componentPropDocName)
                }
            })

            setAllData(res)
            setTableData(nextTableData)
            setPermission(true)
        })
    }, [])

    useEffect(() => {
        loadData()
    }, [loadData])

    const getForm = useCallback((data) => {
        return <Form
            data={data}
            className={styles.form}
            onEvent={({ prop, row }) => {
                if (prop === 'add') {
                    row.list = row.list.concat([{}])
                    return row
                }
            }}
            onSubmit={data => {
                Dialog.loading('cpd')
                cpdApi.insertOrUpdate(data).then(res => {
                    Dialog.close('cpd')
                    message.success('操作成功！')

                    loadData()
                })
            }}
            columns={[
                { prop: 'componentPropDocName', label: '属性标题', type: 'input', rule: 'must', config: { maxLength: 20, help: '提示的label' } },
                { prop: 'componentPropDocProp', label: '属性prop', type: 'input', rule: 'must', config: { maxLength: 20, help: '对应的属性的prop' } },
                ...propDocColumns
            ]}
        />
    }, [])

    const getDocs = useCallback((row) => {
        return allData.filter(el => el.componentPropDocName === row.componentPropDocName)
    }, [allData])

    if (!permission)
        return <div className={styles.main}>
            no permission
        </div>

    return <div className={styles.main}>
        <Affix offsetTop={60}>
            <Button type="primary" className={styles.bt} onClick={() => {
                Dialog.open('cpd', { title: '添加属性' }).then(set => {
                    set(getForm({ list: [] }))
                })
            }}>添加属性</Button>
        </Affix>
        <Dialog name="cpd" width={680} />
        <Table
            data={tableData}
            pagination={false}
            onEvent={(params) => {
                if (params.prop === 'edit') {
                    Dialog.open('cpd', { title: '编辑属性' }).then(set => {
                        set(getForm({
                            ...params.row,
                            list: getDocs(params.row)
                        }))
                    })
                } else if (params.prop === 'del' && params.type === "confirm") {
                    cpdApi.delete(params.row).then(res => loadData())
                }
            }}
            columns={[
                { prop: 'componentPropDocName', label: '属性标题' },
                { prop: 'componentPropDocProp', label: '属性prop' },
                {
                    label: '操作', width: 200, render() {
                        return [
                            [
                                { type: 'button-link@small', value: '删除', config: { danger: true } },
                                { type: 'popconfirm', value: '确定删除？', prop: 'del' }
                            ],
                            { type: 'button-link@small', prop: 'edit', value: '编辑' },
                            { render: ({ data }) => getFormItemLabelWithDocs('详情', getDocs(data)) }
                        ]
                    }
                }
            ]}
        />
    </div>
} 