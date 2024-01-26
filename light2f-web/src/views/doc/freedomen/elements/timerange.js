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
        { type: 'timerange', prop: 'timerange', value: [new Date()], placeholder: ["请选择开始时间", "请选择结束时间"] },
        { type: 'timerange', prop: 'timerange2', config: {format: 'HH:mm'} } 
    ]}
/>` 
export default function DDateRange() {
    return <div >
        <Region
            data={{
                use: `type: 'timerange'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'TimeRange 时间范围' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Form
                                onEvent={params => {
                                    console.log(params)
                                }}
                                columns={[
                                    { type: "timerange", prop: "timerange", value: [new Date()], placeholder: ["请选择开始时间", "请选择结束时间"] },
                                    { type: 'timerange', prop: 'timerange2', config: {format: 'HH:mm'} } 
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
            <strong>提示：</strong> 时间范围选择，value是时间数组
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'DateRange props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'timerange' },
                                { prop: 'value', des: '值', type: '[Date, Date]/[DateString, DateString]', defaultValue: '' },
                                { prop: 'placeholder', des: 'placeholder', type: '[string, string]' },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'disabled', des: '是否禁用', type: 'Boolean / ({value, data}) => Boolean', defaultValue: 'false' },
                                { prop: 'config', des: <ToAntdDoc text={'antd 其他 RangePicker 配置'} name="time-picker" api="RangePicker" />, type: 'Object' }
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