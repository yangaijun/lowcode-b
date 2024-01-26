import React from 'react'
import { Region } from 'freedomen'
import { Image, Space } from 'antd'
import DocImg from '../../DocImg'

export default function DForm() {
    return <div>
        <Region
            columns={[
                { type: 'text-div@title', value: "Form" },
                {
                    type: 'text-div', className: 'des', value: <>
                        表单
                    </>
                }
            ]}
        />
        <div className="label2">
            使用
        </div>
        <div className="doc-content">
            字段名为 $submit 点击会触发提交，为 $reset 会重置表单，将多元素放入一行可以使用 FormItem，若一行内还使用特别样式可以借助一些有样式的容器
            <Image.PreviewGroup >
                <Space>
                    <DocImg name={"components/form/1.png"} text="设计" />
                    <DocImg name={"components/form/2.gif"} text="预览" />
                </Space>
            </Image.PreviewGroup>
        </div>
        <div className="label2">
            Q&A
        </div>
        <div className="doc-content">
            <div>
                <b>Q：如何一行多列？</b>
            </div>
            A：在 Form 中放入一个 Row，配置其 <b>更多</b> 中的 <b>itemSpan</b> 属性，先设其值为12，那放入其中的组件就两列一行，设值为 8 则三行一列，即(24 / 8 = 3)。<br/>
            如未先设置就放入元素那要手动改元素 <b>更多</b>中的 <b>span</b> 的值 <br /><br />
            <div>
                <b>Q：如何多组件使用一个label？</b>
            </div>
            A：在 Form 中放入一个 FormItem，其中放多个组件即会使用一个 label <br /><br />
            <div>
                <b>Q：如何手动提交或者重置或修改表单值？</b>
            </div>
            A：给 Form 的 <b>常用</b> 中的 <b>ref</b> 配置一个ref名，则可以通过指令 <b>$ref.ref.submit()</b> 提交, <b>$ref.ref.reset()</b> 重置, <b>$ref.ref.set("字段名", 新值)</b> 设置字段值
            , <b>$ref.ref.get("字段名")</b> 获取值
        </div>
    </div>
}