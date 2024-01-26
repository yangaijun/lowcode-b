import React, { Component } from 'react'
import { Region, Table } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import ToFilter from '../components/toFilter';
import ToAntdDoc from '../components/toAntdDoc';

const f1 =
    `import { DownloadOutlined } from '@ant-design/icons'
<Region  
    columns={[ 
        [
            {type: 'button', value: 'default'},
            {type: 'button-primary', value: 'primary'},
            {type: 'button-dashed', value: 'dashed'},
            {type: 'button-text', value: 'text'},
            {type: 'button-link', value: 'link'},
            {type: 'space'}
        ],
        {render: () => <><br/><br/></>},
        [
            {type: 'button', value: 'small', config: {size: 'small'}},
            {type: 'button-primary', value: 'icon', config: {icon: <DownloadOutlined />}},
            {type: 'button-primary', value: 'round', config: {shape: 'round'}},
            {type: 'space'}
        ]
    ]}
/>`
const f2 =
    `<Region  
    onEvent={params => {
        console.log(params)
        if (params.prop === 'primary') {
            return {disabled: true}
        }
    }}
    columns={[
        {type: 'button', prop: 'defalut', value: 'default'},
        {type: 'button-primary', prop: 'primary', value: 'click me disabled', disabled: ({data}) => data.disabled},
        {type: 'button-dashed', prop: 'dashed', value: 'dashed'},
        {type: 'button-text', prop: 'text', value: 'text'},
        {type: 'button-link', prop: 'link', value: 'link'},
        {type: 'space'}
    ]}
/>`
export default class DButton extends Component {
    render() {
        return <div >
            <Region
                data={{
                    use: `type: 'button'`, f1, f2
                }}
                columns={[
                    { type: 'text-div@title', value: 'Button 按钮' },
                    { prop: 'use', render: renderCode },
                    [
                        {
                            render() {
                                return <Region
                                    columns={[
                                        [
                                            { type: 'button', value: 'default' },
                                            { type: 'button-primary', value: 'primary' },
                                            { type: 'button-dashed', value: 'dashed' },
                                            { type: 'button-text', value: 'text' },
                                            { type: 'button-link', value: 'link' },
                                            { type: 'space' }
                                        ],
                                        { render: () => <><br /><br /></> },
                                        [
                                            { type: 'button', value: 'small', config: { size: 'small' } },
                                            { type: 'button-primary', value: 'icon', config: { icon: <DownloadOutlined /> } },
                                            { type: 'button-primary', value: 'round', config: { shape: 'round' } },
                                            { type: 'space' }
                                        ]
                                    ]}
                                />
                            }
                        },
                        { type: 'divider@form' },
                        { prop: 'f1', render },
                        { type: 'card@form', value: '1. 基本使用' }
                    ],
                    [
                        {
                            render() {
                                return <Region
                                    onEvent={params => {
                                        console.log(params)
                                        if (params.prop === 'primary') {
                                            return { disabled: true }
                                        }
                                    }}
                                    columns={[
                                        { type: 'button', prop: 'defalut', value: 'default' },
                                        { type: 'button-primary', prop: 'primary', value: 'click me disabled', disabled: ({ data }) => data.disabled },
                                        { type: 'button-dashed', prop: 'dashed', value: 'dashed' },
                                        { type: 'button-text', prop: 'text', value: 'text' },
                                        { type: 'button-link', prop: 'link', value: 'link' },
                                        { type: 'space' }
                                    ]}
                                />
                            }
                        },
                        { type: 'divider@form' },
                        { prop: 'f2', render },
                        { type: 'card@form', value: '2. 事件代理' }
                    ]
                ]}
            />
            <div className="fdoc-tip">
                <strong>提示：</strong> button 的事件由其父组件代理, 不过要知道是哪个按钮触发事件的要加 prop 属性哦
            </div>
            <Region
                columns={[
                    { type: 'text-div@title', value: 'Button props' },
                    {
                        render() {
                            return <Table
                                data={[
                                    { prop: 'type', des: '按钮样式', type: 'Enum: button/-primary/-dashed/-text/-link' },
                                    { prop: 'value', des: '值', type: 'String' },
                                    { prop: 'filter', des: '对value显示进行过滤', type: <ToFilter /> },
                                    { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                    { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                    { prop: 'disabled', des: '是否禁用', type: 'Boolean / ({value, data}) => Boolean', defaultValue: 'false' },
                                    { prop: 'config', des: <ToAntdDoc text={'antd 其他 Button 配置'} name="button" />, type: 'Object' }
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
                    }
                ]}
            />
        </div>
    }
}