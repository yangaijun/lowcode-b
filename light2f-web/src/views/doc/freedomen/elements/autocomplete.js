import { Region, Table, Form } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToOptions from '../components/toOptions';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `<Form  
    columns={[
        {
            type: 'autocomplete', placeholder: '请输入abc', prop: 'autocomplate1', options({ resolve, value }) {
                resolve(value?.includes('abc') ? "abc123,abc456,abc789" : void 0) 
            }
        },
        { type: 'autocomplete', prop: 'autocomplate2' }
    ]}
/>`
export default function DAutoComplete() {
    return <div >
        <Region
            data={{
                use: `type: 'autocomplete'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'AutoComplete 自动完成' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Form
                                columns={[
                                    {
                                        type: 'autocomplete', placeholder: '请输入abc', prop: 'autocomplate1', options({ resolve, value }) {
                                            resolve(value?.includes('abc') ? "abc123,abc456,abc789" : void 0)
                                        }
                                    },
                                    { type: 'autocomplete', prop: 'autocomplate2' }
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
            <strong>提示：</strong> 同antd AutoComplete
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'AutoComplete props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: autocomplete' },
                                { prop: 'value', des: '值', type: 'String' },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'options', des: '选项', type: <ToOptions />, defaultValue: '[]' },
                                { prop: 'config', des: '下表，antd 其他 AutoComplete 配置， key: value', type: 'Object' }
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
                },
                { type: 'text-div@title', value: 'config 参数' },
                {
                    render() {
                        return <Table
                            data={[
                                {
                                    prop: 'changeEventType', des: '触发change事件方式', type: 'Enum:blur/input', defaultValue: 'input',
                                    detail: <div>
                                        blur: 失焦触发<br />
                                        input: 数据改变（输入）触发<br />
                                    </div>
                                }, 
                                { prop: 'debounceWait', des: 'options为函数时，防抖等待时间(default: 280ms)', type: 'number' },
                                { prop: '...', des: <ToAntdDoc name="auto-complete" text={'antd 其他 AutoComplete 配置'} />, type: '...' },
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