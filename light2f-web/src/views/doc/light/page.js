import { Region } from 'freedomen'
import { Collapse, Image, Typography, theme } from 'antd'
import DocImg from '../DocImg'
import ILink from 'components/ILink'

const { Text } = Typography

export default function DPage() {
    const { token } = theme.useToken();

    const panelStyle = {
        marginBottom: 16,
        background: token.colorFillAlter,
        border: 'none',
    }

    return (<div>
        <Region
            columns={[
                { type: 'text-div@title', value: "小试牛刀" },
                {
                    type: 'text-div', className: 'des', value:
                        <>
                            我们来 <Text>从零</Text> 开发一个简易的 <Text>纯前端</Text> 项目，
                            也可以直接
                            <ILink url={'/doc/video/example'} target={null}>观看视频</ILink>
                            或许会更加清楚
                        </>
                }
            ]}
        />
        <div className="label2" >
            图文示例
        </div>
        <Collapse bordered={false} style={{ background: 'white', marginTop: 24 }}>
            <Collapse.Panel header="1. 没有接口请求的纯页面" key="1" style={panelStyle}>
                <div className="doc-content" >
                    <Image.PreviewGroup >
                        <DocImg name={"knife/-1.png"} text="项目母版菜单 (如图)" />
                        <DocImg name={"knife/-2.png"} text="复制项目母版 (如图)" />
                        <DocImg name={"knife/-3.png"} text="复制页面母版 (如图)" />
                        <DocImg name={"knife/1.png"} text="新建项目 (如图)" />
                        <DocImg name={"knife/2.png"} text="进入工作台 (如图)" />
                        <DocImg name={"knife/3.png"} text="创建页面 (如图)" />
                        <DocImg name={"knife/4.png"} text="选中页面 (如图)" />
                        <DocImg name={"knife/5.png"} text="放入容器 (如图)" />
                        <DocImg name={"knife/6.png"} text="放入元素 (如图)" />
                        <DocImg name={"knife/7.png"} text="配置查询input (如图)" />
                        <DocImg name={"knife/8.png"} text="配置按钮 (如图)" />
                        <DocImg name={"knife/9.png"} text="配置弹窗表单 (如图)" />
                        <DocImg name={"knife/10.png"} text="配置添加按钮 (如图)" />
                        <DocImg name={"knife/11.png"} text="配置Region样式 (如图)" />
                        <DocImg name={"knife/12.png"} text="Table添加初始数据 (如图)" />
                        <DocImg name={"knife/13.png"} text="配置Table显示列 (如图)" />
                        <DocImg name={"knife/14.png"} text="配置操作按钮 (如图)" />
                        <DocImg name={"knife/15.png"} text="配置表单input (如图)" />
                        <DocImg name={"knife/16.png"} text="配置表单select (如图)" />
                        <DocImg name={"knife/17.png"} text="配置表单date (如图)" />
                        <DocImg name={"knife/18.png"} text="预览 (如图)" />
                        <DocImg name={"knife/19.png"} text="下载项目 (如图)" />
                    </Image.PreviewGroup>
                </div>
            </Collapse.Panel>
            <Collapse.Panel header="2. 有登录验权，以及一个用户管理页面的完整项目" key="2" style={panelStyle}>
                <div className="doc-content" >
                    <Image.PreviewGroup >
                        <DocImg name={"knife/-1.png"} text="项目母版菜单 (如图)" />
                        <DocImg name={"knife2/2.png"} text="复制并编辑项目母版 (如图)" />
                        <DocImg name={"knife2/3.png"} text="新建页面母版 (如图)" />
                        <DocImg name={"knife2/4.png"} text="进入页面母版的设计 (如图)" />
                        <DocImg name={"knife2/5.png"} text="配置页面母版接口 (如图)" />
                        <DocImg name={"knife2/edit_masterplate_page.png"} text="配置页面母版变量模型 (如图)" />
                        <DocImg name={"knife2/8.png"} text="创建项目 (如图)" />
                        <DocImg name={"knife2/9.png"} text="进入工作台 (如图)" />
                        <DocImg name={"knife2/10.png"} text="选中登录页面 (如图)" />
                        <DocImg name={"knife2/11.png"} text="编辑登录接口请求路径 (如图)" />
                        <DocImg name={"knife2/12.png"} text="配置登录参数字段名 (如图)" />
                        <DocImg name={"knife2/13.png"} text="登录成功或失败处理 (如图)" />
                        <DocImg name={"knife2/14.png"} text="测试登录 (如图)" />
                        <DocImg name={"knife2/15.png"} text="创建用户管理页面 (如图)" />
                        <DocImg name={"knife2/16.png"} text="配置组件与参数 (如图)" />
                        <DocImg name={"knife2/17.png"} text="页面功能测试 (如图)" />
                        <DocImg name={"knife2/18.png"} text="下载项目到本地运行 (如图)" />
                    </Image.PreviewGroup>
                </div>
            </Collapse.Panel>
        </Collapse>

    </div>)
}