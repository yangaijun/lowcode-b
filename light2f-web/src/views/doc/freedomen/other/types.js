import { useCallback, useEffect } from 'react';
import { Region } from 'freedomen'
import { render } from 'components/codeText'
import { parseURLParams } from 'libs/utils';
const f1 =
    `1. 原始类型 {label: string, value: string, disabled?: boolean, option?: ReactNode, children?: any[], [key: string]: any(当前组件item对应的原属性)}[]
const columns = [
    {
        type: '...', 
        prop: '...', 
        options: [
            {label: 'label1', value: 'value1'},
            {label: 'label2', value: 'value2', disabled: true}
        ]
    }
]

2. 字符串类型 "选项1,选项2,选项3", 以英文逗号风格的string, key&value都是相同
const columns = [
    {
        type: '...', 
        prop: '...', 
        options: "选项1,选项2,选项3"
    }
]

3.对象类型 record<string|number, string|number>,会被转化为，key是显示的label，value是对应value
const columns = [
    {
        type: '...', 
        prop: '...', 
        options: { 1: "选项1", 2: "选项2", 3: "选项3" }
    }
]

4.函数 (params: {resolve: Promise.reslove, value: any, data: any, shouldUpdate((p, c) => boolean) })
value：当前值
data：当前域值
shouldUpdate：判断是否重新加载，缺省不会重新加载
resolve：同Promise.resolve，用于返回options
（使用1。）
const columns = [
    {
        type: '...', 
        prop: '...', 
        options({resolve}) {
            resolve("any") //参数可以是上面的 1，2，3类型
        }
    }
]
（使用2。）
const columns = [
    {
        type: '...', 
        prop: '...', 
        options({resolve, data, shouldUpdate }) {
            //当前域内parentId变化才会重新加载，
            shouldUpdate((p, c) => p.parentId !== c.parentId)
            //api.getOptions({parentId: data.parentId}).then(res => resolve(res))
            setTimeout(() => {
                resolve("any")
            }, 200) 
        }
    }
]
`

function getColumnsDoc(type) {
    let append = ''
    if (type === 'Form') {
        append =
            `
    label?: string, //label
    span?: number, //添加col总24， 配合最后row
    rule?: string | ({value, data}) => Promise.reject('error messge') / Promise.resolve(), //校验
`
    } else if (type === 'Table') {
        append =
            `
    label?: string,
    width?: number,
    fixed?: boolean,
`
    }
    const f2 =
        `columns 类型: {${append}
    type: string | ({value: any, data: any}) => string,  //对应元素类型
    prop?: string, //用于数据分配
    style?: React.CSSProperties, 
    className?: string,
    placeholder?: string,
    disabled?: boolean | ({value: any, data: any}) => boolean,
    config?: object, //对应type元素的配置，全部可用属性，如 <input {...config}>
    [key: string]: any
}[] 

使用，如：
columns = [
    {type: 'input'},
    [
        {type: 'text', value: <>text</>},
        [
            {type: 'input-password'},
            {type: 'select', options: "aaa,bbb,ccc"},
            {type: 'space'}
        ],
        {type: 'div'}
    ]
]
`
    return f2
}

const f3 =
    `filter可以对值的显示进行更改，而不改变原始的值 (value) 
    
1. 对象类型Record<any, any>  
const filter = {
    1: 'boy',
    2: 'girl',
    $default: 'other'
}
const columns = [
    {type: 'text', value: 1, filter}, //boy
    {type: 'text', value: 2, filter}, //girl
    {type: 'text', value: 3, filter}, // other
    {type: 'text', value: "xx", filter} //other
]  

2. 字符串类型，日期格式化,全 "yyyy-MM-dd hh:mm:ss"， value 要满足 new Date()的构造，如时间戳，日期字符串..
const columns = [
    {type: 'text', value: new Date(), filter: "yyyy-MM"}, //2022-01
    {type: 'text', value: "2021-12-30", filter: "yyyy年MM月"}, //2021年12月
]  

3. 函数 ({value, data} : {value: any, data: any}) => any
const columns = [
    {type: 'input', prop: 'input'}, //世界
    {type: 'text', value: '你好，', filter: ({value, data}) => value + data.input}, //你好，世界
] 
`

export default function DTypes() { 
    const { id, type } =  parseURLParams()

    const scrollToAnchor = useCallback((anchorName) => {
        if (anchorName) {
            const anchorElement = document.getElementById(anchorName);
            anchorElement && anchorElement.scrollIntoView()
        }
    }, [])

    useEffect(() => {
        id && scrollToAnchor(id)
    }, [id, scrollToAnchor])

    const columnsTitle = `2. ${type ? type : 'Region'} Columns`

    return <div >
        <Region
            data={{
                f1, f2: getColumnsDoc(type), f3
            }}
            columns={[
                { type: 'text-div@title', value: '1. OptionsType', config: { id: 'options' } },
                [
                    { prop: 'f1', render, config: { activeKey: "1" } },
                    { type: 'card@form', value: 'options支持的类型' }
                ],
                { type: 'text-div@title', value: columnsTitle, config: { id: 'columns' } },
                [
                    { prop: 'f2', render, config: { activeKey: "1" } },
                    { type: 'card@form', value: 'columns使用' }
                ],
                { type: 'text-div@title', value: "3. FilterType", config: { id: 'filter' } },
                [
                    { prop: 'f3', render, config: { activeKey: "1" } },
                    { type: 'card@form', value: 'filter使用' }
                ]
            ]}
        />
    </div>
}