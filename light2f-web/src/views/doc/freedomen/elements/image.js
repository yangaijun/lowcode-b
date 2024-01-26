import { Region, Table, Form } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import Zizi from './imgs/zizi.jpg'
import ToFilter from '../components/toFilter';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `import Zizi from './imgs/zizi.jpg'
<Form  
    data={{image2: 'img.png'}}
    columns={[ 
        {type: 'image', prop: 'image1', value: 'https://flightdoc-1256372626.cos.ap-nanjing.myqcloud.com/img.png', config: {width: 400}},
        {type: 'image', prop: 'image2', filter: ({value}) => \`https://flightdoc-1256372626.cos.ap-nanjing.myqcloud.com/\${value}\`},
        {type: 'image', prop: 'image3', value: Zizi}
    ]}
/>`
export default function DImage() {
    return <div >
        <Region
            data={{
                use: `type: 'image'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'Image 图片' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Form
                                data={{ img2: 'img.png' }}
                                columns={[
                                    { type: 'image', prop: 'img1', value: 'https://flightdoc-1256372626.cos.ap-nanjing.myqcloud.com/img.png', config: { width: 400 } },
                                    { type: 'image', prop: 'img2', filter: ({ value }) => `https://flightdoc-1256372626.cos.ap-nanjing.myqcloud.com/${value}` },
                                    { type: 'image', prop: 'img3', value: Zizi }
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
            <strong>提示：</strong> 同antd 中的Image 标签，带点击预览，大小由config中的width控制
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Image props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: img' },
                                { prop: 'value', des: '值', type: 'String/Number/...', defaultValue: '' },
                                { prop: 'filter', des: '最终使用值', type: <ToFilter /> },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'config', des: <ToAntdDoc text='antd 其他 Image 配置' name={"image"} />, type: 'Object' }
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