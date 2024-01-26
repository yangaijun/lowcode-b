import { Region, Table } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToOptions from '../components/toOptions';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `const options = [{
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [{
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [{
            value: 'xihu',
            label: 'West Lake',
        }],
    }]}, 
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [{
            value: 'nanjing',
            label: 'Nanjing',
            children: [{
                value: 'zhonghuamen',
                label: 'Zhong Hua Men'
            }]
        }],
    }
  ]
return <Region  
    data={{cascader3: ['jiangsu', 'nanjing', 'zhonghuamen']}}
    columns={[ 
        {type: 'cascader', prop: 'cascader', placeholder: '选择城市', options: options},
        {type: 'cascader', prop: 'cascader2', value: ['zhejiang', 'hangzhou', 'xihu'], options: options},
        {type: 'cascader', prop: 'cascader3', options: options},
        {type: 'cascader', prop: 'cascader4', options: options, disabled: true},
        {type: 'space'}
    ]}
/>`
const f2 =
    `const options = [{
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [{
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [{
            value: 'xihu',
            label: 'West Lake',
        }],
    }]}, 
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [{
            value: 'nanjing',
            label: 'Nanjing',
            children: [{
                value: 'zhonghuamen',
                label: 'Zhong Hua Men'
            }]
        }],
    }
]
return <Region  
    onEvent={params => {
        if (params.prop === 'cascader') {
            console.log(params.prop, params.value, params.row)
        }
    }}
    columns={[ 
        {type: 'cascader', prop: 'cascader', placeholder: '选择城市', options: options}                                   
    ]}
/>`
export default function DCascader() {
    return <div >
        <Region
            data={{
                use: `type: 'cascader'`, f1, f2
            }}
            columns={[
                { type: 'text-div@title', value: 'Cascader 级联' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            const options = [{
                                value: 'zhejiang',
                                label: 'Zhejiang',
                                children: [{
                                    value: 'hangzhou',
                                    label: 'Hangzhou',
                                    children: [{
                                        value: 'xihu',
                                        label: 'West Lake',
                                    }],
                                }]
                            },
                            {
                                value: 'jiangsu',
                                label: 'Jiangsu',
                                children: [{
                                    value: 'nanjing',
                                    label: 'Nanjing',
                                    children: [{
                                        value: 'zhonghuamen',
                                        label: 'Zhong Hua Men'
                                    }]
                                }],
                            }
                            ]
                            return <Region
                                data={{ cascader3: ['jiangsu', 'nanjing', 'zhonghuamen'] }}
                                columns={[
                                    { type: 'cascader', prop: 'cascader', placeholder: '选择城市', options: options },
                                    { type: 'cascader', prop: 'cascader2', value: ['zhejiang', 'hangzhou', 'xihu'], options: options },
                                    { type: 'cascader', prop: 'cascader3', options: options },
                                    { type: 'cascader', prop: 'cascader4', options: options, disabled: true },
                                    { type: 'space' }
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
                            const options = [{
                                value: 'zhejiang',
                                label: 'Zhejiang',
                                children: [{
                                    value: 'hangzhou',
                                    label: 'Hangzhou',
                                    children: [{
                                        value: 'xihu',
                                        label: 'West Lake',
                                    }],
                                }]
                            },
                            {
                                value: 'jiangsu',
                                label: 'Jiangsu',
                                children: [{
                                    value: 'nanjing',
                                    label: 'Nanjing',
                                    children: [{
                                        value: 'zhonghuamen',
                                        label: 'Zhong Hua Men'
                                    }]
                                }],
                            }
                            ]
                            return <Region
                                onEvent={params => {
                                    if (params.prop === 'cascader') {
                                        console.log(params.prop, params.value, params.row)
                                    }
                                }}
                                columns={[
                                    { type: 'cascader', prop: 'cascader', placeholder: '选择城市', options: options }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f2', render },
                    { type: 'card@form', value: '2. 事件代理' }
                ]
            ]}
        />
        <div className="fdoc-tip">
            <strong>提示：</strong> 事件由其父组件代理, 不过要知道是哪个按钮触发事件的要加 prop 属性哦, 所以要正常使用是要有prop属性
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Cascader props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: cascader' },
                                { prop: 'value', des: '值', type: 'Array', defaultValue: '[]' },
                                { prop: 'placeholder', des: 'placeholder', type: 'string' },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'options', des: '选项', type: <ToOptions />, defaultValue: '[]' },
                                { prop: 'disabled', des: '是否禁用', type: 'Boolean / ({value, data}) => Boolean', defaultValue: 'false' },
                                { prop: 'config', des: <ToAntdDoc text={'antd 其他 Cascader 配置'} name="cascader" /> , type: 'Object' }
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