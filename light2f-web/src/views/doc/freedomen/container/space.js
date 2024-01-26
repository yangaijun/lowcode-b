import { Region, Table } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `<Region  
    columns={[ 
        [
            {type: 'button-link', prop: 'b1', value: '删除'},
            {type: 'button-link', prop: 'b2', value: '修改'},
            {type: 'space'}
        ], 
        {render: () => <br />},
        [
            {type: 'text', value: '文本1'},
            {type: 'text', value: '文本2'},
            {type: 'space-vertical', style: {marginLeft: 15}}
        ],
        { render: () => <br /> },
        [
            { type: 'text', value: '文本1' },
            { type: 'text', value: '文本2' },
            { type: 'space', value: 60, style: { marginLeft: 15 } }
        ]
    ]}
/>`
export default function DSpace() {
    return <div >
        <Region
            data={{
                use: `type: 'space'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'Space 分割' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Region
                                columns={[
                                    [
                                        { type: 'button-link', prop: 'b1', value: '删除' },
                                        { type: 'button-link', prop: 'b2', value: '修改' },
                                        { type: 'space' }
                                    ],
                                    { render: () => <br /> },
                                    [
                                        { type: 'text', value: '文本1' },
                                        { type: 'text', value: '文本2' },
                                        { type: 'space-vertical', style: { marginLeft: 15 } }
                                    ],
                                    { render: () => <br /> },
                                    [
                                        { type: 'text', value: '文本1' },
                                        { type: 'text', value: '文本2' },
                                        { type: 'space', value: 60, style: { marginLeft: 15 } }
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
            <strong>提示：</strong> 同antd Space
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Space props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: space/-vertical' },
                                { prop: 'value', des: '间距', type: 'number' },
                                { prop: 'config', des: <ToAntdDoc text='antd 其他 Space 配置' name={"space"} />, type: 'Object' }
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