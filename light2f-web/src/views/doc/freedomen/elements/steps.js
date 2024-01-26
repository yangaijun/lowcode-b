import { Region, Table } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToOptions from '../components/toOptions';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `const options = [{ value: 1, label: '步骤1' }, { value: 2, label: '步骤2', description: 'goodBoy' }, { value: 3, label: '步骤3' }]

return <Region
    data={{ steps3: 'step2' }}
    columns={[
        { type: 'steps', prop: 'steps1', options: options },
        { type: 'steps-vertical', prop: 'steps2', options: options },
        {
            type: 'steps', prop: 'steps3', style: { marginTop: 12 }, options({ resolve }) {
                setTimeout(() => {
                    resolve("step1,step2,step3")
                }, 600);
            }
        }
    ]}
/>`

export default function DSteps() {
    return <div >
        <Region
            data={{
                use: `type: 'steps'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'Steps 步骤条' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            const options = [{ value: 1, label: '步骤1' }, { value: 2, label: '步骤2', description: 'goodBoy' }, { value: 3, label: '步骤3' }]
                            return <Region
                                data={{ steps3: 'step2' }}
                                columns={[
                                    { type: 'steps', prop: 'steps1', options: options },
                                    { type: 'steps-vertical', prop: 'steps2', options: options },
                                    {
                                        type: 'steps', prop: 'steps3', style: { marginTop: 12 }, options({ resolve }) {
                                            setTimeout(() => {
                                                resolve("step1,step2,step3")
                                            }, 600);
                                        }
                                    }
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
            <strong>提示：</strong> config中labelname 和 valuename, 可以改变对应label,value使用的名称
        </div>

        <Region
            columns={[
                { type: 'text-div@title', value: 'Steps props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: steps/-vertical' },
                                { prop: 'value', des: '值', type: 'String/Number', defaultValue: '' },
                                { prop: 'options', des: '步骤', type: <ToOptions />, defaultValue: '[]' },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'disabled', des: '是否禁用', type: 'Boolean / ({value, data}) => Boolean', defaultValue: 'false' },
                                { prop: 'config', des: <ToAntdDoc text={'antd 其他 Steps 配置'} name="steps" />, type: 'Object' }
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