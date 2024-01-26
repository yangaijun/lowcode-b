import { Region } from 'freedomen'
import { Typography } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import DocImg from '../DocImg'
import ILink from 'components/ILink'

const { Text } = Typography

export default function DTool() {

    return <div >
        <Region
            columns={[
                { type: 'text-div@title', value: '开发工作台' },
                {
                    type: 'text-div',
                    className: 'des',
                    value: <>
                        点击 <Text>我的项目</Text> 下的项目卡片上 <Text code><ArrowRightOutlined /></Text> ， 即进入到开发工作台， 开发工作台主要由：页面、组件、
                        模块，预定义、API、静态资源、项目母版设置、文档等模块组成
                    </>
                },
            ]}
        />
        <DocImg name={"lightDoc_工作台.png"} text="开发工作台 (如图)" />
        <div className="label2">
            页面
        </div>
        <div className="doc-content">
            点击左上角 <Text code>选择要编辑的页面(如果有选择页面会变成页面名称)</Text> 文本按钮即可打开页面菜单，再点击菜单中的 <Text code>新建页面</Text> 按钮
            按提示输入相关仓鼠即可创建新页面， 创建成功后会在 <Text code>登录页面</Text> 下面生成路由菜单，通过 <Text code>拖拽</Text> 可以修改路由菜单结构
        </div>
        <DocImg name={"lightDoc_创建页面.png"} text="创建页面 (如图)" />

        <div className="label2">
            组件
        </div>
        <div className="doc-content">
            选中左侧菜单第一个选项 <Text code><span className='iconfont icon-zujian' /></Text> 按钮，
            菜单即切换为 <Text code>组件</Text>，
            通过<Text code>拖拽或点击</Text>来编辑设计区域点击对应 <Text code>标题</Text> 会相关提示。
            更多介绍请查看<ILink url={'/doc/light/component'}>组件</ILink>
        </div>
        <DocImg name={"lightDoc_组件.png"} text="组件 (如图)" />

        <div className="label2">
            模块
        </div>
        <div className="doc-content">
            选中左侧菜单第二个选项 <Text code><span className='iconfont icon-mokuai' /></Text> 按钮，
            菜单即切换为 <Text code>模块</Text>，
            选中设计器中组件右击，选择 <Text code>将选中添加到模块</Text> 即可添加模块，单击即可使用，常用于项目中多个相同元素的组合。
            更多介绍请查看<ILink url={'/doc/light/model'}>模块</ILink>
        </div>
        <DocImg name={"lightDoc_模块.png"} text="模块 (如图)" />

        <div className="label2">
            预定义
        </div>
        <div className="doc-content">
            选中左侧菜单第三个选项 <Text code><span className='iconfont icon-program-code' /></Text> 按钮，
            菜单即切换为 <Text code>预定义</Text>，用于定义 变量、函数以及副作用(effect)，如定义个 <Text code>loading</Text> 变量来修改表格或按钮的状态，
            又或者定义个函数 <Text code>loadData</Text> 来访问服务端接口，副作用同<Text code>react useEffect</Text>， 如调用<Text code>loadData</Text>访问接口函数。
            更多介绍请查看<ILink url={'/doc/light/code'}>预定义</ILink>
        </div>
        <DocImg name={"lightDoc_预定义.png"} text="预定义 (如图)" />

        <div className="label2">
            接口
        </div>
        <div className="doc-content">
            选中左侧菜单第三个选项 <Text code><span className='iconfont icon-APIguanli' /></Text> 按钮，
            菜单即切换为 <Text code>接口</Text>，用于定义访问服务端的接口。更多介绍请查看<ILink url={'/doc/light/api'}>接口</ILink>
        </div>
        <DocImg name={"lightDoc_接口.png"} text="接口 (如图)" />

        <div className="label2">
            静态文件
        </div>
        <div className="doc-content">
            暂无相关功能
        </div>
        <div className="label2">
            项目母版设置
        </div>
        <div className="doc-content">
            点击左侧菜单第六个选项 <Text code><span className='iconfont icon-peizhi' /></Text> 按钮，弹出窗体可以对当前使用的项目母版快捷设置，具体配置见<ILink url={'/doc/light/masterplate-project'}>项目母版</ILink>
        </div>
        <DocImg name={"lightDoc_配置.png"} text="项目母版设置 (如图)" />

        <div className="label2">
            文档
        </div>
        <div className="doc-content">
            使用文档
        </div>
    </div>
}