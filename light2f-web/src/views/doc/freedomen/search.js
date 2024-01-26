import React, { Component } from 'react'
import { Region, Table, Search } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToColumns from './components/toColumns';
import ToAntdDoc from './components/toAntdDoc';
const f1 =
    `<Search  
    onSubmit={data => {
        console.log(data)
    }}
    columns={[
        {type: 'input', label: '姓名', prop: 'username'},
        {type: 'select@w160', label: '性别', prop: 'gender', options: 'male,female'},
        {type: 'button-primary', prop: '$submit', value: '查询'}
    ]}
/>`
const f2 =
    `<Search  
    onSubmit={data => {
        console.log(data)
    }}
    columns={[
        {type: 'input', label: '姓名', prop: 'username'},
        {type: 'select@w160', label: '性别', prop: 'gender', options: 'male,female'},
        {type: 'date@w160', label: '生日', prop: 'date'},
        {type: 'button-primary', prop: '$submit', value: '查询'},
        {type: 'button', prop: '$reset', value: '重置'}
    ]}
/>`
export default class DSearch extends Component {
    render() {
        return <div >
            <Region
                data={{
                    use: `imoprt { Search } from 'freedomen'`, f1, f2
                }}
                columns={[
                    { type: 'text-div@title', value: 'Search 查询' },
                    { prop: 'use', render: renderCode },
                    [
                        {
                            render() {
                                return <Search
                                    onSubmit={data => {
                                        console.log(data)
                                    }}
                                    columns={[
                                        { type: 'input', label: '姓名', prop: 'username' },
                                        { type: 'select@w160', label: '性别', prop: 'gender', options: 'male,female' },
                                        { type: 'button-primary', prop: '$submit', value: '查询' }
                                    ]}
                                />
                            }
                        },
                        { type: 'divider@form' },
                        { prop: 'f1', render },
                        { type: 'card@form', value: '1. 基本查询' }
                    ],
                    [
                        {
                            render() {
                                return <Search
                                    onSubmit={data => {
                                        console.log(data)
                                    }}
                                    columns={[
                                        { type: 'input', label: '姓名', prop: 'username' },
                                        { type: 'select@w160', label: '性别', prop: 'gender', options: 'male,female' },
                                        { type: 'date@w160', label: '生日', prop: 'date' },
                                        { type: 'button-primary', prop: '$submit', value: '查询' },
                                        { type: 'button', prop: '$reset', value: '重置' }
                                    ]}
                                />
                            }
                        },
                        { type: 'divider@form' },
                        { prop: 'f2', render },
                        { type: 'card@form', value: '2. 可以重置查询' }
                    ]
                ]}
            />
            <div className="fdoc-tip">
                <strong>提示：</strong>Search 继承自 Form，复杂查询可以直接用Form组件， column prop 为 $submit 或 $submit-* 触发click 可以提交表单, 为  $reset 或者 $reset-* 可以重置
            </div>
            <Region
                columns={[
                    { type: 'text-div@title', value: 'Search props' },
                    {
                        render() {
                            return <Table
                                data={[
                                    { prop: 'data', des: '表单区域数据', type: 'Object', defaultValue: "{}" },
                                    { prop: 'columns', des: '必须的, 对应元素描述', type: <ToColumns type="Form" /> },
                                    {
                                        prop: 'onEvent', des: 'columns 内发生的事件', type: '({prop, type, value, row, column}) => void 0 || data',
                                        detail: <div>
                                            prop: 触发事件元素的prop <br />
                                            type: 触发事件类型 <br />
                                            value: 触发事件元素的最新值 <br />
                                            row: 当前表单的最新值 <br />
                                            column: 对应元素全量配置 <br />
                                            return data: 跟新表单数据，同setState()
                                        </div>
                                    },
                                    {
                                        prop: 'onSubmit', des: '验证通过，提交回调事件', type: '(data, params) => void 0',
                                        detail: <div>
                                            data: 要提交的数据 <br />
                                            params: 触发提交的元素描述, 如表单内有多个按钮都可以触发提交：<br />  '$submit-1', '$submit-2', 可以通过此得知是哪个触发提交
                                        </div>
                                    },
                                    { prop: 'config', des: <ToAntdDoc text={"antd Form 配置"} name="form" />, type: 'Object, 如: { size: "small" }' }
                                ]}
                                pagination={false}
                                columns={[
                                    { label: '参数', prop: 'prop' },
                                    { label: '说明', prop: 'des' },
                                    {
                                        label: '类型', prop: 'type', render({ value, data }) {
                                            if (data.detail)
                                                return <Popover content={data.detail}>
                                                    {value}
                                                </Popover>
                                            else return value
                                        }
                                    },
                                    { label: '默认值', prop: 'defaultValue' }
                                ]}
                            />
                        }
                    },
                    { type: 'text-div@title', value: 'Search 的 columns 属性的子对象附加属性' },
                    {
                        render() {
                            return <Table
                                data={[
                                    { prop: 'label', des: '同FormItem label', type: 'ReactNode' },
                                    {
                                        prop: 'config', des: '同FormItem中 props, 与column config 合并', type: 'Object'
                                    },
                                ]}
                                pagination={false}
                                columns={[
                                    { label: '参数', prop: 'prop' },
                                    { label: '说明', prop: 'des' },
                                    {
                                        label: '类型', prop: 'type', render({ value, data }) {
                                            if (data.detail)
                                                return <Popover content={data.detail}>
                                                    {value}
                                                </Popover>
                                            else return value
                                        }
                                    }
                                ]}
                            />
                        }
                    }
                ]}
            />

        </div>
    }
}