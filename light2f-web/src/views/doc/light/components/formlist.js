import React from 'react'
import { Region } from 'freedomen'
import { Image, Space } from 'antd'
import DocImg from '../../DocImg'

export default function DFormList() {
    return <div>
        <Region
            columns={[
                { type: 'text-div@title', value: "FormList" },
                {
                    type: 'text-div', className: 'des', value: <>
                        表单列表，只可以在表单中使用
                    </>
                }
            ]}
        />
        <div className="label2">
            使用
        </div>
        <div className="doc-content">
            通过 ref， 设置对应数据来动态添加
            <Image.PreviewGroup >
                <Space>
                    <DocImg name={"components/formlist/1.png"} text="设计" />
                    <DocImg name={"components/formlist/2.gif"} text="预览" /> 
                </Space>
            </Image.PreviewGroup> 
            通过行下标加上 ref， 删除对应数据来动态删减
            <Image.PreviewGroup >
                <Space>
                    <DocImg name={"components/formlist/3.png"} text="设计" />
                    <DocImg name={"components/formlist/4.gif"} text="预览" /> 
                </Space>
            </Image.PreviewGroup> 
        </div>
    </div>
}