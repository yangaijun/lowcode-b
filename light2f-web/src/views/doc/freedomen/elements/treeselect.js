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
        { type: 'treeselect', prop: 'treeselect1', options: options },
        { type: 'treeselect-multiple', prop: 'treeselect', options: options }
    ]}
/>`
export default function DTreeselect() {
    return <div >
        <Region
            data={{
                use: `type: 'treeselect'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'TreeSelect 下拉树' },
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
                                columns={[
                                    { type: 'treeselect', prop: 'treeselect1', options: options },
                                    { type: 'treeselect-multiple', prop: 'treeselect', options: options }
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
            <strong>提示：</strong> config中labelname 和 valuename, 可以改变对应label,value使用的名称哦, 而 optionvalue可以让选中的值直接为option对象哦
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'TreeSelect props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: treeselect/-multiple' },
                                { prop: 'value', des: '值', type: 'String/Number/Array(mutiple类型)', defaultValue: '' },
                                { prop: 'options', des: '选项', type: <ToOptions />, defaultValue: '[]' },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'disabled', des: '是否禁用', type: 'Boolean / ({value, data}) => Boolean', defaultValue: 'false' },
                                { prop: 'config', des: <ToAntdDoc text='antd 其他 TreeSelect 配置' name="tree-select" />, type: 'Object' }
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
                                { prop: 'labelname', des: '显示的label对应变量名, default: label', type: 'String' },
                                { prop: 'valuename', des: '值对应的变量名, default: value', type: 'String' },
                                { prop: 'childrenname', des: '子对象名：default:children', type: 'String' },
                                { prop: 'filterable', des: '是否可以打字搜索', type: 'true/false' },
                                { prop: 'debounceWait', des: 'options为函数时，防抖等待时间(default: 280ms)', type: 'number' },
                                { prop: 'maxcount', des: '当type为multiple时，设最多选择数量', type: 'Number' }
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