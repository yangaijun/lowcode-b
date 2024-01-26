import { Region, Table, Form } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `<Form  
    data={{rate3: 4}}
    columns={[ 
        {type: 'rate', prop: 'rate1'},
        {type: 'rate', prop: 'rate2', value: 3, style: {color: '#5774FF'}},
        {type: 'rate', prop: 'rate3',disabled: true, config: {count: 8}},
    ]}
/>`
export default function DRate() {
    return <div >
        <Region
            data={{
                use: `type: 'rate'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'Rate 评分' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Form
                                data={{ rate3: 4 }}
                                columns={[
                                    { type: 'rate', prop: 'rate1' },
                                    { type: 'rate', prop: 'rate2', value: 3, style: { color: '#5774FF' } },
                                    { type: 'rate', prop: 'rate3', disabled: true, config: { count: 8 } },
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
            <strong>提示：</strong> 事件由其父组件代理
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Rate props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: rate' },
                                { prop: 'value', des: '值', type: 'Number', defaultValue: '' },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'disabled', des: '是否禁用', type: 'Boolean / ({value, data}) => Boolean', defaultValue: 'false' },
                                { prop: 'config', des: <ToAntdDoc text='antd 其他 Rate 配置' name="rate" />, type: 'Object' }
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