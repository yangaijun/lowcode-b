import { Region, Table, Form } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `<Form
    columns={[
        { type: 'daterange', prop: 'date1', value: ['2012-09-11'], placeholder: ['选择开始日期', '选择结束日期'] },
        { type: 'daterange-year@w220', prop: 'date2' },
        { type: 'daterange-month@w240', prop: 'date3' },
        { type: 'daterange-week@w260', prop: 'date4' },
        { type: 'daterange-quarter@w280', prop: 'date5', disabled: true },
    ]}
/>` 
export default function DDateRange() {
    return <div >
        <Region
            data={{
                use: `type: 'daterange'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'DateRange 日期范围' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Form
                                columns={[
                                    { type: 'daterange', prop: 'date1', value: ['2012-09-11'], placeholder: ['选择开始日期', '选择结束日期'] },
                                    { type: 'daterange-year@w220', prop: 'date2' },
                                    { type: 'daterange-month@w240', prop: 'date3' },
                                    { type: 'daterange-week@w260', prop: 'date4' },
                                    { type: 'daterange-quarter@w280', prop: 'date5', disabled: true },
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
            <strong>提示：</strong> 事件由其父组件代理, 不过要知道是哪个按钮触发事件的要加 prop 属性哦, 所以要正常使用是要有prop属性<br />
            类型后面 + @w + number, 可以直接设置组件宽度哦

        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'DateRange props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: daterange/-year/-month/-week/-quarter' },
                                { prop: 'value', des: '值', type: '[Date, Date]/[DateString, DateString]', defaultValue: '' },
                                { prop: 'placeholder', des: 'placeholder', type: '[string, string]' },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'disabled', des: '是否禁用', type: 'Boolean / ({value, data}) => Boolean', defaultValue: 'false' },
                                { prop: 'config', des: <ToAntdDoc text={'antd 其他 Date.RangePicker 配置'} name="date-picker" api="RangePicker" />, type: 'Object' }
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