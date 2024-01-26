import { Region, Table } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `<Region
    data={{ divider: '左分割提示' }}
    columns={[
        { type: 'divider' },
        { type: 'divider', value: '分割提示' },
        { type: 'divider', prop: 'divider', config: { dashed: true, orientation: 'left' } },
        { type: 'divider-vertical' }
    ]}
/>`

export default function DDivider() {
    return <div >
        <Region
            data={{
                use: `type: 'divider'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'Divider 分割线' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Region
                                data={{ divider: '左分割提示' }}
                                columns={[
                                    { type: 'divider' },
                                    { type: 'divider', value: '分割提示' },
                                    { type: 'divider', prop: 'divider', config: { dashed: true, orientation: 'left' } },
                                    { type: 'divider-vertical' }
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
            <strong>提示：</strong> 同antd Divider
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Divider props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: divider/-vertical', defaultValue: 'divider' },
                                { prop: 'value', des: '值', type: 'String' },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'config', des: <ToAntdDoc text='antd 其他 Divider 配置' name="divider" />, type: 'Object' }
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