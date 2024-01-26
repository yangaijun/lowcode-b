import React from 'react'
import { Region } from 'freedomen'
import DocImg from '../../DocImg'
import { Image, Space } from 'antd'

export default function DRegion() {
    return <div>
        <Region
            columns={[
                { type: 'text-div@title', value: "Region" },
                {
                    type: 'text-div', className: 'des', value: <>
                        域，任意一块区域。一个按钮、两个输入框等，如页面中的的功能区域，其标签为{"<></>"}，如果有样式为{"<div></div>"}
                    </>
                }
            ]}
        />
        <div className="label2">
            使用
        </div>
        <div className="doc-content">
            将数据映射到组件对应的字段名
            <Image.PreviewGroup >
                <Space>
                    <DocImg name={"components/region/1.png"} text="设计" />
                    <DocImg name={"components/region/2.png"} text="预览" /> 
                </Space>
            </Image.PreviewGroup> 
            通过设置 ref，然后动态修改域内值
            <Image.PreviewGroup >
                <Space>
                    <DocImg name={"components/region/3.png"} text="设计" />
                    <DocImg name={"components/region/4.gif"} text="预览" /> 
                </Space>
            </Image.PreviewGroup> 
            通过 ref，动态获取域内数据
            <Image.PreviewGroup >
                <Space>
                    <DocImg name={"components/region/5.png"} text="设计" />
                    <DocImg name={"components/region/6.gif"} text="预览" /> 
                </Space>
            </Image.PreviewGroup> 
        </div>
    </div>
}