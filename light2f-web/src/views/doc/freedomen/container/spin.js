import { Region, Table } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import ToAntdDoc from '../components/toAntdDoc'

const f1 =
    `<Region
    onEvent={params => {
        return {
            ...params.row,
            spin: !params.row.spin
        }
    }}
    data={{ spin: false }}
    columns={[
        [
            { type: 'button-link', value: '删除' },
            { type: 'button-link', value: '修改' },
            { type: 'spin' }
        ],
        [
            { type: 'button-link', value: '删除' },
            { type: 'button-link', value: '修改' },
            { type: 'spin', value: false }
        ],
        [
            { type: 'button-link', value: '删除' },
            { type: 'button-link', value: '修改' },
            { type: 'spin', prop: 'spin' }
        ],
        { type: 'button', value: '点击使改变第三行loading状态' }
    ]}
/>`

export default function DFragment() {

    return <div >
        <Region
            data={{
                use: `type: 'spin'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'Spin 加载中' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Region
                                onEvent={params => {
                                    return {
                                        ...params.row,
                                        spin: !params.row.spin
                                    }
                                }}
                                data={{ spin: false }}
                                columns={[
                                    [
                                        { type: 'button-link', value: '删除' },
                                        { type: 'button-link', value: '修改' },
                                        { type: 'spin' }
                                    ],
                                    [
                                        { type: 'button-link', value: '删除' },
                                        { type: 'button-link', value: '修改' },
                                        { type: 'spin', value: false }
                                    ],
                                    [
                                        { type: 'button-link', value: '删除' },
                                        { type: 'button-link', value: '修改' },
                                        { type: 'spin', prop: 'spin' }
                                    ],
                                    { type: 'button', value: '点击使改变第三行loading状态' }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f1', render },
                    { type: 'card@form', value: '1. 基本使用' }
                ]
            ]}
        />
        <div style={{
            backgroundColor: '#eef2ff',
            padding: 10,
            marginBottom: 5,
            marginTop: 25
        }}>
            <strong>提示：</strong> 加载中
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Spin props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'spin' },
                                { prop: 'value', des: '是否加载中', type: 'boolean', defaultValue: 'true' },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'config', des: <ToAntdDoc text='antd 其他 Spin 配置' name="spin" />, type: 'Object' }
                            ]}
                            pagination={false}
                            columns={[
                                { label: '参数', prop: 'prop' },
                                { label: '说明', prop: 'des' },
                                { label: '类型', prop: 'type' },
                                { label: '默认值', prop: 'defaultValue' }
                            ]}
                        />
                    }
                }
            ]}
        />
    </div>
}