import { Region, Table, Form } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToFilter from '../components/toFilter';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `<Form
    data={{ slider2: [5, 22] }}
    onEvent={params => {
        console.log(params)
    }}
    columns={[
        { type: 'slider', prop: 'slider'},
        { type: 'slider-range', prop: 'slider2'}
    ]}
/>`
export default function DSlider() {
    return <div >
        <Region
            data={{
                use: `type: 'slider'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'Slider滑动输入条' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Form
                                data={{ slider2: [5, 22] }}
                                onEvent={params => {
                                    console.log(params)
                                }}
                                columns={[
                                    { type: 'slider', prop: 'slider' },
                                    { type: 'slider-range', prop: 'slider2' }
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
                { type: 'text-div@title', value: 'Slider props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: slider/-range' },
                                { prop: 'value', des: '值', type: 'slider:Number; slider-range:[number,number] ' },
                                { prop: 'filter', des: '对value显示进行过滤', type: <ToFilter /> },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'config', des: <ToAntdDoc text='antd 其他 Slider 配置' name="slider" />, type: 'Object' }
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