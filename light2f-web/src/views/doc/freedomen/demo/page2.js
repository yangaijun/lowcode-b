import { useCallback, useState } from 'react';
import { Form, Dialog, Region, Table, Search } from 'freedomen'
const searchColumns = [
    { type: 'input@w220', prop: 'name', label: '姓名' },
    { type: 'select@w220', prop: 'gender', label: '性别', options: 'boy,girl,other' },
    { type: 'button-primary', value: '查询', prop: 'search' },
    { type: 'button', value: '重置', prop: '$reset' }
]
const tableColumns = [
    { type: 'text', prop: 'name', label: '姓名' },
    { type: 'text', prop: 'gender', label: '性别', options: 'boy,girl,other' },
    { type: 'text', prop: 'birthday', label: '出生日期', filter: 'yyyy/MM/dd' },
    {
        label: '操作', width: 200, render() {
            return [
                { type: 'button-primary@small', value: '编辑', prop: 'edit' },
                { type: 'button@small', value: '删除', prop: 'delete' },
                { type: 'space' }
            ]
        }
    }
]
export default function DPage2() {
    const [tableData,] = useState([{ name: '王安', gender: 'boy', birthday: '1994-01-11' }])
    const [pagination,] = useState({ total: 1 })

    const getForm = useCallback((formData = {}) => {
        return <Form
            data={formData}
            onSubmit={data => {
                Dialog.loading('hookdialog')
                setTimeout(() => {
                    Dialog.close('hookdialog')
                }, 1600);
                console.log(data)
            }}
            columns={[
                { type: 'input', prop: 'name', label: '姓名', rule: 'must' },
                { type: 'select', prop: 'gender', label: '性别', options: 'boy,girl,other' },
                { type: 'date', prop: 'birthday', label: '出生日期' },
                { type: 'upload-img', prop: 'avatar', label: '头像' }
            ]}
        />
    }, [])
    const searchEvent = (params) => {
        if (params.prop === 'search') {
            console.log(params.row)
        }
    }
    const regionEvent = (params) => {
        if (params.prop === 'create') {
            Dialog.open("hookdialog", { title: "添加" }).then(setBody => setBody(getForm()))
        }
    }
    const tableEvent = (params) => {
        if (params.prop === 'edit') {
            Dialog.open("hookdialog", { title: "编辑" }).then(setBody => setBody(getForm(params.row)))
        } else if (params.prop === 'delete') {
            alert('delete?')
        }
    }

    return (<>
        <Dialog name="hookdialog" />
        <Search
            onEvent={searchEvent}
            columns={searchColumns}
        /><br />
        <Region
            onEvent={regionEvent}
            columns={[
                { type: 'button-primary', value: '添加', prop: 'create', style: { marginBottom: 8 } }
            ]}
        />
        <Table
            data={tableData}
            pagination={pagination}
            onEvent={tableEvent}
            columns={tableColumns}
        />
    </>);
}
