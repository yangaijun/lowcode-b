import { Region, Table, Form } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `<Form  
    data={{tag2: 'Tag2'}}
    columns={[ 
        {type: 'tag', prop: 'tag1', value: 'Tag'},
        {type: 'tag', prop: 'tag2', config: {color: '#87d068'}} 
    ]}
/>`
export default function DTag() {
    return <div >
        <Region
            data={{
                use: `type: 'tag'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'Tag 标签' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Form
                                data={{ tag2: 'Tag2' }}
                                columns={[
                                    { type: 'tag', prop: 'tag1', value: 'Tag' },
                                    { type: 'tag', prop: 'tag2', config: { color: '#87d068' } }
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
            <strong>提示：</strong>
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Tag props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: tag' },
                                { prop: 'value', des: '值', type: 'String/Number/...', defaultValue: '' },
                                { prop: 'filter', des: '值', type: '', defaultValue: '' },
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