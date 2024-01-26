import React from 'react'
import { Region } from 'freedomen'
import { Image, Space } from 'antd'
import DocImg from '../../DocImg'

export default function DSearch() {
    return <div>
        <Region
            columns={[
                { type: 'text-div@title', value: "Search" },
                {
                    type: 'text-div', className: 'des', value: <>
                        用于查询，其同 Form 的 inline 样式，复杂样式可以直接使用 Form
                    </>
                }
            ]}
        />
        <div className="label2">
            使用
        </div>
        <div className="doc-content">
            特殊字段名 $reset 可以重置域内数据，事件内回调的参数 params 可以取到域内的所有数据
            <Image.PreviewGroup >
                <Space>
                    <DocImg name={"components/search/1.png"} text="设计" />
                    <DocImg name={"components/search/2.gif"} text="预览" /> 
                </Space>
            </Image.PreviewGroup> 
        </div>
    </div>
}