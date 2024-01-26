import { Region, Table, Form } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `<Form
    onEvent={params => {
        console.log(params)
    }}
    columns={[
        { type: 'timepicker', prop: 'time', value: new Date(), placeholder: '请选择时间' },
        { type: 'timepicker', prop: 'time2', placeholder: '请选择时间', config: { format: 'HH:mm' } },
    ]}
/>`
export default function DDateRange() {
    return <div >
        <Region
            data={{
                use: `type: 'timepicker'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'TimePicker 时间' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Form
                                onEvent={params => {
                                    console.log(params)
                                }}
                                columns={[
                                    { type: 'timepicker', prop: 'time', value: new Date(), placeholder: '请选择时间' },
                                    { type: 'timepicker', prop: 'time2', placeholder: '请选择时间', config: { format: 'HH:mm' } },
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
            <strong>提示：</strong> value 是时间类型
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'TimePicker props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'timepicker' },
                                { prop: 'value', des: '值', type: 'Date/DateString' },
                                { prop: 'placeholder', des: 'placeholder', type: 'string' },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'disabled', des: '是否禁用', type: 'Boolean / ({value, data}) => Boolean', defaultValue: 'false' },
                                { prop: 'config', des: <ToAntdDoc text={'antd 其他 TimePicker 配置'} name="time-picker" />, type: 'Object' }
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