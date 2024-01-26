import { Region, Table } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToColumns from './components/toColumns';
const f1 =
    `<Region  
    onEvent={params => {
        console.log(params)
    }}
    columns={[
        {type: 'text', value: '用户信息'},
        {type: 'button', prop:'button', value: '用户信息描述'},
        {type: 'input@w220', prop: 'input'},
        {type: 'select@w220', prop: 'select', options: '1,2,3,4'},
        {type: 'space', config: {direction: 'vertical'}}
    ]}
/>`
const f2 =
    `<Region  
    columns={[
        {type: 'text-h2', value: '用户信息'},
        {type: 'text-div', value: '用户信息描述'},
        [
            {type: 'avatar', value: 'https://flightdoc-1256372626.cos.ap-nanjing.myqcloud.com/img.png'},
            {type: 'text', value: '赵四', style: {margin: '0 15px'}},
            {type: 'text', value: '信息部门'},
            [
                {type: 'text', value: '信息部门'},
                {type: 'text', value: '信息部门'},
                {type: 'space', config: {direction: 'vertical'}}
            ],
            {type: 'space'}
        ]
    ]}
/>`
const f3 =
    `<Region  
    columns={[
        {type: 'select@w220', prop: 'select', placeholder: '元素控制', options: {1: 'show date', 2: 'show input'}},
        {type: 'date@w220', prop: 'date', placeholder: 'i am date', load: ({data}) => data.select === 1},
        {type: 'input@w220', prop: 'input', placeholder: 'i am input', load: ({data}) => data.select === 2},
        {type: 'select@w220', prop: 'select2', placeholder: '块控制', options: {1: '块控制，显示', 2: '块控制，隐藏'}},
        [
            {type: 'text-h1', value: '块'},
            {type: 'input@w200', prop: 'i'},
            {type: 'date@w200', prop: 'd'},
            {type: 'space', load: ({data}) => data.select2 === 1}
        ],
        {type: 'space', config: {direction: 'vertical'}}
    ]}
/>`
const f4 =
    `<Region  
    onEvent={params => {
        console.log(params)
    }}
    columns={[
        {type: 'text-h3', value: '打开console查看，我也可以点'},
        {type: 'button', prop: 'button', value: '按钮'},
        {type: 'input@w200', prop: 'input'},
        {type: 'select@w200', prop: 'select', options: "option1,option2"},
        {type: 'space', config: {direction: 'vertical'}}
    ]}
/>`
const f5 =
    `<Region  
    onEvent={({prop, row}) => {
        if (prop === 'button') { 
            return {
                ...row,
                text4: '我是通过事件返回的数据改变的值',
                button: '我是按钮，我的值也改变了'
            }
        }
    }}
    data={{
        text2: '我是通过参数data赋值，data的key对应column中的prop',
        text3: 'column中value有值，data中对应的prop有值，data中的值会覆盖column中的值'
    }}
    columns={[
        {type: 'text', prop: 'text1', value: '我是通过column中的value赋值'},
        {type: 'text', prop: 'text2'},
        {type: 'text', prop: 'text3', value: 'column的值会被覆盖'},
        {type: 'text', prop: 'text4', value: '点击按钮会我的值将会改变', style: {color: 'red'}},
        {type: 'button', prop: 'button', value: '点击我，返回新数据改变红色字的值'},
        {type: 'space', config: {direction: 'vertical'}}
    ]}
/>`
const f6 = `<Region
    onEvent={params => {
        if(params.prop === 'submit') {
            alert(JSON.stringify(params.row))
        }
    }}
    data={{user: {name: '张三'}}}
    columns={[
        { type: 'text', value: '用户信息' },
        { type: 'input', prop: 'user.name', placeholder: '用户名' },
        { type: 'input-password', prop: 'user.password', placeholder: '密码' },
        { type: 'text', value: '地址' },
        { type: 'select@w220', prop: 'address.city', placeholder: 'city', options: "北京,上海,广州" },
        { type: 'input-area', prop: 'address.detail', placeholder: '详细地址' },
        { type: 'button', prop: 'submit', value: '查看域数据' },
        { type: 'space', config: { direction: 'vertical' } }
    ]}
/>`
export default function DRegion() { 
    return <div>
        <Region
            data={{
                use: `import { Region } from 'freedomen' `, f1, f2, f3, f4, f5, f6
            }}
            columns={[
                { type: 'text-div@title', value: 'Region 域' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Region
                                onEvent={params => {
                                    console.log(params)
                                }}
                                columns={[
                                    { type: 'text', value: '用户信息' },
                                    { type: 'button', prop: 'button', value: '用户信息描述' },
                                    { type: 'input@w220', prop: 'input' },
                                    { type: 'select@w220', prop: 'select', options: '1,2,3,4' },
                                    { type: 'space', config: { direction: 'vertical' } }
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
                            return <Region
                                columns={[
                                    { type: 'text-h2', value: '用户信息' },
                                    { type: 'text-div', value: '用户信息描述' },
                                    [
                                        { type: 'avatar', value: 'https://flightdoc-1256372626.cos.ap-nanjing.myqcloud.com/img.png' },
                                        { type: 'text', value: '赵四', style: { margin: '0 15px' } },
                                        { type: 'text', value: '信息部门' },
                                        [
                                            { type: 'text', value: '信息部门' },
                                            { type: 'text', value: '信息部门' },
                                            { type: 'space', config: { direction: 'vertical' } }
                                        ],
                                        { type: 'space' }
                                    ]
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { type: 'text-div', value: `columns装载元素，数组表示容器，数组的最后一个column可以是容器类型`, style: { marginTop: 20, color: '#ccc' } },
                    { type: 'divider@form' },
                    { prop: 'f2', render },
                    { type: 'card@form', value: '2. 布局' }
                ], [
                    {
                        render() {
                            return <Region
                                columns={[
                                    { type: 'select@w220', prop: 'select', placeholder: '元素控制', options: { 1: 'show date', 2: 'show input' } },
                                    { type: 'date@w220', prop: 'date', placeholder: 'i am date', load: ({ data }) => data.select === 1 },
                                    { type: 'input@w220', prop: 'input', placeholder: 'i am input', load: ({ data }) => data.select === 2 },
                                    { type: 'select@w220', prop: 'select2', placeholder: '块控制', options: { 1: '块控制，显示', 2: '块控制，隐藏' } },
                                    [
                                        { type: 'text-h1', value: '块' },
                                        { type: 'input@w200', prop: 'i' },
                                        { type: 'date@w200', prop: 'd' },
                                        { type: 'space', load: ({ data }) => data.select2 === 1 }
                                    ],
                                    { type: 'space', config: { direction: 'vertical' } }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { type: 'text-div', value: `load函数可以动态控制元素的加载，块控制，在最大的数组容器类上加load`, style: { marginTop: 20, color: '#ccc' } },
                    { type: 'divider@form' },
                    { prop: 'f3', render },
                    { type: 'card@form', value: '3. 元素加载控制(联动)' }
                ], [
                    {
                        render() {
                            return <Region
                                onEvent={params => {
                                    console.log(params)
                                }}
                                columns={[
                                    { type: 'text-h3', value: '打开console查看，我也可以点' },
                                    { type: 'button', prop: 'button', value: '按钮' },
                                    { type: 'input@w200', prop: 'input' },
                                    { type: 'select@w200', prop: 'select', options: "option1,option2" },
                                    { type: 'space', config: { direction: 'vertical' } }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { type: 'text-div', value: `元素内发生的事件将会被Region代理Event原型({ prop: string, value: any, type: string, row: object, column: any })`, style: { marginTop: 20, color: '#ccc' } },
                    { type: 'divider@form' },
                    { prop: 'f4', render },
                    { type: 'card@form', value: '4. 事件处理' }
                ], [
                    {
                        render() {
                            return <Region
                                onEvent={({ prop, row }) => {
                                    if (prop === 'button') {
                                        return {
                                            ...row,
                                            text4: '我是通过事件返回的数据改变的值',
                                            button: '我是按钮，我的值也已经改变了'
                                        }
                                    }
                                }}
                                data={{
                                    text2: '我是通过参数data赋值，data的key对应column中的prop',
                                    text3: 'column中value有值，data中对应的prop有值，data中的值会覆盖column中的值'
                                }}
                                columns={[
                                    { type: 'text', prop: 'text1', value: '我是通过column中的value赋值' },
                                    { type: 'text-h3', prop: 'text2' },
                                    { type: 'text-h5', prop: 'text3', value: 'column的值会被覆盖' },
                                    { type: 'text', prop: 'text4', value: '点击按钮会我的值将会改变', style: { color: 'red', fontWeight: 600 } },
                                    { type: 'button', prop: 'button', value: '点击我，返回新数据改变红色字的值' },
                                    { type: 'space', config: { direction: 'vertical' } }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f5', render },
                    { type: 'card@form', value: '5. data使用以及event交互' }
                ], [
                    {
                        render() {
                            return <Region
                                onEvent={params => {
                                    if (params.prop === 'submit') {
                                        alert(JSON.stringify(params.row))
                                    }
                                }}
                                data={{ user: { name: '张三' }, id: 1 }}
                                columns={[
                                    { type: 'text', value: '用户信息' },
                                    { type: 'input', prop: 'user.name', placeholder: '用户名' },
                                    { type: 'input-password', prop: 'user.password', placeholder: '密码' },
                                    { type: 'text', value: '地址' },
                                    { type: 'select@w220', prop: 'address.city', placeholder: 'city', options: "北京,上海,广州" },
                                    { type: 'input-area', prop: 'address.detail', placeholder: '详细地址' },
                                    { type: 'button', prop: 'submit', value: '查看域数据' },
                                    { type: 'space', config: { direction: 'vertical' } }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { type: 'text-div', value: `通过 . 可以访问链式结构 {address: {detail: ''}},绑定detail，对应prop: address.detail `, style: { marginTop: 20, color: '#ccc' } },
                    { type: 'divider@form' },
                    { prop: 'f6', render },
                    { type: 'card@form', value: '6.链式数据结构' }
                ]
            ]}
        />
        <div className="fdoc-tip">
            <strong>提示：</strong> Region属于核心控件，其他组件皆要通过此加载，所以，其属性其他组件皆可使用<br />
            type后面 + @w + number, 可以直接设置组件宽度哦 <br />
            Region 负责元素组件的控制，元素控制，通过 load: ({"{data, value}"}) =&gt; true/false <br />
            其子元素都会通过 prop 属性与数据绑定，可以链式结构绑定，如 prop = user.name 对应  {`{user: {name: '张三'}, id: 1}`} 对象的 张三, prop = id 对应 1
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Region props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'data', des: '表单区域数据, key与columns中prop对应，将值放入', type: 'Object', defaultValue: "{}" },
                                { prop: 'columns', des: '必须的, 对应元素描述', type: <ToColumns /> },
                                {
                                    prop: 'onEvent', des: 'columns 内发生的事件', type: '({prop, type, value, row, column}) => void 0 || data',
                                    detail: <div>
                                        prop: 触发事件元素的prop <br />
                                        type: 触发事件类型 <br />
                                        value: 触发事件元素的最新值 <br />
                                        row: 当前表单的最新值 <br />
                                        column: 对应元素全量配置 <br />
                                        return data: 跟新域内数据
                                    </div>
                                },
                                { prop: 'onChange', des: '域内数据跟新事件，没特殊情况数据内部维护', type: '(data) => void' }
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
                { type: 'text-div@title', value: 'Region 的 columns 属性的子对象附加属性' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'load', des: '控制元素加载', type: '({data, value}) => boolean' },
                                { prop: 'type', des: '用来与要加载的 dom 对应', type: 'string/({data, value}) => string' },
                                { prop: 'prop', des: '用来与数据data属性中的键绑定，支持链式，如 user.name 即对应 { user: { name: 1 } }对象的 user.name', type: 'string' },
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
                { type: 'text-div@title', value: 'Region 的 ref 方法' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'get', des: '获取某属性/所有的值', type: 'get("propName"/undefined) => any' },
                                { prop: 'set', des: '修改某属性的值', type: 'set("propName", newValue / (currentValue): any => {}))' },
                                { prop: 'set', des: '同时修改多个属性', type: 'set({[propName]: newValue / (currentValue): any => {}})' },
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
                }
            ]}
        />
    </div>
}