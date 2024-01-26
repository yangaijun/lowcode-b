import { Region } from 'freedomen'
import { Typography } from 'antd'
import ILink from 'components/ILink'
import DocImg from '../DocImg'

const { Text } = Typography

export default function DMasterplateProject() {
    return <div>
        <Region
            columns={[
                { type: 'text-div@title', value: "项目母版" },
                {
                    type: 'text',
                    value: <>点击 <Text>库 / 项目母版</Text> 进入，主要作用是 <Text code>全局配置</Text></>,
                    className: 'des'
                }
            ]}
        />
        <div className="label2"> 简介 </div>
        
        <div className="doc-content">
            项目母版由一套基本脚手架(如使用create-react-app工具创建)，和一些配置组成，以便在设计器中开发时调试、使用以及预览，与项目是一对一关系，不建议多个项目使用同一个项目母版，容易在修改项目母版时影响其它项目，所以需要的项目母版配置完全相同，也应该复制一个新的使用<br />
            <div className='doc-content-line' style={{ marginTop: 14 }}>
                主要参数介绍：
            </div>
            <div className='doc-content-line'>
                <Text >脚手架</Text>： 使用create-react-app工具创建的基础脚手架，以及配置了网络访问工具 <Text code>axios</Text> 、基础布局(上头、左菜单、右内容)等，暂不支持上传自定义脚手架
            </div>
            <div className='doc-content-line'>
                <Text >保密性</Text>： 默认关闭，打开后所有人都可以复制使用
            </div>
            <div className='doc-content-line'>
                <Text >全局数据</Text>： 用于定义静态数据用于全局访问，格式 <Text code>const 常量名 = 值</Text>
            </div>
            <div className='doc-content-line'>
                <Text >freedomen配置</Text>：是对生成代码的框架进行预先配置方便全局使用（点击标题有详细介绍），如项目中的所需用到的验证(表单校验)，如组件 <Text code>upload（上传）</Text> 的
                地址的全局配置等。<br />
                更多介绍请查看 框架文档 中的 <ILink url={'/doc/freedomen/gconfig'}>预配置</ILink>
            </div>
            <div className='doc-content-line'>
                <Text >全局样式.less</Text>： 作用于全局的样式属性，如项目页面有一种或多种统一样式结构，那么即可在此定义 <Text code>.main-page {`{ ... }`}</Text> ，那么页面的 <Text code>className</Text> 属性设置为 <Text code>main-page</Text> 即可应用样式
            </div>
            <b>axios（http库，用于接口访问）配置：</b>
            <div className='doc-content-line'>
                <Text >服务器基本路径</Text>： 用于接口开发时接口调试，如 http://localhost:8080/projectName/api
            </div>
            <div className='doc-content-line' >
                <Text >Token名</Text>： 用于访问服务端的令牌名称，如服务端读取 <Text code>response</Text> 的 <Text code>header</Text> 中
                的 <Text code>x-token</Text> 值作为令牌校验，那么 <Text>Token名</Text> 即为 <Text code>x-token</Text>
            </div>
            <div className='doc-content-line' >
                <Text >ContentType</Text>： 配置传输到服务端的数据类型
            </div>
        </div>
        <DocImg name={"lightDoc_项目母版.png"} text="项目母版 (如图)" />
    </div>
}