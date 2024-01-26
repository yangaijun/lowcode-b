import { Region, Table, Form } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToOptions from '../components/toOptions';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `const options = [{ value: 1, label: '选项1' }, { value: 2, label: '选项2' }, { value: 3, label: '选项3', disabled: true }]
return <Form
    data={{ segmented1: 2 }}
    columns={[
        { type: 'segmented', prop: 'segmented1', options: options },
        {
            type: 'segmented', prop: 'segmented2', options({ resolve }) {
                setTimeout(() => {
                    //string/object/array
                    resolve({ 1: '选项一', 2: '选项二', 3: <>选项3<span style={{ color: 'red', marginLeft: 5 }}>选它</span></>, 4: '选项4' })
                }, 1000)
            }
        },
    ]}
/>`

export default function DSegmented() {
    return <div >
        <Region
            data={{
                use: `type: 'segmented'`, f1 
            }}
            columns={[
                { type: 'text-div@title', value: 'Segmented 分段控制器' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            const options = [{ value: 1, label: '选项1' }, { value: 2, label: '选项2' }, { value: 3, label: '选项3', disabled: true }]
                            return <Form
                                data={{ segmented1: 2 }}
                                columns={[
                                    { type: 'segmented', prop: 'segmented1', options: options },
                                    {
                                        type: 'segmented', prop: 'segmented2', options({ resolve }) {
                                            setTimeout(() => {
                                                //string/object/array
                                                resolve({ 1: '选项一', 2: '选项二', 3: <>选项3<span style={{ color: 'red', marginLeft: 5 }}>选它</span></>, 4: '选项4' })
                                            }, 1000)
                                        }
                                    },
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
            <strong>提示：</strong> 同 antd 的 Segmented
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Segmented props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: segmented' },
                                { prop: 'value', des: '值', type: 'option Value type', defaultValue: '' },
                                { prop: 'options', des: '选项', type: <ToOptions />, defaultValue: '[]' },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'disabled', des: '是否禁用', type: 'Boolean / ({value, data}) => Boolean', defaultValue: 'false' },
                                { prop: 'config', des: <ToAntdDoc text='antd 其他 Segmented 配置' name={"segmented"} />, type: 'Object' }
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