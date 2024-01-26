import { Region } from 'freedomen'
import { Typography } from 'antd'
import DocImg from '../DocImg'
import { PlusCircleOutlined } from '@ant-design/icons'

const { Text } = Typography

export default function DMasterplatePage() {
    return <div>
        <Region
            columns={[
                { type: 'text-div@title', value: "页面母版" },
                {
                    type: 'text',
                    className: 'des',
                    value: <>
                        点击 <Text>库 / 页面母版</Text> 进入，主要作用是将相似页面 <Text code>结构与逻辑</Text> 抽离而快速应用于相似页面。
                        是自定义风格并 <Text code>高效开发</Text> 的 <Text code>重要方案</Text>
                    </>
                }
            ]}
        />
        <div className="label2">
            简介
        </div>
        <div className="doc-content">
            页面母版在什么时候使用呢？那么就要说 <Text code>结构与逻辑</Text> 了。
            举个栗子，如一个系统中多个页面都是由 搜索表单（都有查询和重置）、表格（都有编辑、删除、详情功能）、功能区（新增、导入、导出、批量删除等）、新增或编辑表单弹窗等组成，那么此为结构； 
            而 点击查询 - 修改查询变量 - 调用搜索函数，点击 新增/编辑按钮 - 弹出表单弹窗(修改其标题) - 点击提交 - 调用保存或更新接口 等，那么此为逻辑；其中如每个页面调用的接口不同，此为变量。
            那么有两个或以上的 <Text code>结构与逻辑</Text> 即可以抽离形成一个页面母版来使用，以至于高效的开发相关页面。<br />
            <Text>总结：抽出多个页面都有相同的组件与逻辑而成</Text>
        </div>
        <DocImg name={"lightDoc_页面母版.png"} text="页面母版设计页面 (如图)" />
        <div className="label2">
            创建
        </div>
        <div className="doc-content">
            点击右上角 <Text code><PlusCircleOutlined/> 新建</Text> 按钮，按提示输入相关信息，点击确认即可完成创建
        </div>
        <div className="label2">
            设计(结构与逻辑设计)
        </div>
        <div className="doc-content">
            点击卡片上的 <Text code>结构设计</Text> 按钮将会弹出 <Text>选择项目母版以配合使用全局样式</Text> 弹窗，可以选中一个项目母版（比如你接下来的项目会使用此 <Text>项目母版 </Text>，
            并且此 <Text>项目母版</Text> 中定义了 <Text>全局样式.less</Text>， 而当前 <Text>页面母版</Text> 会用到此样式）， 点击 <Text code>进入结构设计</Text> 按钮即可进入 <Text>页面母版设计页面</Text>
        </div>
        <DocImg name={"lightDoc_页面母版设计.png"} text="结构设计 (如图)" />
        <div className="label2">
            示例 
        </div>
        <div className="doc-content">
            系统会自带常见的页面母版，点击卡片上的 <Text code>结构设计</Text> 按钮即可查看详细设计，点击 <Text code>复制</Text> 按钮可以复制出一个相同的母版，可以进行修改以便于处理大同小异页面
        </div>
    </div>
}