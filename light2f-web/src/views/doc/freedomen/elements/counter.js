import { Region, Table, Form } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `<Form  
    data={{counter2: 2}}
    columns={[ 
        {type: 'inputnumber', prop: 'counter1'},
        {type: 'inputnumber', prop: 'counter2'},
        {type: 'inputnumber@w220', prop: 'counter3', value: 1}
    ]}
/>`
export default function DCounter() {
    return <div >
        <Region
            data={{
                use: `type: 'inputnumber'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'InputNumber 计数器' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Form
                                data={{ counter2: 2 }}
                                columns={[
                                    { type: 'inputnumber', prop: 'counter1' },
                                    { type: 'inputnumber', prop: 'counter2' },
                                    { type: 'inputnumber@w220', prop: 'counter3', value: 1 }
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
        <div className="fdoc-tip">
            <strong>提示：</strong> 同antd InputNumber
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'InputNumber props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: inputnumber' },
                                { prop: 'value', des: '值', type: 'Number' },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'disabled', des: '是否禁用', type: 'Boolean / ({value, data}) => Boolean', defaultValue: 'false' },
                                { prop: 'config', des: <ToAntdDoc text='antd 其他 InputNumber 配置' name={"input-number"} />, type: 'Object' }
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