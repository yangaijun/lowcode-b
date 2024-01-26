import { Region, Table, Form } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `<Form  
    columns={[ 
        { type: 'tags', prop: 'tags1', value: ["tag1", "tag2"] },
        { type: 'tags-close', prop: 'tags2', value: ["tag1", "tag2", "tag3"] },
        { type: 'tags-create', prop: 'tags3', value: ["tag1", "tag2", "tag3"], config: { maxcount: 5 } }
    ]}
/>`
export default function DTags() {
    return <div >
        <Region
            data={{
                use: `type: 'tags'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'Tags 标签组' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Form
                                columns={[
                                    { type: 'tags', prop: 'tags1', value: ["tag1", "tag2"] },
                                    { type: 'tags-close', prop: 'tags2', value: ["tag1", "tag2", "tag3"] },
                                    { type: 'tags-create', prop: 'tags3', value: ["tag1", "tag2", "tag3"], config: { maxcount: 5 } }
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
            <strong>提示：</strong> onclose 有数据改变(change)事件
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Tags props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: tags/-close/-create' },
                                { prop: 'value', des: '值', type: 'string[]' },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'config', des: <ToAntdDoc text='antd 其他 Tag 配置' name="tag" />, type: 'Object' }
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