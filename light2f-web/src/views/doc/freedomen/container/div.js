import { Region, Table } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';

const f1 =
    `<Region  
    columns={[ 
        [
            {type: 'text', value: 'text1'},
            {render: () => <br />},
            {type: 'text', value: 'text2'},
            {type: 'div', style: {backgroundColor: '#ccc', padding: 12}}
        ], [
            {type: 'input@w220', prop: 'i1'},
            {type: 'input@w220', prop: 'i2'},
            {type: 'div', style: {display:'flex', flexDirection: 'column'}}
        ] 
    ]}
/>`
export default function DDiv() {
    return <div >
        <Region
            data={{
                use: `type: 'div'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'Div' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Region
                                columns={[
                                    [
                                        { type: 'text', value: 'text1' },
                                        { render: () => <br /> },
                                        { type: 'text', value: 'text2' },
                                        { type: 'div', style: { backgroundColor: '#ccc', padding: 12 } }
                                    ], [
                                        { type: 'input@w220', prop: 'i1' },
                                        { type: 'input@w220', prop: 'i2' },
                                        { type: 'div', style: { display: 'flex', flexDirection: 'column' } }
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
            <strong>提示：</strong> 同{"<div/>"}标签，容器只能在数组最后一个元素
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Div props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: div' },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' }
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