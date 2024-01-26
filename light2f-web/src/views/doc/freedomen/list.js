import { Region, Table, List } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToColumns from './components/toColumns';
const f1 =
    `<List
    onEvent={params => {
        console.log(params)
        if (params.prop === 'button') {
            return {
                ...params.row,
                input: 'button set input'
            }
        }
    }}
    onChange={data => {
        console.log('change', data)
    }}
    data={[{}]}
    columns={[
        { type: 'input', prop: 'input', placeholder: 'please input' },
        { type: 'button-primary', prop: 'button', value: 'clickme set input' },
        { type: 'button-primary', prop: '$push', value: '添加一条' },
        { type: 'button', prop: '$delete', value: '删除' },
        { type: 'space', style: { marginBottom: 5, marginLeft: 5 } }
    ]}
/>`

export default function DList() { 
    return <div >
        <Region
            data={{
                use: `import { List } from 'freedomen' `, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'List 列表' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <List
                                onEvent={params => {
                                    console.log(params)
                                    if (params.prop === 'button') {
                                        return {
                                            ...params.row,
                                            input: 'button set input'
                                        }
                                    }
                                }}
                                onChange={data => {
                                    console.log('change', data)
                                }}
                                data={[{}]}
                                columns={[
                                    { type: 'input', prop: 'input', placeholder: 'please input' },
                                    { type: 'button-primary', prop: 'button', value: 'clickme set input' },
                                    { type: 'button-primary', prop: '$push', value: '添加一条' },
                                    { type: 'button', prop: '$delete', value: '删除' },
                                    { type: 'space', style: { marginBottom: 5, marginLeft: 5 } }
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
            <strong>提示：</strong> column prop 为 $push 可以新增一条数据， column prop 为 $delete 可以删除当前行数据，数组类都有效，如Table、FormList
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'List props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'data', des: '表单区域数据', type: 'any[]' },
                                { prop: 'columns', des: '必须的, 对应元素描述', type: <ToColumns /> },
                                {
                                    prop: 'onEvent', des: 'columns 内发生的事件', type: '({prop, type, value, row, column}) => void 0 || data',
                                    detail: <div>
                                        prop: 触发事件元素的prop <br />
                                        type: 触发事件类型 <br />
                                        value: 触发事件元素的最新值 <br />
                                        row: 当前表单的最新值 <br />
                                        column: 对应元素全量配置 <br />
                                        return data: 跟新当前行数据
                                    </div>
                                },
                                {
                                    prop: 'onChange', des: '数据变化，内部会维护，没特别需要，不需要外部维护', type: '(data) => void'
                                }
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