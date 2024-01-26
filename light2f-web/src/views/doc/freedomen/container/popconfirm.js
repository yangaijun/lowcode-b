import { Region, Table } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `<Region  
    columns={[ 
        { type: 'button-primary', value: 'click' },
        { type: 'popconfirm', value: "确认么？" }
    ]}
/>`
export default function DPopconfirm() {
    return <div >
        <Region
            data={{
                use: `type: 'popconfirm'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'Popconfirm 气泡确认' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Region
                                columns={[
                                    { type: 'button-primary', value: 'click' },
                                    { type: 'popconfirm', value: "确认么？" }
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
            <strong>提示：</strong> 同antd Popconfirm
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Popconfirm props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: popconfirm' },
                                { prop: 'value', des: '提示信息', type: 'String' },
                                { prop: 'config', des: <ToAntdDoc text= 'antd 其他 Popconfirm 配置' name={"popconfirm"} />, type: 'Object' }
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