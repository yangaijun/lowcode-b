import { Region, Table, Form } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import Zizi from './imgs/zizi.jpg'
import ToFilter from '../components/toFilter';
const f1 =
    `import Zizi from './imgs/zizi.jpg'
<Form  
    data={{img2: 'img.png'}}
    columns={[ 
        {type: 'img', prop: 'img1', value: 'https://flightdoc-1256372626.cos.ap-nanjing.myqcloud.com/img.png'},
        {type: 'img', prop: 'img2', filter: ({value}) => \`https://flightdoc-1256372626.cos.ap-nanjing.myqcloud.com/\${value}\`, style: {width: 240}},
        {type: 'img', prop: 'img3', value: Zizi, style: {width: 120}}
    ]}
/>`
export default function DImg() {
    return <div >
        <Region
            data={{
                use: `type: 'img'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'Img 图片' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Form
                                data={{ img2: 'img.png' }}
                                columns={[
                                    { type: 'img', prop: 'img1', value: 'https://flightdoc-1256372626.cos.ap-nanjing.myqcloud.com/img.png' },
                                    { type: 'img', prop: 'img2', filter: ({ value }) => `https://flightdoc-1256372626.cos.ap-nanjing.myqcloud.com/${value}`, style: { width: 240 } },
                                    { type: 'img', prop: 'img3', value: Zizi, style: { width: 120 } }
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
            <strong>提示：</strong> 同html  img 标签
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Img props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: img' },
                                { prop: 'value', des: '值', type: 'String/Number/...', defaultValue: '' },
                                { prop: 'filter', des: '最终使用值', type: <ToFilter /> },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' }
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