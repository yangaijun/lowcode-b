import { Region, Table, Form } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToFilter from '../components/toFilter';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `<Form
    data={{ progress: 10 }}
    columns={[
        { type: 'progress', prop: 'progress' },
        { type: 'progress-circle', value: 25 },
        { type: 'progress-dashboard', config: { status: 'exception' } }
    ]}
/>`
export default function DProgress() {
    return <div >
        <Region
            data={{
                use: `type: 'progress'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'Progress 进度条' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Form
                                data={{ progress: 10 }}
                                columns={[
                                    { type: 'progress', prop: 'progress' },
                                    { type: 'progress-circle', value: 25 },
                                    { type: 'progress-dashboard', config: { status: 'exception' } }
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
            <strong>提示：同antd Progress.</strong>
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Progress props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: progress/-circle/-dashboard' },
                                { prop: 'value', des: '值', type: 'number' },
                                { prop: 'filter', des: '对value显示进行过滤', type: <ToFilter /> },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'config', des: <ToAntdDoc text='antd 其他 Progress 配置' name="progress" />, type: 'Object' }
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