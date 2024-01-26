import React from 'react'
import { Region } from 'freedomen'
import { Image, Space } from 'antd'
import DocImg from '../../DocImg'

export default function DDrawer() {
    return <div>
        <Region
            columns={[
                { type: 'text-div@title', value: "Drawer" },
                {
                    type: 'text-div', className: 'des', value: <>
                        Drawer 是侧滑；FDrawer 是侧滑表单弹窗，同 Drawer 中放入了 Form，并且确定按钮会触发表单提交事件， $drawer.open： 打开，$drawer.close：关闭，$drawer.loading：使加载中
                    </>
                }
            ]}
        />
        <div className="label2">
            使用
        </div>
        <div className="doc-content">
            通过内置指令 $drawer.open 打开指定 name 的弹窗
            <Image.PreviewGroup>
                <Space>
                    <DocImg name={"components/drawer/1.png"} text="设计" />
                    <DocImg name={"components/drawer/2.gif"} text="预览" /> 
                </Space>
            </Image.PreviewGroup> 
            通过内置指令 $drawer.open 打开指定 name 的侧滑表单弹窗
            <Image.PreviewGroup>
                <Space>
                    <DocImg name={"components/drawer/3.png"} text="设计" />
                    <DocImg name={"components/drawer/4.gif"} text="预览" /> 
                </Space>
            </Image.PreviewGroup> 
        </div>
    </div>
}