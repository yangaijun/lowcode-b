import Freedomen, { Region, Form } from 'freedomen'
import { render } from 'components/codeText'
import { Input, Space } from 'antd';
const f1 =
    `import { Input } from 'antd';
<Form
    data={{ exinput: '未改变' }}
    columns={[
        {
            prop: 'exinput', label: '扩展input', render({ value, $base: { onChange } }) {
                return <Input value={value} onChange={e => onChange(e.target.value)} />
            }
        },
        {
            prop: 'exany', label: '任意非元素', render({ data, $base: { shouldUpdate } }) {
                //默认只要当前值变化才会重新渲染， 而如果依靠其他值重新加载，要使用shouldUpdate
                shouldUpdate((pre, cur) => pre.exinput !== cur.exinput)

                return <div>
                    input输入的值：{data.exinput}
                </div>
            }
        }, 
        {type: 'button-primary', prop: '$reset', value: '重置', label: 'reset'}
    ]}
/>`
const f2 = `<Region
    columns={[
        { type: 'input', prop: 'input' },
        { type: 'select', prop: 'select', style: { width: 200 }, options: "a,b,v" },
        {
            type: 'render-c', render({ children }) {
                return <div style={{ padding: 22, backgroundColor: '#ccc' }}>
                    容器同样要放在数组最后一个，type为固定值   "render-c" <br /><br />
                    <Space>{children}</Space>
                </div>
            }
        }
    ]}
/>`
const f3 = `import Freedomen from 'freedomen'
//编写个元素
export const celement = ({ value, $base: { onChange, style, className, config } }) => {
    return <div>
        自定义input:
        <Input
            style={style}
            className={className}
            value={value}
            onChange={({ target }) => onChange(target.value)}
            {...config}
        />
    </div>
}
//如果 celement.__isRenderComponent = true, 那么会自动为组件注入属性data = value 与 onChange 事件

//编写个容器， 读取children
export const ccontainer = ({ children, $base: { style, className } }) => {
    return <div className={className} style={style}>
        自定义容器:
        {children}
        自定义容器结束
    </div>
}
//可以放在app.js中全局使用, 注册， (type: string, Render: Function, isContainer?: boolean)
Freedomen.registerRender('celement', celement)
    .registerRender('ccontainer', ccontainer, true)
//使用注册的类型
return <Region
    data={{ celement: 'celement' }}
    columns={[
        { type: 'input', prop: 'input' },
        { type: 'celement', prop: 'celement', style: { width: 200 }, /*config: { shouldUpdate: ture / (pre, cur) => boolean } */},
        { type: 'ccontainer', style: { backgroundColor: '#ccc', padding: 12 } }
    ]}
/>`
export const celement = ({ value, $base: { onChange, style, className, config } }) => {
    return <div>
        自定义input:
        <Input
            style={style}
            className={className}
            value={value}
            onChange={({ target }) => onChange(target.value)}
            {...config}
        />
    </div>
}
export const ccontainer = ({ children, $base: { style, className } }) => {
    return <div className={className} style={style}>
        自定义容器:
        {children}
        自定义容器结束
    </div>
}
Freedomen.registerRender('celement', celement)
    .registerRender('ccontainer', ccontainer, true)

export default function DExele() {
    return <div >
        <Region
            data={{
                f1, f2, f3
            }}
            columns={[
                { type: 'text-div@title', value: '扩展' },
                [
                    {
                        render() {
                            return <Form
                                data={{ exinput: '未改变' }}
                                columns={[
                                    {
                                        prop: 'exinput', label: '扩展input', render({ value, $base: { onChange } }) {
                                            return <Input value={value} onChange={e => onChange(e.target.value)} />
                                        }
                                    },
                                    {
                                        prop: 'exany', label: '任意非元素', render({ data, $base: { shouldUpdate } }) {
                                            //默认只用当前值变化  会重新渲染， 如果依靠其他值，要使用shouldUpdate
                                            shouldUpdate((pre, cur) => pre.exinput !== cur.exinput)
                                            return <div>
                                                input输入的值：{data.exinput}
                                            </div>
                                        }
                                    },
                                    { type: 'button-primary', prop: '$reset', value: '重置', label: 'reset' }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f1', render, config: { activeKey: "1" } },
                    { type: 'card@form', value: '1. 元素扩展' }
                ], [
                    {
                        render() {
                            return <Region
                                columns={[
                                    { type: 'input', prop: 'input' },
                                    { type: 'select', prop: 'select', style: { width: 200 }, options: "a,b,v" },
                                    {
                                        type: 'render-c', render({ children }) {
                                            return <div style={{ padding: 22, backgroundColor: '#ccc' }}>
                                                容器同样要放在数组最后一个，type为固定值   "render-c" <br /><br />
                                                <Space>{children}</Space>
                                            </div>
                                        }
                                    }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f2', render, config: { activeKey: "1" } },
                    { type: 'card@form', value: '2. 容器扩展' }
                ],
                { type: 'text-div@title', value: '注册成type' },
                [
                    {
                        render() {
                            return <Region
                                data={{ celement: 'celement' }}
                                columns={[
                                    { type: 'input', prop: 'input' },
                                    { type: 'celement', prop: 'celement', style: { width: 200 } },
                                    { type: 'ccontainer', style: { backgroundColor: '#ccc', padding: 12 } }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f3', render, config: { activeKey: "1" } },
                    { type: 'card@form', value: '1. 注册与使用' }
                ]
            ]}
        />
        <div className="fdoc-tip">
            缺省只有自身的值变才会重新render,  如果依赖其它值变化重新<code>render</code>, 请使用 shouldUpdate((pre, cur) {"=>"} pre.prop !== cur.prop);
            <div>参数：</div>
            <div>
                render({`{
                    value,
                    preData,
                    data, 
                    children,
                    $base: {
                        style,
                        className,
                        disabled,
                        onChange,
                        onEvent,
                        config,
                        shouldUpdate
                    }
                }`})
            </div>
            <br/>
            <div>
                如果你需要删除注册的元素/容器，可以使用：Freedomen.removeRender('registerType')， registerType：注册的type name
            </div>
            <div>
                注册成type后，sholudUpdate 即在config中使用：{"{ type: 'ce', config: { sholudUpdate: (pre, cur) => pre.a !== cur.a } }"}
            </div>
        </div>
    </div>
}