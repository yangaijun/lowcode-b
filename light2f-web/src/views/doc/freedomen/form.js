import { useRef } from 'react'
import { Region, Table, Form, FormList } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToColumns from './components/toColumns';
import ToAntdDoc from './components/toAntdDoc';

const f1 =
    `<Form  
    onSubmit={data => {
        console.log(data)
    }}
    columns={[
        {type: 'input', label: 'Username', prop: 'username', rule: {'must': 'Please input your username!'}},
        {type: 'input-password', prop: 'password', label: 'Password', rule: 'must'},
        {type: 'button-primary', prop: '$submit', value: 'Submit', config: {wrapperCol: { offset: 4}}}
    ]}
/> `
const f2 =
    `<Form  
    onSubmit={data => {
        console.log(data)
    }}
    onEvent={({prop, value, row}) => {
        if (prop === 'gender') {
            return {
                ...row,
                note: \`Hi, \${value}\`
            }
        } else if (prop === 'fill') {
            return {
                note: 'Hello world!',
                gender: 'male',
            }
        }
    }}
    columns={[
        {type: 'input', label: 'Note', prop: 'note', rule: 'must'},
        {type: 'select', prop: 'gender', label: 'Gender', options: "male,female,other", rule: 'must'},
        {type: 'input', prop: 'other', label: 'Customize Gender', load:({data}) => data.gender === 'other', rule: 'must'},
        [
            {type: 'button-primary', prop: '$submit', value: 'Submit'},
            {type: 'button', prop: '$reset', value: 'Reset', style: {margin: '0 12px'}},
            {type: 'button-link', prop: 'fill', value: 'Fill form'},
            {type: 'formitem', config: {wrapperCol: { offset: 4}}}
        ]
    ]}
/>`
const f3 =
    `<Form 
    columns={[ 
        {type: 'date@w220', prop: 'date', label: 'date', config: {labelCol: { span: 2}}, rule: 'must'},
        [
            {type: 'input', label: 'input1', span: 12, prop: 'input1'},
            {type: 'input', label: 'input2', span: 12, prop: 'input2'},
            {type: 'input', label: 'input3', span: 12, prop: 'input3'},
            {type: 'input', label: 'input4', span: 12, prop: 'input4'},
            {type: 'row'}
        ],
        {type: 'button', prop: '$submit', value: 'Submit', config: {wrapperCol: { offset: 2}}}
    ]}
/>`
const f4 =
    `<Form 
    onSubmit={data => {
        console.log(data)
    }}
    columns={[ 
        {type: 'input', prop: 'async', label: 'async', placeholder: '请输入 user', rule({value}) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (value === 'user')
                        resolve()
                    else reject('输入错误')
                }, 300)
            })
        }},
        {type: 'input', prop: 'username', label: 'Username', rule: {must: '请输入用户名'}},
        {type: 'input-password', prop: 'password', label: 'Password', rule: {must: '请输入密码'}},
        {type: 'input-password', prop: 'rePassword', label: 'RePassowrd', rule({data, value}) {
            if (data.password !== value)
                return Promise.reject('二次密码不一致')
            else return Promise.resolve()
        }},
        {type: 'button-primary', prop: '$submit', value: 'Login', config: {wrapperCol: { offset: 4}}}
    ]}
/>`
const f5 =
    `const header = (value) => {
    return <div style={{marginLeft: 248, marginBottom: 22}}>
        <span style={{padding: '1px 10px', backgroundColor: '#eef2ff', borderRadius: 2, borderLeft: '4px solid #5774FF'}}>
            {value}
        </span>
    </div>
}
return <Form 
    columns={[
        { render: () => render('用户信息') },
        { type: 'input@w220', prop: 'user.name', label: 'name', rule: 'must' },
        { type: 'date@w220', prop: 'user.birthday', label: 'birthday' },
        { type: 'select@w220', prop: 'user.gender', label: 'gender', options: { 1: 'male', 2: 'female' } },
        { render: () => render('其他信息') },
        { type: 'radios', prop: 'other.fav', options: 'ball,game', label: 'fav' },
        { type: 'button-primary', prop: '$submit', value: 'Submit', config: { wrapperCol: { offset: 4 } } }
    ]}
/>`
const f6 =
    `const form = useRef()
<Form 
    ref={form}
    onEvent={({prop}) => {
        if (prop === 'submit') {
            form.current.submit()
        }
    }}
    columns={[ 
        {type: 'input@w220', prop: 'input', label: 'user', rule: 'must'}, 
        {type: 'button-primary', prop: 'submit', value: '手动提交', config: {wrapperCol: { offset: 4}}}
    ]}
/>`
const f7 =
    `import { Form, FormList } from 'freedomen'
<Form  
    data={{userList: []}}
    onSubmit={data => {
        console.log(data)
    }}
    onEvent={({prop, row}) => {
        if (prop === 'push') {
            row.userList = row.userList.concat([{}])
            return row
        }
    }} 
    columns={[ 
        {type: 'input@w220', prop: 'input', label: 'user', rule: 'must'}, 
        {prop: 'userList', render({value = []}) {
            return <FormList 
                data={value}
                columns={[
                    {type: 'divider', style: {margin: '2px'}},
                    {type: 'input@w220', prop: 'input', label: '姓名', rule: 'must'},
                    [
                        {type: 'select@w220', prop: 'select',  options: 'male,female'},
                        {type: 'button-primary', prop: '$delete', value: '删除', config: {danger: true, size: 'middle'}},
                        {type: 'formitem', label: '性别'}
                    ],
                ]}
            />
        }},
        {type: 'button-primary', prop: 'push', value: '添加一条', config: {size: 'small', wrapperCol: { offset: 4}}},
        {type: 'button-primary', prop: '$submit', value: 'Submit', config: {wrapperCol: { offset: 4}}}
    ]}
/>`
export default function DForm() {
    const form = useRef()

    return <div >
        <Region
            data={{
                use: `imoprt { Form } from 'freedomen'`, f1, f2, f3, f4, f5, f6, f7
            }}
            columns={[
                { type: 'text-div@title', value: 'Form 表单' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Form
                                onSubmit={data => {
                                    console.log(data)
                                }}
                                columns={[
                                    { type: 'input', label: 'Username', prop: 'username', rule: { 'must': 'Please input your username!' } },
                                    { type: 'input-password', prop: 'password', label: 'Password', rule: 'must' },
                                    { type: 'button-primary', prop: '$submit', value: 'Submit', config: { wrapperCol: { offset: 4 } } }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f1', render },
                    { type: 'card@form', value: '1. 基本表单' }
                ],
                [
                    {
                        render() {
                            return <Form
                                onSubmit={data => {
                                    console.log(data)
                                }}
                                onEvent={({ prop, value, row }) => {
                                    if (prop === 'gender') {
                                        return {
                                            ...row,
                                            note: `Hi, ${value}`
                                        }
                                    } else if (prop === 'fill') {
                                        return {
                                            note: 'Hello world!',
                                            gender: 'male',
                                        }
                                    }
                                }}
                                columns={[
                                    { type: 'input', label: 'Note', prop: 'note', rule: 'must' },
                                    { type: 'select', prop: 'gender', label: 'Gender', options: "male,female,other", rule: 'must' },
                                    { type: 'input', prop: 'other', label: 'Customize Gender', load: ({ data }) => data.gender === 'other', rule: 'must' },
                                    [
                                        { type: 'button-primary', prop: '$submit', value: 'Submit' },
                                        { type: 'button', prop: '$reset', value: 'Reset', style: { margin: '0 12px' } },
                                        { type: 'button-link', prop: 'fill', value: 'Fill form' },
                                        { type: 'formitem', config: { wrapperCol: { offset: 4 } } }
                                    ]
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f2', render },
                    { type: 'card@form', value: '2. 联动表单' }
                ], [
                    {
                        render() {
                            return <Form
                                columns={[
                                    { type: 'date@w220', prop: 'date', label: 'date', config: { labelCol: { span: 2 } }, rule: 'must' },
                                    [
                                        { type: 'input', label: 'input1', span: 12, prop: 'input1' },
                                        { type: 'input', label: 'input2', span: 12, prop: 'input2' },
                                        { type: 'input', label: 'input3', span: 12, prop: 'input3' },
                                        { type: 'input', label: 'input4', span: 12, prop: 'input4' },
                                        { type: 'row' }
                                    ],
                                    { type: 'button', prop: '$submit', value: 'Submit', config: { wrapperCol: { offset: 2 } } }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f3', render },
                    { type: 'card@form', value: '3. 布局表单' }
                ], [
                    {
                        render() {
                            return <Form
                                onSubmit={data => {
                                    console.log(data)
                                }}
                                columns={[
                                    {
                                        type: 'input', prop: 'async', label: 'async', placeholder: '请输入 user', rule({ value }) {
                                            return new Promise((resolve, reject) => {
                                                setTimeout(() => {
                                                    if (value === 'user')
                                                        resolve()
                                                    else reject('输入错误')
                                                }, 300)
                                            })
                                        }
                                    },
                                    { type: 'input', prop: 'username', label: 'Username', rule: { must: '请输入用户名' } },
                                    { type: 'input-password', prop: 'password', label: 'Password', rule: { must: '请输入密码' } },
                                    {
                                        type: 'input-password', prop: 'rePassword', label: 'RePassowrd', rule({ data, value }) {
                                            if (data.password !== value)
                                                return Promise.reject('二次密码不一致')
                                            else return Promise.resolve()
                                        }
                                    },
                                    { type: 'button-primary', prop: '$submit', value: 'Login', config: { wrapperCol: { offset: 4 } } }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f4', render },
                    { type: 'card@form', value: '4. 异步验证表单' }
                ], [
                    {
                        render() {
                            const render = (value) => {
                                return <div style={{ marginLeft: 88, marginBottom: 22 }}>
                                    <span style={{ padding: '1px 10px', backgroundColor: '#eef2ff', borderRadius: 2, borderLeft: '4px solid #5774FF' }}>
                                        {value}
                                    </span>
                                </div>
                            }
                            return <Form
                                onSubmit={data => {
                                    console.log(data)
                                }}
                                columns={[
                                    { render: () => render('用户信息') },
                                    { type: 'input@w220', prop: 'user.name', label: 'name', rule: 'must' },
                                    { type: 'date@w220', prop: 'user.birthday', label: 'birthday' },
                                    { type: 'select@w220', prop: 'user.gender', label: 'gender', options: { 1: 'male', 2: 'female' } },
                                    { render: () => render('其他信息') },
                                    { type: 'radios', prop: 'other.fav', options: 'ball,game', label: 'fav' },
                                    { type: 'button-primary', prop: '$submit', value: 'Submit', config: { wrapperCol: { offset: 4 } } }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f5', render },
                    { type: 'card@form', value: '5. 分类表单' }
                ], [
                    {
                        render() {
                            return <Form
                                ref={form}
                                onSubmit={data => {
                                    console.log(data)
                                }}
                                onEvent={({ prop }) => {
                                    if (prop === 'submit') {
                                        form.current.submit()
                                    }
                                }}
                                columns={[
                                    { type: 'input@w220', prop: 'input', label: 'user', rule: 'must' },
                                    { type: 'button-primary', prop: 'submit', value: '手动提交', config: { wrapperCol: { offset: 4 } } }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f6', render },
                    { type: 'card@form', value: '6. 手动提交' }
                ], [
                    {
                        render() {
                            return <Form
                                data={{ userList: [] }}
                                onSubmit={data => {
                                    console.log(data)
                                }}
                                onEvent={({ prop, row }) => {
                                    if (prop === 'push') {
                                        row.userList = row.userList.concat([{}])
                                        return row
                                    }
                                }}
                                columns={[
                                    { type: 'input@w220', prop: 'input', label: 'user', rule: 'must' },
                                    {
                                        prop: 'userList', render({ value = [] }) {
                                            return <FormList
                                                data={value}
                                                columns={[
                                                    { type: 'divider', style: { margin: '2px' } },
                                                    { type: 'input@w220', prop: 'input', label: '姓名', rule: 'must' },
                                                    [
                                                        { type: 'select@w220', prop: 'select', options: 'male,female', style: { marginRight: 5 } },
                                                        { type: 'button-primary', prop: '$delete', value: '删除', config: { danger: true, size: 'middle' } },
                                                        { type: 'formitem', label: '性别' }
                                                    ],
                                                ]}
                                            />
                                        }
                                    },
                                    { type: 'button-primary', prop: 'push', value: '添加一条', config: { size: 'small', wrapperCol: { offset: 4 } } },
                                    { type: 'button-primary', prop: '$submit', value: 'Submit', config: { wrapperCol: { offset: 4 } } }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { type: 'text-div', value: 'FormList 应用于Form render 中，用法同form一样，其中 prop为： $delete 可以删除对应行', style: { marginTop: 20, color: '#ccc' } },
                    { type: 'divider@form' },
                    { prop: 'f7', render },
                    { type: 'card@form', value: '7. 列表表单' }
                ]
            ]}
        />
        <div className="fdoc-tip">
            <strong>提示：</strong> column prop 为 $submit 或 $submit-* 触发click 可以提交表单, 为  $reset 或者 $reset-* 可以重置为第一次绑定数据，
            <br /> 其中 submit(), reset() 两个函数可以手动提交或者重置const form = useRef(); ref={"{form}"}, form.current.submit(), form.current.reset()，
            <br /> 而 set(prop, nextValue:any | ((current:any) {"=>"} nextValue:any) )方法可以直接跟新对应属性值，如set('list', [{}]) 或者 set('list', (c) {"=>"} {"{ return [...c, {}] }"})
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Form props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'data', des: '表单区域数据', type: 'Object', defaultValue: "{}" },
                                { prop: 'columns', des: '必须的, 对应元素描述', type: <ToColumns type="Form" /> },
                                {
                                    prop: 'onEvent', des: 'columns 内发生的事件', type: '({prop, type, value, row, column}) => void 0 || data',
                                    detail: <div>
                                        prop: 触发事件元素的prop <br />
                                        type: 触发事件类型 <br />
                                        value: 触发事件元素的最新值 <br />
                                        row: 当前表单的最新值 <br />
                                        column: 对应元素全量配置 <br />
                                        return data: 跟新表单数据，同setState()
                                    </div>
                                },
                                {
                                    prop: 'onSubmit', des: '验证通过，提交回调事件', type: '(data, params) => void/null',
                                    detail: <div>
                                        data: 要提交的数据 <br />
                                        params: 触发提交的元素描述, 如表单内有多个按钮都可以触发提交：<br />  '$submit-1', '$submit-2', 可以通过此得知是哪个触发提交，
                                        return null 会清空表单数据
                                    </div>
                                },
                                { prop: 'config', des: <ToAntdDoc text={"antd Form 配置"} name={'form'} />, type: 'Object, 如: { layout: "inline" }' }
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
                { type: 'text-div@title', value: 'Form 的 columns 属性的子对象附加属性' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'label', des: '同FormItem label', type: 'ReactNode' },
                                { prop: 'span', des: '给FormItem添加 Col 布局，组件 Row使用，取值 1-24', type: 'Number' },
                                {
                                    prop: 'config', des: '同FormItem中 props, 与column config 合并', type: 'Object'
                                },
                                {
                                    prop: 'rule', des: '验证， 见下表', type: 'String/({value, data}) => Promise',
                                    detail: <div>
                                        value: column 值 <br />
                                        data: 表单值 <br />
                                    </div>
                                },
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
                },
                { type: 'text-div@title', value: 'Form 的 ref 方法' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'get', des: '获取某属性/所有的值', type: 'get("propName"/undefined) => any' },
                                { prop: 'set', des: '修改某属性的值', type: 'set("propName", newValue / (currentValue): any => {}))' },
                                { prop: 'set', des: '同时修改多个属性', type: 'set({[propName]: newValue / (currentValue): any => {}})' },
                                { prop: 'reset', des: '重置表单为第一次数据', type: 'reset()' },
                                { prop: 'submit', des: '手动提交表单', type: 'submit()' }
                            ]}
                            pagination={false}
                            columns={[
                                { label: '函数名', prop: 'prop' },
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
                },
                { type: 'text-div@title', value: 'rule 校验' },
                {
                    render: () => <div className="fdoc-tip">
                        表单校验，类型, object/string/({"{data, value}"}) =&gt; Promise <br />
                        object: {"{must: '不能为空提示信息'}"}, 可以覆盖预定义提示，特别的 len[min]:max 提示:{"{'len2:5': '最少2[:[最多5]]'}"}<br />
                        string: "must", 不能为空；'empty,int' 可以为空，但如果有数据必须为整数, 预定义验证见下表。<br />
                        function: ({"{data, value}"}) =&gt; Promise, dosomething =&gt; Promise.resolve() 不提示 ， Promise.reject('error message');
                    </div>
                },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'required/must', des: '不能为空，支持空数组[],空对象{}' },
                                { prop: 'phone', des: '手机号码' },
                                { prop: 'email', des: 'email地址' },
                                { prop: 'url', des: 'url' },
                                { prop: 'number', des: '数值' },
                                { prop: 'int', des: '整数' },
                                { prop: 'intp', des: '正整数' },
                                { prop: 'intn', des: '负整数' },
                                { prop: 'zipcode', des: '邮编' },
                                { prop: 'ip4', des: 'ip4' },
                                { prop: 'age', des: '年龄' },
                                { prop: 'idcard', des: '身份证' },
                                { prop: 'username', des: '用户名' },
                                { prop: 'empty', des: '可以为空' },
                                { prop: 'len[min]:max', des: '长度，len30 最多30，len2: 最少2字符，len2:15 2到15字符' },
                            ]}
                            pagination={false}
                            columns={[
                                { label: '参数', prop: 'prop' },
                                { label: '说明', prop: 'des' }
                            ]}
                        />
                    }
                }
            ]}
        />
    </div>
}