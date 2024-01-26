import { useEffect } from 'react'
import Freedomen, { Region, Form } from 'freedomen'
import { render } from 'components/codeText'
const f1 =
    `<Form  
    onEvent={({type}) => {
        if (type === 'onDoubleClick') {
            alert('doubleClick')
        } else if (type === 'onMouseEnter') {
            return {
                hover: true
            }
        } else if (type === 'onMouseLeave') {
            return {
                hover: false
            }
        }
    }}
    columns={[ 
        {type: 'text', value: 'doubleClick', prop: 'text', config: {proxyEvents: ["onDoubleClick"]}},
        {type: 'text', value: 'mouse hover', prop: 'text1', config: {proxyEvents: ["onMouseEnter", "onMouseLeave"]}, style({data}) {
            return {
                color: data.hover ? 'blue' : '#333'
            }
        }}
    ]}
/>`
const f2 = `import Freedomen from 'freedomen';
//使用名: { message: "出错消息", regular: 处理方案 }
Freedomen.registerRules({
    //第一种，正则
    nb: {
        message: '请输入0-9',
        regular: /^[0-9]*$/
    },
    //第一种，函数
    freedomen: {
        message: 'please input freedomen',
        regular: ({ value, data }) => {
            //value，当前字段值；data 整个表单数据
            return value === 'freedomen'
        }
    }
})

<Form
    columns={[
        { type: 'input', prop: 'text', label: 'nb', rule: 'nb' },
        { type: 'input', prop: 'text2', label: 'freedomen', rule: 'freedomen' },
        { type: 'button-primary', prop: '$submit', value: '提交', config: { wrapperCol: { offset: 4 } } }
    ]}
/>
`
const rrules = {
    //第一种，正则
    nb: {
        message: '请输入0-9',
        regular: /^[0-9]*$/
    },
    //第一种，函数
    freedomen: {
        message: 'please input freedomen',
        regular: ({ value, data }) => {
            //value，当前字段值；data 整个表单数据
            return value === 'freedomen'
        }
    }
}

Freedomen.registerRules(rrules)

export default function DEregister() {
    useEffect(() => {
        return () => {
            Freedomen.removeRules(rrules)
        }
    }, [])

    return <div>
        <Region
            data={{
                f1, f2
            }}
            columns={[
                { type: 'text-div@title', value: '注册事件/校验' },
                {
                    render: () => {
                        return <div className="fdoc-tip">
                            <strong>提示：</strong> 设计的事件不满足的事件可以使用，当然，你直接在config中写事件名
                            {"config: {onDoubleClick: (e) => any}"} 也可以处理事件，但是不会被代理，那就没法用到event的特性。
                        </div>
                    }
                },
                [
                    {
                        render() {
                            return <Form
                                onEvent={({ type }) => {
                                    if (type === 'onDoubleClick') {
                                        alert('doubleClick')
                                    } else if (type === 'onMouseEnter') {
                                        return {
                                            hover: true
                                        }
                                    } else if (type === 'onMouseLeave') {
                                        return {
                                            hover: false
                                        }
                                    }
                                }}
                                columns={[
                                    { type: 'text', value: 'doubleClick', prop: 'text', config: { proxyEvents: ["onDoubleClick"] } },
                                    {
                                        type: 'text', value: 'mouse hover', prop: 'text1', config: { proxyEvents: ["onMouseEnter", "onMouseLeave"] }, style({ data }) {
                                            return {
                                                color: data.hover ? 'blue' : '#333'
                                            }
                                        }
                                    }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    {
                        type: 'text-div',
                        value: '每个元素的config 可以添加 proxyEvents [事件名, ...], 来代理事件',
                        style: { marginTop: 20, color: '#ccc' }
                    },
                    { type: 'divider@form' },
                    { prop: 'f1', render },
                    { type: 'card@form', value: '1. 事件注册' }
                ],
                {
                    render: () => {
                        return <div className="fdoc-tip">
                            <strong>提示：</strong> 系统预定义的常量校验无法满足时，而你想要使用常量字符串来校验时可以使用；
                            <div>
                                如果你需要删除注册的校验，可以使用：Freedomen.removeRules(rules)，rules:注册的对象，或者常量名数组(['nb', 'freedomen']) 
                            </div>
                        </div>
                    }
                },
                [
                    {
                        render() {
                            return <Form
                                columns={[
                                    { type: 'input', prop: 'text', label: 'nb', rule: 'nb' },
                                    { type: 'input', prop: 'text2', label: 'freedomen', rule: 'freedomen' },
                                    { type: 'button-primary', prop: '$submit', value: '提交', config: { wrapperCol: { offset: 4 } } }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f2', render },
                    { type: 'card@form', value: '2. 校验注册', style: { marginTop: 20 } }
                ]
            ]}
        />

    </div>
}