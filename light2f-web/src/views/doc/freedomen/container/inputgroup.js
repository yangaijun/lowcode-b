import { Region, Table } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import ToAntdDoc from '../components/toAntdDoc'

const f1 =
    `<Region
    columns={[
        [
            [
                { type: 'input', prop: 'i1', style: { width: 220 } },
                { type: 'button-primary', prop: 'modify', value: '修改' },
                { type: 'inputgroup' }
            ],
            [
                { type: 'input', prop: 'i2', style: { width: 220 } },
                { type: 'select', prop: 's2', options: "abc,def,ghi", style: { width: 150 } },
                { type: 'button', prop: 'test', value: '测试' },
                { type: 'inputgroup' }
            ],
            { type: 'space-vertical' }
        ]
    ]}
/>`
export default function DFragment() {
    return <div >
        <Region
            data={{
                use: `type: 'inputgroup'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'InputGroup 输入组合' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Region
                                columns={[
                                    [
                                        [
                                            { type: 'input', prop: 'i1', style: { width: 220 } },
                                            { type: 'button-primary', prop: 'modify', value: '修改' },
                                            { type: 'inputgroup' }
                                        ],
                                        [
                                            { type: 'input', prop: 'i2', style: { width: 220 } },
                                            { type: 'select', prop: 's2', options: "abc,def,ghi", style: { width: 150 } },
                                            { type: 'button', prop: 'test', value: '测试' },
                                            { type: 'inputgroup' }
                                        ],
                                        { type: 'space-vertical' }
                                    ]
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
            <strong>提示：</strong> 同 antd Input.Group 将组件紧凑组合到一起
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'InputGroup props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'inputgroup' },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'config', des: <ToAntdDoc text='antd 其他 Input.Group 配置' name="input" api="Input.Group" />, type: 'Object' }
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