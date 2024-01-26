import { Region, Table, Form } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `<Form
    data={{ avatar2: \`img.png\` }}
    columns={[
        { type: 'avatar', prop: 'avatar1', value: 'https://flightdoc-1256372626.cos.ap-nanjing.myqcloud.com/img.png' },
        { type: 'avatar', prop: 'avatar2', filter: ({value}) => \`https://flightdoc-1256372626.cos.ap-nanjing.myqcloud.com/\${value}\` }
    ]}
/>`

export default function DAvatar() {
    return <div >
        <Region
            data={{
                use: `type: 'avatar'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'Avatar 头像' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Form
                                data={{ avatar2: `img.png` }}
                                columns={[
                                    { type: 'avatar', prop: 'avatar1', value: 'https://flightdoc-1256372626.cos.ap-nanjing.myqcloud.com/img.png' },
                                    { type: 'avatar', prop: 'avatar2', filter: ({value}) => `https://flightdoc-1256372626.cos.ap-nanjing.myqcloud.com/${value}` }
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
            <strong>提示：</strong> 同antd Avatar
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Avatar props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: avatar' },
                                { prop: 'value', des: '值', type: 'String/Source' },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'config', des: <ToAntdDoc text={'antd 其他 Avatar 配置'} name="avatar" /> , type: 'Object' }
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