import { Region, Table } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToAntdDoc from '../components/toAntdDoc';

const f1 =
    `<Region  
    columns={[ 
        {type: 'button', value: 'default'},
        {type: 'button-primary', value: 'primary'},
        {type: 'button-dashed', value: 'dashed'},
        {type: 'button-text', value: 'text'},
        {type: 'button-link', value: 'link'},
        {type: 'card', value: 'title'}
    ]}
/>`
export default function DCard() {
    return <div >
        <Region
            data={{
                use: `type: 'card'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'Card 卡片' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Region
                                columns={[
                                    { type: 'button', value: 'default' },
                                    { type: 'button-primary', value: 'primary' },
                                    { type: 'button-dashed', value: 'dashed' },
                                    { type: 'button-text', value: 'text' },
                                    { type: 'button-link', value: 'link' },
                                    { type: 'card', value: 'title' }
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
        <div style={{
            backgroundColor: '#eef2ff',
            padding: 10,
            marginBottom: 5,
            marginTop: 25
        }}>
            <strong>提示：</strong> 容器只能在数组最后一个元素哦
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Card props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: card' },
                                { prop: 'value', des: '值, 同antd card title', type: 'String' },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'disabled', des: '是否禁用', type: 'Boolean / ({value, data}) => Boolean', defaultValue: 'false' }, 
                                { prop: 'config', des: <ToAntdDoc text='antd 其他 Card 配置' name="card" />, type: 'Object' }
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