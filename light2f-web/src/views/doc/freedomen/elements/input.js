import { Region, Table, Form } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `<Form          
    columns={[ 
        {type: 'input', prop: 'input', placeholder: '请输入姓名'},
        {type: 'input-password', prop: 'password'},
        {type: 'input-search@w220', prop: 'search'}, 
        {type: 'input-area', prop: 'area', config: {rows: 4}}
    ]}
/>`
const f2 =
    `<Form  
    onEvent={params => {
        if (params.prop === 'search' && 'search' === params.type) {
            alert(params.value)
        } else {
            console.log(params)
        }
    }}
    columns={[ 
        {type: 'input', prop: 'input', config: {suffix: ".com"}},
        {type: 'input-search@w260', prop: 'search'}
    ]}
/>`
export default function DInput() {
    return <div >
        <Region
            data={{
                use: `type: 'input'`, f1, f2
            }}
            columns={[
                { type: 'text-div@title', value: 'Input 输入框' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Form
                                columns={[
                                    { type: 'input', prop: 'input', placeholder: '请输入姓名' },
                                    { type: 'input-password', prop: 'password' },
                                    { type: 'input-search@w220', prop: 'search' },
                                    { type: 'input-area', prop: 'area', config: { rows: 4 } }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f1', render },
                    { type: 'card@form', value: '1. 基本使用' }
                ], [
                    {
                        render() {
                            return <Form
                                onEvent={params => {
                                    if (params.prop === 'search' && 'search'.includes(params.type)) {
                                        alert(params.value)
                                    } else {
                                        console.log(params)
                                    }
                                }}
                                columns={[
                                    { type: 'input', prop: 'input', config: { suffix: ".com" } },
                                    { type: 'input-search@w260', prop: 'search' }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f2', render },
                    { type: 'card@form', value: '2. 事件处理' }
                ]
            ]}
        />
        <div className="fdoc-tip">
            <strong>提示：</strong> 事件由其父组件代理, 不过要知道是哪个按钮触发事件的要加 prop 属性哦, 所以要正常使用是要有prop属性<br />
            类型后面 + @w + number, 可以直接设置组件宽度哦

        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Input props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: input/-area/-password/-search' },
                                { prop: 'value', des: '值', type: 'Array', defaultValue: '[]' },
                                { prop: 'placeholder', des: 'placeholder', type: 'string' },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'disabled', des: '是否禁用', type: 'Boolean / ({value, data}) => Boolean', defaultValue: 'false' },
                                { prop: 'config', des: '下表，antd 其他 Input 配置， key: value', type: 'Object' }
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
                                { prop: '...', des: <ToAntdDoc text={'antd 其他 Input 配置'} name="input" />, type: '...' },
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