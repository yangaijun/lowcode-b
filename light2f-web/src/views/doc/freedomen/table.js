import { Region, Table } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToColumns from './components/toColumns';
import ToAntdDoc from './components/toAntdDoc';
const f1 =
    `<Table 
    data={[
        { name: '张三', gender: 1, birth: new Date()},
        { name: '王非', gender: 2, birth: new Date()},
    ]}
    pagination={false}
    columns={[
        {label: '姓名', prop: 'name'},
        {label: '性别', prop: 'gender', filter: {1: 'boy', 2: 'girl'}},
        {label: '出生日期', prop: 'birth', filter: 'yyyy-MM-dd'} 
    ]}
/>`
const f2 =
    `<Table 
    data={[
        { name: '张三', gender: 1, birth: new Date() },
        { name: '王非', gender: 2, birth: new Date()},
    ]}
    pagination={false}
    onEvent={({prop, row}) => {
        if (prop === 'edit') {
            alert('you cilck delete, current row:' + JSON.stringify(row))
        } else if (prop === 'delete') {
            alert('you cilck edit, current row:' + JSON.stringify(row))
        }
    }}
    onChange={data => {
        console.log(data)
    }}
    columns={[
        {label: '下标', prop: '$index'},
        {label: '姓名', prop: 'name'},
        {label: '性别', prop: 'gender', render ({value}) {
            const filter = {1: 'BOY', 2: 'GIRL'}[value]
            const filteCn = {1: '男孩', 2: '女孩'}[value]
            return <div>
                <span>{ filter }</span>
                <span style={{color: '#40A9FF', marginLeft: 10}}>{filteCn}</span>
            </div>
        }},
        {label: '出生日期', prop: 'birth', filter: 'yyyy-MM-dd'},
        {label: '操作', render() {
            return [
                {type: 'button-link', prop: 'edit', value: '编辑'},
                {type: 'button-link', prop: 'delete', value: '删除'},
                {type: 'space'}
            ]
        }} 
    ]}
/>`
const f3 =
    `<Table 
    data={[
        { name: '张三', gender: 1, birth: new Date() },
        { name: '王非', gender: 2, birth: new Date()},
    ]}
    pagination={false}
    onEvent={({prop, row}) => {
        if (prop === 'editOrSave') {
            row.edit = !row.edit
            return row
        } 
    }}
    columns={[
        {label: '姓名', prop: 'name', type:({data}) => data.edit ? 'input' : 'text'},
        {
            label: '性别', 
            prop: 'gender', 
            type:({data}) => data.edit ? 'select' : 'text', 
            options: {1: 'boy', 2: 'girl'},  
            filter: {1: 'boy', 2: 'girl'}
        },
        {label: '出生日期', prop: 'birth', type:({data}) => data.edit ? 'date' : 'text', filter: 'yyyy-MM-dd'},
        {label: '操作', width: 160, render() {
            return [
                { type: 'button-link', prop: '$push', value: '添加'},
                { type: 'button-link', prop: 'editOrSave', filter: ({ data }) => data.edit ? '保存' : '编辑', style: { marginLeft: -12 } },
            ]
        }} 
    ]}
/>`
const f4 =
    `<Table 
    data={[
        { name: '张三', gender: 1, birth: new Date(), province: '江苏', city: '苏州', area: '吴中', address: 'wawawaliwa' },
        { name: '王非', gender: 2, birth: new Date(), province: '上海', city: '上海', area: '徐汇', address: 'xixixxitity' },
    ]}
    pagination={false}
    columns={[
        {label: '姓名', prop: 'name'},
        [
            {label: '省', prop: 'province'},
            {label: '市', prop: 'city'},
            {label: '区', prop: 'area'},
            {label: '详细', prop: 'address'},
            {label: '地址', type: 'tablecolgroup'}
        ],
        {label: '性别', prop: 'gender', filter: {1: 'boy', 2: 'girl'}},
        {label: '出生日期', prop: 'birth', filter: 'yyyy-MM-dd'} 
    ]}
/>`
const f5 =
    `<Table 
    data={[
        { name: '张三', gender: 1, birth: new Date()},
        { name: '王非', gender: 2, birth: new Date()},
    ]}
    config={{selection: true}}
    pagination={false}
    onEvent={({prop, value}) => {
        if (prop === '$selection') {
            console.log(value)
        }
    }}
    columns={[
        {label: '姓名', prop: 'name'},
        {label: '性别', prop: 'gender', filter: {1: 'boy', 2: 'girl'}},
        {label: '出生日期', prop: 'birth', filter: 'yyyy-MM-dd'} 
    ]}
/>`
const f6 =
    `<Table 
    data={[
        { name: '张三1', gender: 1, birth: new Date() },
        { name: '王非2', gender: 2, birth: new Date() },
        { name: '王菲菲3', gender: 2, birth: new Date() },
        { name: '张三4', gender: 1, birth: new Date() },
        { name: '王非5', gender: 2, birth: new Date() },
        { name: '王菲菲6', gender: 2, birth: new Date() },
        { name: '张三7', gender: 1, birth: new Date() },
        { name: '王非8', gender: 2, birth: new Date() },
        { name: '王菲菲9', gender: 2, birth: new Date() },
        { name: '张三12', gender: 1, birth: new Date() },
        { name: '王非11', gender: 2, birth: new Date() },
        { name: '王菲菲10', gender: 2, birth: new Date() },
        { name: '张三13', gender: 1, birth: new Date() },
        { name: '王非14', gender: 2, birth: new Date() },
        { name: '王菲菲15', gender: 2, birth: new Date() },
        { name: '张三16', gender: 1, birth: new Date() },
        { name: '王非17', gender: 2, birth: new Date() },
        { name: '王菲菲18', gender: 2, birth: new Date() },
        { name: '张三21', gender: 1, birth: new Date() },
        { name: '王非22', gender: 2, birth: new Date() },
        { name: '王菲菲23', gender: 2, birth: new Date() },
        { name: '张三24', gender: 1, birth: new Date() },
        { name: '王非25', gender: 2, birth: new Date() },
        { name: '王菲菲26', gender: 2, birth: new Date() },
        { name: '张三27', gender: 1, birth: new Date() },
        { name: '王非28', gender: 2, birth: new Date() },
        { name: '王菲菲29', gender: 2, birth: new Date() },
    ]}
    pagination={{total: 27}}
    onEvent={({prop, value}) => {
        if (prop === '$page') {
            console.log(value)
        }
    }}
    columns={[
        {label: '姓名', prop: 'name', style: {color: 'rgba(255, 0, 0, .5)'}},
        {label: '性别', prop: 'gender', filter: {1: 'boy', 2: 'girl'}},
        {label: '出生日期', prop: 'birth', filter: 'yyyy-MM-dd'} 
    ]}
/>`
export default function DTable() {
    return <div >
        <Region
            data={{
                use: `imoprt { Table } from 'freedomen'`, f1, f2, f3, f4, f5, f6
            }}
            columns={[
                { type: 'text-div@title', value: 'Table 表格' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Table
                                data={[
                                    { name: '张三', gender: 1, birth: new Date() },
                                    { name: '王非', gender: 2, birth: new Date() },
                                ]}
                                pagination={false}
                                columns={[
                                    { label: '姓名', prop: 'name' },
                                    { label: '性别', prop: 'gender', filter: { 1: 'boy', 2: 'girl' } },
                                    { label: '出生日期', prop: 'birth', filter: 'yyyy-MM-dd' }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f1', render },
                    { type: 'card@form', value: '1. 基本表格' }
                ],
                [
                    {
                        render() {
                            return <Table
                                data={[
                                    { name: '张三', gender: 1, birth: new Date() },
                                    { name: '王非', gender: 2, birth: new Date() },
                                ]}
                                pagination={false}
                                onEvent={({ prop, row }) => {
                                    if (prop === 'edit') {
                                        alert('you cilck delete, current row:' + JSON.stringify(row))
                                    } else if (prop === 'delete') {
                                        alert('you cilck edit, current row:' + JSON.stringify(row))
                                    }
                                }}
                                columns={[
                                    { label: '下标', prop: '$index' },
                                    { label: '姓名', prop: 'name' },
                                    {
                                        label: '性别', prop: 'gender', render({ value }) {
                                            const filter = { 1: 'BOY', 2: 'GIRL' }[value]
                                            const filterEn = { 1: '男孩', 2: '女孩' }[value]
                                            return <div>
                                                <span>{filter}</span>
                                                <span style={{ color: '#40A9FF', marginLeft: 10 }}>{filterEn}</span>
                                            </div>
                                        }
                                    },
                                    { label: '出生日期', prop: 'birth', filter: 'yyyy-MM-dd' },
                                    {
                                        label: '操作', render() {
                                            return [
                                                { type: 'button-link', prop: 'edit', value: '编辑' },
                                                { type: 'button-link', prop: 'delete', value: '删除' },
                                                { type: 'space' }
                                            ]
                                        }
                                    }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f2', render },
                    { type: 'card@form', value: '2. 多元素列' }
                ], [
                    {
                        render() {
                            return <Table
                                data={[
                                    { name: '张三', gender: 1, birth: new Date() },
                                    { name: '王非', gender: 2, birth: new Date() },
                                ]}
                                pagination={false}
                                onEvent={({ prop, row }) => {
                                    if (prop === 'editOrSave') {
                                        row.edit = !row.edit
                                        return row
                                    }
                                }}
                                onChange={data => {
                                    console.log(data)
                                }}
                                columns={[
                                    { label: '姓名', prop: 'name', type: ({ data }) => data.edit ? 'input@w120' : 'text' },
                                    { label: '性别', prop: 'gender', type: ({ data }) => data.edit ? 'select@w120' : 'text', options: { 1: 'boy', 2: 'girl' }, filter: { 1: 'boy', 2: 'girl' } },
                                    { label: '出生日期', prop: 'birth', type: ({ data }) => data.edit ? 'date@w120' : 'text', filter: 'yyyy-MM-dd' },
                                    {
                                        label: '操作', width: 160, render() {
                                            return [
                                                { type: 'button-link', prop: '$push', value: '添加' },
                                                { type: 'button-link', prop: 'editOrSave', filter: ({ data }) => data.edit ? '保存' : '编辑', style: { marginLeft: -12 } },
                                            ]
                                        }
                                    }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f3', render },
                    { type: 'card@form', value: '3. 动态编辑' }
                ], [
                    { type: 'text-div', value: '注：表格分组容器的固定 type 值为 tablecolgroup, 其只有 label 属性（freedomen 版本：3.1.0）', style: { marginBottom: 12 } },
                    {
                        render() {
                            return <Table
                                data={[
                                    { name: '张三', gender: 1, birth: new Date(), province: '江苏', city: '苏州', area: '吴中', address: 'wawawaliwa' },
                                    { name: '王非', gender: 2, birth: new Date(), province: '上海', city: '上海', area: '徐汇', address: 'xixixxitity' },
                                ]}
                                pagination={false}
                                columns={[
                                    { label: '姓名', prop: 'name' },
                                    [
                                        { label: '省', prop: 'province' },
                                        { label: '市', prop: 'city' },
                                        { label: '区', prop: 'area' },
                                        { label: '详细', prop: 'address' },
                                        { label: '地址', type: 'tablecolgroup' }
                                    ],
                                    { label: '性别', prop: 'gender', filter: { 1: 'boy', 2: 'girl' } },
                                    { label: '出生日期', prop: 'birth', filter: 'yyyy-MM-dd' }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f4', render },
                    { type: 'card@form', value: '4. 分组表头' }
                ], [
                    {
                        render() {
                            return <Table
                                data={[
                                    { name: '张三', gender: 1, birth: new Date() },
                                    { name: '王非', gender: 2, birth: new Date() },
                                ]}
                                config={{ selection: true }}
                                pagination={false}
                                onEvent={({ prop, value }) => {
                                    if (prop === '$selection') {
                                        console.log(value)
                                    }
                                }}
                                columns={[
                                    { label: '姓名', prop: 'name' },
                                    { label: '性别', prop: 'gender', filter: { 1: 'boy', 2: 'girl' } },
                                    { label: '出生日期', prop: 'birth', filter: 'yyyy-MM-dd' }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f5', render },
                    { type: 'card@form', value: '5. 多选表格' }
                ], [
                    {
                        render() {
                            return <Table
                                data={[
                                    { name: '张三1', gender: 1, birth: new Date() },
                                    { name: '王非2', gender: 2, birth: new Date() },
                                    { name: '王菲菲3', gender: 2, birth: new Date() },
                                    { name: '张三4', gender: 1, birth: new Date() },
                                    { name: '王非5', gender: 2, birth: new Date() },
                                    { name: '王菲菲6', gender: 2, birth: new Date() },
                                    { name: '张三7', gender: 1, birth: new Date() },
                                    { name: '王非8', gender: 2, birth: new Date() },
                                    { name: '王菲菲9', gender: 2, birth: new Date() },
                                    { name: '张三12', gender: 1, birth: new Date() },
                                    { name: '王非11', gender: 2, birth: new Date() },
                                    { name: '王菲菲10', gender: 2, birth: new Date() },
                                    { name: '张三13', gender: 1, birth: new Date() },
                                    { name: '王非14', gender: 2, birth: new Date() },
                                    { name: '王菲菲15', gender: 2, birth: new Date() },
                                    { name: '张三16', gender: 1, birth: new Date() },
                                    { name: '王非17', gender: 2, birth: new Date() },
                                    { name: '王菲菲18', gender: 2, birth: new Date() },
                                    { name: '张三21', gender: 1, birth: new Date() },
                                    { name: '王非22', gender: 2, birth: new Date() },
                                    { name: '王菲菲23', gender: 2, birth: new Date() },
                                    { name: '张三24', gender: 1, birth: new Date() },
                                    { name: '王非25', gender: 2, birth: new Date() },
                                    { name: '王菲菲26', gender: 2, birth: new Date() },
                                    { name: '张三27', gender: 1, birth: new Date() },
                                    { name: '王非28', gender: 2, birth: new Date() },
                                    { name: '王菲菲29', gender: 2, birth: new Date() }
                                ]}
                                pagination={{ total: 27 }}
                                onEvent={({ prop, value }) => {
                                    if (prop === '$page') {
                                        console.log(value)
                                    }
                                }}
                                columns={[
                                    { label: '姓名', prop: 'name', style: { color: 'rgba(255, 0, 0, .5)' } },
                                    { label: '性别', prop: 'gender', filter: { 1: 'boy', 2: 'girl' } },
                                    { label: '出生日期', prop: 'birth', filter: 'yyyy-MM-dd' }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f6', render },
                    { type: 'card@form', value: '6. 分页表格' }
                ]
            ]}
        />
        <div className="fdoc-tip">
            <strong>提示：</strong> columns中的render 不仅可以return ReactNode, 还可以react Region columns数组, 缺省不写类型，默认text-span，当然有render函数，
            就优先使用 render 函数来展示
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Table props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'data', des: '表格的数据', type: 'Array', defaultValue: "[]" },
                                { prop: 'columns', des: '必须的, 对应元素描述', type: <ToColumns type="Table" /> },
                                {
                                    prop: 'onEvent', des: 'columns 内发生的事件，$page, $sorter都在', type: '({[$index], prop, type, value, row, column}) => void 0 / data',
                                    detail: <div>
                                        $index: 触发事件的行下表 <br />
                                        prop: 触发事件元素的prop <br />
                                        type: 触发事件类型 <br />
                                        value: 触发事件元素的最新值 <br />
                                        row: 当前行的最新值 <br />
                                        column: 对应元素全量配置 <br />
                                        return data: 跟当前行的数据
                                    </div>
                                },
                                {
                                    prop: 'onChange', des: '数据变化，内部会维护，没特别需要，不需要外部维护', type: '(data) => void'
                                },
                                {
                                    prop: 'pagination', des: '分页配置', type: 'false / {total, ...antd pagination config }',
                                    detail: <div>
                                        false: 不需要分页<br />
                                        {"{total, ...}"}: total, 总条数, ...其他antd pagination配置, <br />
                                        其中分页事件交给event代理， 可以打印event的params查看:  <br />
                                        prop === $page: 页数，每页大小， <br />
                                        prop === '$pageNo': 页数，<br />
                                        prop === '$pageSize': 每页大小
                                    </div>
                                },
                                { prop: 'config', des: '见下表，和antd 其他 Table 配置， key: value', type: 'Object' }
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
                                    prop: 'selection', des: '是否可以选择', type: 'boolean', defaultValue: 'false',
                                    detail: <div>
                                        false: 不需要选择<br />
                                        true: 可以选择, 选择事件交给event代理，可以打印event的params查看<br />
                                        prop === $selection
                                    </div>
                                },
                                { prop: 'align', des: '设置列的对齐方式', type: 'string: left | right | center', defaultValue: 'left' },
                                {
                                    prop: 'disabled', des: '选择时不可选', type: 'boolean/(row行数据:any) => boolean', defaultValue: 'false'
                                },
                                { prop: '...', des: <ToAntdDoc text={'antd Table 其他配置'} name="table" />, type: '...' },
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
                { type: 'text-div@title', value: 'Table 的 columns 属性的子对象附加属性' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'label', des: '标签 title', type: 'ReactNode' },
                                { prop: 'width', des: '宽度', type: 'Number' },
                                { prop: 'fixed', des: '固定', type: 'Boolean', defaultValue: 'false' },
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
                                { label: '默认值', prop: 'defaultValue' },
                            ]}
                        />
                    }
                }
            ]}
        />

    </div>
}