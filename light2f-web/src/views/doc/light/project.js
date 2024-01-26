import { Region } from 'freedomen'
import { EditOutlined, DownloadOutlined, ArrowRightOutlined, EyeOutlined } from '@ant-design/icons'
import { Typography } from 'antd'

const { Text } = Typography

export default function DProject() {
    return <div>
        <Region
            columns={[
                { type: 'text-div@title', value: "我的项目" },
                { type: 'text-div', value: <>点击 <Text>我的项目</Text> 进入</>, className: 'des' }
            ]}
        />
        <div className="label2">
            创建
        </div>
        <div className="doc-content">
            点击右侧 <Text code>新建项目</Text> 按钮， 按提示输入相关信息点击创建即可创建
        </div>

        <div className="label2">
            修改
        </div>
        <div className="doc-content">
            悬浮项目卡片，点击第一个 <Text code><EditOutlined /></Text> 按钮，即可修改字段
        </div>
        {/* 
        <div className="label2">
            3. 删除
        </div>
        <div className="doc-content">
            悬浮项目卡片，点击第一个菜单上 <Text code><DeleteOutlined /></Text> 按钮， 弹出二次确认，点击确认即可删除。
        </div> */}
        <div className="label2">
            开发（进入开发工作台）
        </div>
        <div className="doc-content">
            悬浮项目卡片，点击第四个 <Text code><ArrowRightOutlined /></Text> 按钮， 即可进入开发工作台
        </div>

        <div className="label2">
            预览
        </div>
        <div className="doc-content">
            悬浮项目卡片，点击第三个 <Text code><EyeOutlined /></Text> 按钮， 即可预览整个项目，注意，此处预览是开发模拟，与实际运行略有差异，以 <Text code>下载 & 运行</Text> 为准
        </div>

        <div className="label2">
            下载 & 运行
        </div>
        <div className="doc-content">
            点击卡片上 <Text code><DownloadOutlined /></Text> 确认下载项目，将下载的项目文件解压到本地磁盘<br /><br />

            进入目录执行后安装依赖（如果本地没有react开发环境，请先自行安装 react 开发环境搭建）：<br />
            <div className='code-line'>
                <Text code >npm install --legacy-peer-deps/yarn(推荐)</Text>
            </div>
            本地运行项目：<br />
            <div className='code-line'>
                <Text code >npm start</Text>
            </div>
            打包上生产：
            <div className='code-line'>
                <Text code >npm run build</Text>
            </div>
        </div> 
    </div>
}