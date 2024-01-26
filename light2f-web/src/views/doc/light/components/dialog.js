import React from 'react'
import { Region } from 'freedomen'
import { Image, Space } from 'antd'
import DocImg from '../../DocImg'

export default function DDialog() {
    return <div>
        <Region
            columns={[
                { type: 'text-div@title', value: "Dialog" },
                {
                    type: 'text-div', className: 'des', value: <>
                        Dialog 是弹窗；FDialog 是表单弹窗，同 Dialog 中放入了 Form，并且确定按钮会触发表单提交事件， $dialog.open： 打开弹窗，$dialog.close：关闭弹窗，$dialog.loading：使弹窗加载中
                    </>
                }
            ]}
        />
        <div className="label2">
            使用
        </div>
        <div className="doc-content">
            通过内置指令 $dialog.open 打开指定 name 的弹窗
            <Image.PreviewGroup>
                <Space>
                    <DocImg name={"components/dialog/1.png"} text="设计" />
                    <DocImg name={"components/dialog/2.gif"} text="预览" /> 
                </Space>
            </Image.PreviewGroup> 
            通过内置指令 $dialog.open 打开指定 name 的表单弹窗并动态修改宽度
            <Image.PreviewGroup>
                <Space>
                    <DocImg name={"components/dialog/3.png"} text="设计" />
                    <DocImg name={"components/dialog/4.gif"} text="预览" /> 
                </Space>
            </Image.PreviewGroup> 
            通过内置指令 $dialog.open 打开指定 name 的表单弹窗并传数据到表单中
            <Image.PreviewGroup>
                <Space>
                    <DocImg name={"components/dialog/5.png"} text="设计" />
                    <DocImg name={"components/dialog/6.gif"} text="预览" /> 
                </Space>
            </Image.PreviewGroup> 
        </div>
    </div>
}