import { Region, Table } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `<Region  
    columns={[ 
        [
            {type: 'text', value: 'hover tip'},
            {type: 'tooltip', value: '提示信息1'}
        ],
        [
            {type: 'button-primary', value: 'hover'},
            {type: 'tooltip', value: '提示信息2'}
        ],
        {type: 'space'}
    ]}
/>`
export default function DTooltip() {
    return <div >
        <Region
            data={{
                use: `type: 'tooltip'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'Tooltip 提示' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Region
                                columns={[
                                    [
                                        { type: 'text', value: 'hover tip' },
                                        { type: 'tooltip', value: '提示信息1' }
                                    ],
                                    [
                                        { type: 'button-primary', value: 'hover' },
                                        { type: 'tooltip', value: '提示信息2' }
                                    ],
                                    { type: 'space' }
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
            <strong>提示：</strong> 同antd Tooltip
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Tooltip props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: tooltip' },
                                { prop: 'value', des: '提示信息', type: 'String' },
                                { prop: 'config', des: <ToAntdDoc text='antd 其他 Tooltip 配置' name={"tooltip"} />, type: 'Object' }
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