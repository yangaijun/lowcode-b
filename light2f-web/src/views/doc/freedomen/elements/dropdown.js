import { Region, Table, Form } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToOptions from '../components/toOptions';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `const options = [{value: 1, label: '选项1'}, {value: 2, label: '选项2'}, {value: 3, label: '选项3'}]
return <Form  
    columns={[ 
        {type: 'dropdown', prop: 'dropdown1', options: options},
        {type: 'dropdown-a', prop: 'dropdown2', options: options},
        {type: 'dropdown-a', prop: 'dropdown3', options: options, text: '选择项目'},
        {type: 'dropdown', prop: 'dropdown1', options: options, config: {content: <span>custom content</span>}},
    ]}
/>`
const f2 =
    `<Form 
    onEvent={params => {
        console.log(params)
    }} 
    columns={[ 
        {type: 'dropdown', prop: 'dropdown1', options: {1: '选项1', 2: '选项2', three: '选项3'}},
        {type: 'dropdown', prop: 'dropdown2', options: "选项1,选项2,选项3"}
    ]}
/>`
export default function DDropdown() {
    return <div >
        <Region
            data={{
                use: `type: 'dropdown'`, f1, f2
            }}
            columns={[
                { type: 'text-div@title', value: 'Dropdown 下拉菜单' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            const options = [{ value: 1, label: '选项1' }, { value: 2, label: '选项2' }, { value: 3, label: '选项3' }]
                            return <Form
                                columns={[
                                    { type: 'dropdown', prop: 'dropdown1', options: options },
                                    { type: 'dropdown-a', prop: 'dropdown2', options: options },
                                    { type: 'dropdown-a', prop: 'dropdown3', options: options, text: '选择项目' },
                                    { type: 'dropdown', prop: 'dropdown1', options: options, config: { content: <span>custom content</span> } },
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f1', render },
                    { type: 'card@form', value: '1. 基本使用' }
                ],
                [
                    {
                        render() {
                            return <Form
                                onEvent={params => {
                                    console.log(params)
                                }}
                                columns={[
                                    { type: 'dropdown', prop: 'dropdown1', options: { 1: '选项1', 2: '选项2', three: '选项3' } },
                                    { type: 'dropdown', prop: 'dropdown2', options: "选项1,选项2,选项3" }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f2', render },
                    { type: 'card@form', value: '2. 不一样的options' }
                ]
            ]}
        />
        <div className="fdoc-tip">
            <strong>提示：</strong>
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Dropdown props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: dropdown/-a' },
                                { prop: 'text', des: '提示文本', type: 'String/ReactNode' },
                                { prop: 'options', des: '选项', type: <ToOptions />, defaultValue: '[]' },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'disabled', des: '是否禁用', type: 'Boolean / ({value, data}) => Boolean', defaultValue: 'false' },
                                { prop: 'config', des: <ToAntdDoc text={'antd 其他 Dropdown 配置'} name="dropdown" />, type: 'Object' }
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
                { type: 'text-div@title', value: 'Config 附加参数' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'content', des: '', type: 'ReactNode' },
                                { prop: 'labelname', des: '显示的label对应变量名', type: 'String' },
                                { prop: 'valuename', des: '值对应的变量名', type: 'String' },
                                { prop: 'optionvalue', des: '将返回值设置为option对象', type: 'true/false' },
                                { prop: 'debounceWait', des: 'options为函数时，防抖等待时间(default: 280ms)', type: 'number' },
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
                                }
                            ]}
                        />
                    }
                }
            ]}
        />
    </div>
}