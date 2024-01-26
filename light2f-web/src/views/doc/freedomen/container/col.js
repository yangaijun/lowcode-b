import { Region, Table } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `<Region  
    columns={[ 
        [
            {type: 'text', value: 'text'},
            {type: 'col', span: 8}
        ], [
            {type: 'text', value: 'text'},
            {type: 'col', span: 8}
        ], [
            {type: 'text', value: 'text'},
            {type: 'button', value: 'button'},
            {type: 'col', span: 8}
        ],
        {type: 'row'}
    ]}
/>`
export default function DCol() {
    return <div >
        <Region
            data={{
                use: `type: 'col'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'Col 列' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Region
                                columns={[
                                    [
                                        { type: 'text', value: 'text' },
                                        { type: 'col', value: 8 }
                                    ], [
                                        { type: 'text', value: 'text' },
                                        { type: 'col', value: 8 }
                                    ], [
                                        { type: 'text', value: 'text' },
                                        { type: 'button', value: 'button' },
                                        { type: 'col', value: 8 }
                                    ],
                                    { type: 'row' }
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
            <strong>提示：</strong> col 和 row 要配合使用才有用哦
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Col props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: col' },
                                { prop: 'value', des: '值, 总共 24', type: 'number' },
                                { prop: 'config', des: <ToAntdDoc text='antd 其他 Grid Col 配置' name="grid" />, type: 'Object' }

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