import { Region, Table, Form } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `<Form
    data={{ switch5: 'checked' }}
    columns={[
        { type: 'switch', prop: 'switch1' },
        { type: 'switch', prop: 'switch2', value: true },
        { type: 'switch', prop: 'switch3', config: { size: 'small' } },
        { type: 'switch', prop: 'switch4', disabled: true },
        [
            { type: 'switch', prop: 'switch5', config: { checkedValue: 'checked', uncheckedValue: 'unchecked' } },
            { type: 'text-div', filter: ({ data }) => \`switch value： \${data.switch5}\`},
            {type: 'space'}
        ]
    ]}
/>`
export default function DSwitch() {
    return <div >
        <Region
            data={{
                use: `type: 'switch'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'Switch 开关' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Form
                                data={{ switch5: 'checked' }}
                                columns={[
                                    { type: 'switch', prop: 'switch1' },
                                    { type: 'switch', prop: 'switch2', value: true },
                                    { type: 'switch', prop: 'switch3', config: { size: 'small' } },
                                    { type: 'switch', prop: 'switch4', disabled: true },
                                    [
                                        { type: 'switch', prop: 'switch5', config: { checkedValue: 'checked', uncheckedValue: 'unchecked' } },
                                        { type: 'text-div', filter: ({ data }) => `switch value： ${data.switch5}` },
                                        { type: 'space' }
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
        <div className="fdoc-tip">
            <strong>提示：</strong> 同antd Switch 并且扩展
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Switch props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: switch' },
                                { prop: 'value', des: '值', type: 'Boolean' },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'disabled', des: '是否禁用', type: 'Boolean / ({value, data}) => Boolean', defaultValue: 'false' },
                                { prop: 'config.checkedValue', des: 'config扩展，开启时的值', type: 'any', defaultValue: 'true' },
                                { prop: 'config.uncheckedValue', des: 'config扩展，关闭时的值', type: 'any', defaultValue: 'false' },
                                { prop: 'config', des: <ToAntdDoc text='antd 其他 Switch 配置' name="switch" />, type: 'Object' },
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