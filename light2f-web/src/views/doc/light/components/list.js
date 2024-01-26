import React from 'react'
import { Region } from 'freedomen'
import { Image, Space } from 'antd'
import DocImg from '../../DocImg'

export default function DList() {
    return <div>
        <Region
            columns={[
                { type: 'text-div@title', value: "List" },
                {
                    type: 'text-div', className: 'des', value: <>
                        列表，通过组合加样式可以构建任意样式或结构
                    </>
                }
            ]}
        />
        <div className="label2">
            使用
        </div>
        <div className="doc-content">
            <Image.PreviewGroup >
                <Space>
                    <DocImg name={"components/list/1.png"} text="设计" />
                    <DocImg name={"components/list/2.png"} text="预览" /> 
                </Space>
            </Image.PreviewGroup> 
        </div>
    </div>
}