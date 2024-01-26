import { Component } from 'react'
import { Region } from 'freedomen' 
import { render } from 'components/codeText'
import Page1 from './page1'
import Page2 from './page2'

const f1 = 
`import React, { Component } from 'react';
import { Form, Dialog, Region, Table, Search } from 'freedomen'
export default class extends Component {
    state = {
        tableData: [{name: '王安', gender: 'boy', birthday: '1994-01-11'}],
        pagination: { total: 1 },
    };
    getForm = (formData = {}) => {
        return <Form
            data={formData}  
            onSubmit={data => {
                Dialog.loading('dialog')
                setTimeout(() => {
                    Dialog.close('dialog')
                }, 1600);
            }}
            columns={[
                { type: 'input', prop: 'name', label: '姓名', rule: 'must' },
                { type: 'select', prop: 'gender', label: '性别', options: 'boy,girl,other' },
                { type: 'date', prop: 'birthday', label: '出生日期' },
                { type: 'upload-img', prop: 'avatar', label: '头像' }
            ]}
        />
    } 
    searchEvent = (params) => {
        if (params.prop === 'search') {
            console.log(params.row)
        }
    }
    regionEvent = (params) => {
        if (params.prop == 'create') {
            Dialog.open("dialog", { title: "添加" }).then(setBody => setBody(this.getForm()))
        }
    }
    tableEvent = (params) => {
        if (params.prop == 'edit') {
            Dialog.open("dialog", { title: "编辑" }).then(setBody => setBody(this.getForm(params.row)))
        } else if (params.prop == 'delete') {
            alert('delete?')
        }
    }
    render() {
        const { tableData, pagination } = this.state;
        return (<>
            <Dialog name="dialog" />
            <Search
                onEvent={this.searchEvent}
                columns={[
                    { type: 'input@w220', prop: 'name', label: '姓名' },
                    { type: 'select@w220', prop: 'gender', label: '性别', options: 'boy,girl,other' },
                    { type: 'button-primary', value: '查询', prop: 'search' },
                    { type: 'button', value: '重置', prop: '$reset' }
                ]}
            />
            <Region
                onEvent={this.regionEvent}
                columns={[
                    { type: 'button-primary', value: '添加', prop: 'create' }
                ]}
            />
            <Table
                data={tableData}
                pagination={pagination}
                onEvent={this.tableEvent}
                columns={[
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
                ]}
            />
        </>);
    }
}`
const f2 = 
`import React, { useState, useRef } from 'react';
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
export default function Index(props) { 
    const [tableData, setTableData] = useState([{name: '王安', gender: 'boy', birthday: '1994-01-11'}])
    const [pagination, setPagination] = useState({total: 1}) 
    const getForm = useCallback((formData = {}) => {
        return <Form
            data={formData}  
            onSubmit={data => {
                Dialog.loading('dialog')
                setTimeout(() => {
                    Dialog.close('dialog')
                }, 1600);
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
        if (params.prop == 'create') {
            Dialog.open("dialog", { title: "添加" }).then(setBody => setBody(getForm()))
        }
    }
    const tableEvent = (params) => {
        if (params.prop == 'edit') {
            Dialog.open("dialog", { title: "编辑" }).then(setBody => setBody(getForm(params.row)))
        } else if (params.prop == 'delete') {
            alert('delete?')
        }
    }
    return (<>
        <Dialog name="dialog" />
        <Search
            onEvent={searchEvent}
            columns={searchColumns}
        />
        <Region
            onEvent={regionEvent}
            columns={[
                { type: 'button-primary', value: '添加', prop: 'create' }
            ]}
        />
        <Table
            data={tableData}
            pagination={pagination}
            onEvent={tableEvent}
            columns={tableColumns}
        />
    </>);
}`

export default class DCurd extends Component {
    render () {
        return <div > 
            <Region 
                data={{
                    f1, f2
                }}
                columns={[
                    {type: 'text-div@title', value: '示例'},
                    [   
                        {render:() => <Page1 />},
                        {type: 'divider@form'},
                        {prop: 'f1', render},
                        {type: 'card@form', value: '1. 增删查改(class版本)'}
                    ],[   
                        {render:() => <Page2 />},
                        {type: 'divider@form'},
                        {prop: 'f2', render},
                        {type: 'card@form', value: '2. 增删查改(hook版本)'}
                    ]
                ]}
            /> 
             
        </div>
    }
}