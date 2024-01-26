import { Region } from 'freedomen'
import { Space, Typography } from 'antd'
import DocImg from '../DocImg'

const { Text } = Typography

export default function DModel() {
    return <div>
        <Region
            columns={[
                { type: 'text-div@title', value: "模块" },
                {
                    type: 'text',
                    className: 'des',
                    value: <>
                        提高开发效率的重要能力，位于工作台左侧第二个菜单, 点击 <Text code><span className='iconfont icon-mokuai' /></Text> 按钮进入，主要作用是提取 <Text code>重复使用到的功能</Text> 来重用
                    </>
                }
            ]}
        />
        <div className="label2">
            简介
        </div>
        <div className="doc-content">
            将选中的区域复制出来成为一个组合组件，称为 <Text code>模块</Text>。复制出来的与源没有关联，是完全独立的，即源被修改了，模块不会被修改。
            <div>何时使用呢？</div>
            比如我们有一个通过接口异步获取公司列表的下拉选项，而且我们在多个页面中都使用到了，那么就可以右击将第一次使用时开发的提取为<Text code>模块</Text>，那么就可以在其他页面直接使用了。又比如
            查询、列表、等等都可以提取为<Text code>模块</Text>，我们会自动在提取的时候抽象出会变化的量，再在使用的时候直接修改变量模板即可，非常方便。而且我们还预定义了丰富的常见<Text code>模块</Text>以方便我们高效开发
        </div>
        <Space>
            <DocImg name={"lightDoc_创建模块1.png"} text="创建模块1 (如图)" />
            <DocImg name={"lightDoc_创建模块2.png"} text="创建模块2 (如图)" />
        </Space>
        <div className="label2">
            使用
        </div>
        <div className="doc-content">
            点击刚刚创建的 <Text code>模块</Text>，修改可能会重复的变量名，或使用到的变量名即可放入选中的容器中，会自动创建接口、变量、函数等。
        </div>
        <Space>
            <DocImg name={"lightDoc_使用模块1.png"} text="使用模块1 (如图)" />
            <DocImg name={"lightDoc_使用模块2.png"} text="使用模块2 (如图)" />
        </Space>
    </div>
}