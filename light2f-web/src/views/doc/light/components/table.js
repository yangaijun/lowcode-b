import React from 'react'
import { Region } from 'freedomen'
import { Image, Space } from 'antd'
import DocImg from '../../DocImg'

export default function DTabel() {
    return <div>
        <Region
            columns={[
                { type: 'text-div@title', value: "Table" },
                {
                    type: 'text-div', className: 'des', value: <>
                        表格，常用户数据展示或编辑
                    </>
                }
            ]}
        />
        <div className="label2">
            使用
        </div>
        <div className="doc-content"> 
            基本使用
            <Image.PreviewGroup >
                <Space>
                    <DocImg name={"components/table/1.png"} text="设计" />
                    <DocImg name={"components/table/2.png"} text="预览" /> 
                </Space>
            </Image.PreviewGroup> 
            多元素组件到一列，以及获取行数据
            <Image.PreviewGroup >
                <Space>
                    <DocImg name={"components/table/3.png"} text="设计" />
                    <DocImg name={"components/table/4.png"} text="预览" /> 
                </Space>
            </Image.PreviewGroup> 
        </div>
    </div>
}