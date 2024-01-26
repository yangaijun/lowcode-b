import { Region, Table, Form } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToOptions from '../components/toOptions';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `const options = [{value: 1, label: '选项1'}, {value: 2, label: '选项2'}, {value: 3, label: '选项3', disabled: true }]
return <Form  
    data={{checkboxs3: [1, 2], checkboxs4: [1, 3] }}
    columns={[ 
        {type: 'checkboxs', prop: 'checkboxs1', options: options},
        {type: 'checkboxs', prop: 'checkboxs2', value: [1], options: options},
        {type: 'checkboxs', prop: 'checkboxs3', options: options},
        {type: 'checkboxs', prop: 'checkboxs4', value: [1], options: options},
    ]}
/>`
const f2 =
    `<Form
    data={{checkboxs3: [1]}}  
    columns={[ 
        {type: 'checkboxs', prop: 'checkboxs1', options: "选项一,选项二,选项三"},
        {type: 'checkboxs', prop: 'checkboxs2', options: {1: '选项一', 2: '选项二', 3: '选项三'}},
        {type: 'checkboxs', prop: 'checkboxs3', options({resolve}) {
            //get from api
            setTimeout(() => {
                //string/object/array
                resolve({1: '选项一', 2: '选项二', 3: <>选项3<span style={{color: 'red', marginLeft: 5}}>选它</span></>, 4: '选项4'}) 
            }, 1000)
        }},                   
    ]}
/>`
export default function DCheckboxs() {
    return <div >
        <Region
            data={{
                use: `type: 'checkboxs'`, f1, f2
            }}
            columns={[
                { type: 'text-div@title', value: 'Checkboxs 多选框组' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            const options = [{ value: 1, label: '选项1' }, { value: 2, label: '选项2' }, { value: 3, label: '选项3', disabled: true }]
                            return <Form
                                data={{ checkboxs3: [1, 2], checkboxs4: [1, 3] }}
                                columns={[
                                    { type: 'checkboxs', prop: 'checkboxs1', options: options },
                                    { type: 'checkboxs', prop: 'checkboxs2', value: [1], options: options },
                                    { type: 'checkboxs', prop: 'checkboxs3', options: options },
                                    { type: 'checkboxs', prop: 'checkboxs4', value: [1], options: options },
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
                                data={{ checkboxs3: [1] }}
                                columns={[
                                    { type: 'checkboxs', prop: 'checkboxs1', options: "选项一,选项二,选项三" },
                                    { type: 'checkboxs', prop: 'checkboxs2', options: { 1: '选项一', 2: '选项二', 3: '选项三' } },
                                    {
                                        type: 'checkboxs', prop: 'checkboxs3', options({ resolve }) {
                                            setTimeout(() => {
                                                //string/object/array
                                                resolve({ 1: '选项一', 2: '选项二', 3: <>选项3<span style={{ color: 'red', marginLeft: 5 }}>选它</span></>, 4: '选项4' })
                                            }, 1000)
                                        }
                                    },
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
            <strong>提示：</strong> 事件由其父组件代理, 不过要知道是哪个按钮触发事件的要加 prop 属性哦, 所以要正常使用是要有prop属性<br />
            Form/Region/Table...的data中的值会覆盖对应的value的值哦，<br />
            options有多种用法哦， value: label
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Checkboxs props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: checkboxs' },
                                { prop: 'value', des: '值', type: 'Array', defaultValue: '[]' },
                                { prop: 'options', des: '选项', type: <ToOptions />, defaultValue: '[]' },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'disabled', des: '是否禁用', type: 'Boolean / ({value, data}) => Boolean', defaultValue: 'false' },
                                { prop: 'config', des: <ToAntdDoc text='antd 其他 Checkbox Group 配置' name={"checkbox"} />, type: 'Object' }
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