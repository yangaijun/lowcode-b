import { Component } from 'react';
import { Form, Dialog, Region, Table, Search } from 'freedomen'
export default class DPage1 extends Component {
    state = {
        tableData: [{name: '王安', gender: 'boy', birthday: '1994-01-11'}],
        pagination: { total: 1 },
    };
    searchParams = {}
    getForm = (formData = {}) => {
        return <Form
            data={formData}  
            onSubmit={data => {
                Dialog.loading('classdialog')
                setTimeout(() => {
                    Dialog.close('classdialog')
                }, 1800);
                console.log(data)
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
        if (params.prop === 'create') {
            Dialog.open("classdialog", { title: "添加" }).then(setBody => setBody(this.getForm()))
        }
    }
    tableEvent = (params) => {
        if (params.prop === 'edit') {
            Dialog.open("classdialog", { title: "编辑" }).then(setBody => setBody(this.getForm(params.row)))
        } else if (params.prop === 'delete') {
            alert('delete?--' + JSON.stringify(params))
        }
    }
    render() {
        const { tableData, pagination } = this.state;
        return (<>
            <Dialog name="classdialog" />
            <Search
                onEvent={this.searchEvent}
                columns={[
                    { type: 'input@w220', prop: 'name', label: '姓名' },
                    { type: 'select@w220', prop: 'gender', label: '性别', options: 'boy,girl,other' },
                    { type: 'button-primary', value: '查询', prop: 'search' },
                    { type: 'button', value: '重置', prop: '$reset' }
                ]}
            /><br />
            <Region
                onEvent={this.regionEvent}
                columns={[
                    { type: 'button-primary', value: '添加', prop: 'create', style: {marginBottom: 8} }
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
}
