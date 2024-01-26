import { Region, Table, Form } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToFilter from '../components/toFilter';
const f1 =
    `<Form  
    data={{
        text4: '有样式,中文而且只能显示点点点', 
        text5: 'English and show some text', 
        text6: 1, 
        text7: new Date(), 
        text8: '2020-09-18'
    }}
    columns={[ 
        { type: 'text-a', prop: 'text0', value: 'a标签' },
        {type: 'text', prop: 'text1', value: 'span标签文本'},
        {type: 'text-div', prop: 'text2', value: 'div标签文本'},
        {type: 'text-h1', prop: 'text3', value: 'h1标签文本'},
        {type: 'text', prop: 'text4', config: {maxlength: 14}, style: {color: 'red'}},
        {type: 'text', prop: 'text5', config: {maxlength: 14}},
        {type: 'text', prop: 'text6', filter: ({value}) => '显示转换后'},
        {type: 'text', prop: 'text7', filter: 'yyyy-MM-dd hh:mm:ss'},
        {type: 'text', prop: 'text8', filter: 'yyyy年MM月'},
    ]}
/>`

export default function DText() {
    return <div>
        <Region
            data={{
                use: `type: 'text'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'Text 文本' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Form
                                data={{ text4: '有样式,中文而且只能显示点点点', text5: 'English and show some text', text6: 1, text7: new Date(), text8: '2020-09-18' }}
                                columns={[
                                    { type: 'text-a', prop: 'text0', value: 'a标签' },
                                    { type: 'text', prop: 'text1', value: 'span标签文本' },
                                    { type: 'text-div', prop: 'text2', value: 'div标签文本' },
                                    { type: 'text-h1', prop: 'text3', value: 'h1标签文本' },
                                    { type: 'text', prop: 'text4', config: { maxlength: 14 }, style: { color: 'red' } },
                                    { type: 'text', prop: 'text5', config: { maxlength: 14 } },
                                    { type: 'text', prop: 'text6', filter: () => '显示转换后' },
                                    { type: 'text', prop: 'text7', filter: 'yyyy-MM-dd hh:mm:ss' },
                                    { type: 'text', prop: 'text8', filter: 'yyyy年MM月' },
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
            <strong>提示：</strong> 事件由其父组件代理， text-div/p/span/h1...，类型text-[html标签]，即使用对应的标签显示文本哦 <br />
            如果数据可以解析为日期，那么filter可以是日期的fomart
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Text props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: text/-*(html标签名如:div/p/h1...)', defaultValue: 'text(span标签)' },
                                { prop: 'value', des: '值', type: 'String/Number/Date/...' },
                                { prop: 'filter', des: '对value显示进行过滤', type: <ToFilter /> },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'config', des: '下表', type: 'Object' }
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
                { type: 'text-div@title', value: 'Config' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'maxlength', des: '最大显示长度，中文每个字符为2，英文为1', type: 'Number' },
                                { prop: '...', des: '对应标签属性，如：a 标签有 href 属性等', type: '...' }
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