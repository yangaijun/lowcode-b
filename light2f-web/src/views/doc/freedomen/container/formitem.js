import { Region, Table, Form } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToAntdDoc from '../components/toAntdDoc';

const f1 =
    `<Form  
    columns={[ 
        {type: 'text', label: '文本'},
        [
            {type: 'input@w200', prop: 'start'},
            {type: 'text', value: '——', style: {margin: '0 15px'}},
            {type: 'select@w200', prop: 'select', options: "select1,select2"},
            {type: 'formitem', label: '二合一'}
        ] 
    ]}
/>`
export default function DFormItem() {
    return <div >
        <Region
            data={{
                use: `type: 'formitem'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'FormItem 表单行' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Form
                                columns={[
                                    { type: 'text', label: '文本' },
                                    [
                                        { type: 'input@w200', prop: 'start' },
                                        { type: 'text', value: '——', style: { margin: '0 15px' } },
                                        { type: 'select@w200', prop: 'select', options: "select1,select2" },
                                        { type: 'formitem', label: '二合一' }
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
        <div style={{
            backgroundColor: '#eef2ff',
            padding: 10,
            marginBottom: 5,
            marginTop: 25
        }}>
            <strong>提示：</strong>容器只能在数组最后一个元素哦， formitem 仅仅于 Form 组件内有效哦！
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'FormItem props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: formitem' },
                                { prop: 'label', des: '标签名', type: 'ReactNode' },
                                { prop: 'config', des: <ToAntdDoc text='antd 其他 Form.Item 配置' name={'form'} />, type: 'Object' }
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