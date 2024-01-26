import { Region, Table, Form } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToOptions from '../components/toOptions';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `<Form
    columns={[
        {
            type: 'mentions', placeholder: '请输入@', prop: 'mentions', options({ resolve }) {
                resolve("张三,李四,王二")
            }
        },
        { type: 'mentions', placeholder: '请输入@', prop: 'mentions2', options: { "zhangsan": '张三', 'lisi': '李四' } }
    ]}
/>`
export default function DMentions() {
    return <div >
        <Region
            data={{
                use: `type: 'mentions'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'Mentions 提及' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Form
                                columns={[
                                    {
                                        type: 'mentions', placeholder: '请输入@', prop: 'mentions', options({ resolve }) {
                                            resolve("张三,李四,王二")
                                        }
                                    },
                                    { type: 'mentions', placeholder: '请输入@', prop: 'mentions2', options: { "zhangsan": '张三', 'lisi': '李四' } }
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
            <strong>提示：</strong> 同antd Mentions
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Mentions props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: mentions' },
                                { prop: 'value', des: '值', type: 'String' },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'options', des: '选项', type: <ToOptions />, defaultValue: '[]' },
                                { prop: 'config', des: <ToAntdDoc text="antd 其他 Mentions 配置" name={"mentions"} /> , type: 'Object' }
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