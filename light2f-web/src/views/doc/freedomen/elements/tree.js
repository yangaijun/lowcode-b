import { Region, Table, Form } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToOptions from '../components/toOptions';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `const options = [{
    value: 1, label: '选项1', children: [
        { value: 11, label: '选项1-1' },
        { value: 12, label: '选项1-2' }
    ]
}, {
    value: 2, label: '选项2'
}, {
    value: 3, label: '选项3'
}]
return <Form
    columns={[
        { type: 'tree', prop: 'tree1', options: options },
        { type: 'tree-select', prop: 'tree2', value: [12, 2], options: options }
    ]}
/>`
export default function DTree() {
    return <div >
        <Region
            data={{
                use: `type: 'tree'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'Tree 树' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            const options = [{
                                value: 1, label: '选项1', children: [
                                    { value: 11, label: '选项1-1' },
                                    { value: 12, label: '选项1-2' }
                                ]
                            }, {
                                value: 2, label: '选项2'
                            }, {
                                value: 3, label: '选项3'
                            }]
                            return <Form
                                onEvent={params => {
                                    console.log(params)
                                }}
                                columns={[
                                    { type: 'tree', prop: 'tree1', options: options },
                                    { type: 'tree-select', prop: 'tree2', value: [12, 2], options: options }
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
            <strong>提示：</strong>单选啊等等都和其antd Tree配置一样，tree 单选，tree-select 多选，但选择项都有数组
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Tree props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: tree/-select' },
                                { prop: 'value', des: '值', type: 'String/Number/Array', defaultValue: '[]' },
                                { prop: 'options', des: '选项', type: <ToOptions />, defaultValue: '[]' },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'disabled', des: '是否禁用', type: 'Boolean / ({value, data}) => Boolean', defaultValue: 'false' },
                                { prop: 'config', des: <ToAntdDoc text='antd 其他 Tree 配置' name="tree" />, type: 'Object' }
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
                // { type: 'text-div@title', value: 'Config 附加参数' },
                // {
                //     render() {
                //         return <Table
                //             data={[
                //                 { prop: 'labelname', des: '显示的label对应变量名', type: 'String' },
                //                 { prop: 'valuename', des: '值对应的变量名', type: 'String' },
                //                 { prop: 'optionvalue', des: '将返回值设置为option对象', type: '1 / 0' }
                //             ]}
                //             pagination={false}
                //             columns={[
                //                 { label: '参数', prop: 'prop' },
                //                 { label: '说明', prop: 'des' },
                //                 {
                //                     label: '类型', prop: 'type', render({ value, data }) {
                //                         if (data.detail)
                //                             return <Popover content={data.detail}>
                //                                 {value}
                //                             </Popover>
                //                         else return value
                //                     }
                //                 }
                //             ]}
                //         />
                //     }
                // }
            ]}
        />
    </div>
}