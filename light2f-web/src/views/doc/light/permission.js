import { Region } from 'freedomen'
import {  Image, Typography, Space } from 'antd'
import DocImg from '../DocImg'
import ILink from 'components/ILink'

const { Text } = Typography

export default function DPage() {
 
    return (<div>
        <Region
            columns={[
                { type: 'text-div@title', value: "权限" },
                {
                    type: 'text-div', className: 'des', value:
                        <>
                           一般会根据不同登录的用户不同来展示不同的菜单，结合当前项目的页面路由结构 <Text code>$sys.pageMenuOptions</Text> ，与设置权限方法
                           <Text code>$util.setUserMenuPaths([])</Text>即可轻松实现
                        </>
                }
            ]}
        />
        <div className="label2" >
            菜单权限
        </div>
        <div className="doc-content">
            配置，我们可以创建一个页面为权限配置（当然，你也可以在现有页面中使用，并不限制如何使用），然后放入一个表单，再里面放个一个可以配置权限的组件（如：tree，treeselect等）
            将 <Text>options</Text> 属性设为 <Text code>$sys.pageMenuOptions</Text>  即可，然后将选中的通过接口保存即可
            <Image.PreviewGroup>
                <Space>
                    <DocImg name={"permission/1.png"} text="设计" />
                    <DocImg name={"permission/2.png"} text="预览" /> 
                    <DocImg name={"permission/3.png"} text="代码" />
                </Space>
            </Image.PreviewGroup> 
            设置权限，一般登录成功后（并不限制，可以动态调用），将上面提交的数组通过 <Text code>$util.setUserMenuPaths([])</Text> 方法设置即可，可以看到调用后设计器的页面菜单没有权限的页面已经用删除线表示了，而在本地运行时就不会有这些页面
            <Image.PreviewGroup>
                <Space>
                    <DocImg name={"permission/6.png"} text="设计" />
                    <DocImg name={"permission/7.png"} text="设置权限" /> 
                    <DocImg name={"permission/5.png"} text="权限菜单预览" />
                </Space>
            </Image.PreviewGroup> 
        </div>

        <div className="label2" >
            元素权限
        </div>
        <div className='des'>
            可以见 <ILink url={'/doc/freedomen/gconfig'}>权限控制配置</ILink>，在项目母版的配置 freedomen配置 中使用
        </div>
    </div>)
}