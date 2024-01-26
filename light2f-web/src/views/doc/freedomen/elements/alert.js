import { Region, Table, Form } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `<Form
    data={{ alert1: '提示1，来自prop' }}
    columns={[
        { type: 'alert', prop: 'alert1' },
        { type: 'alert-success', value: 'success' },
        { type: 'alert-info', value: 'info' },
        { type: 'alert-warning', value: 'warning', config: { description: "其它属性在config中" } },
        { type: 'alert-error', value: 'error', config: { closable: true } },
    ]}
/>`

export default function DAlert() {
    return <div >
        <Region
            data={{
                use: `type: 'alert'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'Alert 警告提示' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Form
                                data={{ alert1: `提示1，来自prop` }}
                                columns={[
                                    { type: 'alert', prop: 'alert1' },
                                    { type: 'alert-success', value: 'success' },
                                    { type: 'alert-info', value: 'info' },
                                    { type: 'alert-warning', value: 'warning', config: { description: "其它属性在config中" } },
                                    { type: 'alert-error', value: 'error', config: { closable: true } },
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
            <strong>提示：</strong> 同antd Alert
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Alert props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: alert-success/info/warning/error' },
                                { prop: 'value', des: '值，同 antd Alert 的 message 字段', type: 'String' },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'config', des: <ToAntdDoc text={'antd 其他 Alert 配置'} name="alert" />, type: 'Object' }
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