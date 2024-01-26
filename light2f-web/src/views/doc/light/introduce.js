import { Region } from 'freedomen'
import { Typography } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import DocImg from '../DocImg'

const { Text } = Typography
export default function DIntroduce() {
    return (<div>
        <Region
            columns={[
                { type: 'text-div@title', value: " 设计器简介" },
                {
                    type: 'text',
                    className: 'des',
                    value: <>
                        设计器（Light）是一套以可视化方式开发纯前端项目（react SPA项目）的工具，从 <Text>我的项目</Text> 中项目上的第四个菜单 <Text code><ArrowRightOutlined /></Text> 按钮进入。
                    </>
                }
            ]}
        />
        <div className="label2">
            开发流程
        </div>
        <div className="doc-content">
            <Text>以 [] 括起来是非必要流程</Text> <br />
            [创建项目母版(可以先复制系统的)] - [创建页面母版(可以先复制系统的)] - <Text>创建项目</Text> - <Text>创建页面</Text> - [拖拽修改页面层级(路由结构)] - [设计页面]- <Text>下载项目到本地运行</Text>
        </div>
        {/* <div className="label2">
            项目生成流程
        </div>
        <div className="doc-content">
            将组件、模块(也是组件的一种)、预定义、接口组合翻译为相应的视图页、样式页、接口页。在点击下载项目时，会将创建项目时选择的项目母版所对应的脚手架复制出一份，
            然后将生成的页面以及页面对应的路由等写入其中，即形成完整项目。
        </div> */}
        {/* <div className="label2">
            主要功能
        </div>
        <div className="doc-content">
            以可视化的方式从零开发完整的前端中后台类项目，实时预览，下载即可本地运行
        </div> */}
        <div className="label2">
            使用场景
        </div>
        <div className="doc-content">
            <Text>PC 端 toB 应用</Text>、 <Text>PC 端富交互应用</Text> 等
            <div className='doc-content-line'>
                <Text>在本地现有项目中使用？</Text> <br />
                前提是项目使用的UI框架是 antd5.x 版本，那么还需要安装 freedomen ：
                <Text code>npm i freedomen</Text>，将生成的代码复制到本地对应的页面中即可使用
            </div>
            <div className='doc-content-line'>
                <Text>在空项目中使用？</Text> <br />
                那你至少要安装： antd5.x 版本： <Text code>npm i antd</Text>，再安装 freedomen ：
                <Text code>npm i freedomen</Text>，然后将生成的代码复制到本地对应的页面中
            </div>
            <div className='doc-content-line'>
                <Text>空手套白狼？</Text> <br />
                在项目设计完成后，回到 <Text>我的项目</Text> 菜单下，点击下载图标即可
            </div>
        </div>
        <div className="label2">
            基础脚手架
        </div>
        <div className="doc-content">
            生成项目时的基础脚手架（如图）：<a href='https://github.com/yangaijun/light2f-project-template' target="_blank">light2f-project-template</a>
        </div>
        <DocImg name={"lightDoc_项目基本脚手架.png"} text="还未生成任何页面时的项目运行页面（如图）" />
    </div>)
}