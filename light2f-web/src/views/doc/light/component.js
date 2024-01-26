import { Region } from 'freedomen'
import { Button, message, Modal, Typography } from 'antd'
import DocImg from '../DocImg'
import { QuestionCircleOutlined } from '@ant-design/icons'
import ILink from 'components/ILink'

const { Text } = Typography

const code1 = `{ 
    user: { name: '', ... }, 
    address: { ... }, 
    product: [{}, ...]
}`
const jsx1 = `<Form>
    <Region prop="user"/> 或 <Form /> (不建议表单中嵌套表单),
    <Region prop="address"/> 或 <Form /> (不建议表单中嵌套表单),
    <FormList prop='product' /> 或 <Table /> 或 <List />
</Form>`

export default function DComponent() {
    return <div>
        <Region
            columns={[
                { type: 'text-div@title', value: "组件" },
                {
                    type: 'text',
                    className: 'des',
                    value: <>
                        位于工作台左侧第一个菜单, 点击 <Text code><span className='iconfont icon-zujian' /></Text> 按钮进入，主要作用是设计页面，按住ctrl单击对应标签可以跳转到文档
                    </>
                }
            ]}
        />
        <div className="label2">
            简介
        </div>
        <div className="doc-content">
            目前<Text code>组件</Text> 中分 <Text>组件</Text>、<Text>模态框</Text>、<Text>元素</Text>、<Text>容器</Text>、<Text>布局</Text> 五种以及 <Text>全局消息确认</Text> 这种不需要实际占位的提示型函数组件。
            为了可以快速定位，如定位 <Text>Table</Text> ，那么我们可以按键盘的 <Text code>t</Text> 键，也可以快速输入 <Text code>table</Text> 来全量定位到 <Text>Table</Text> 组件(边框高亮)
        </div>
        <DocImg name={"lightDoc_组件展示.png"} text="组件展示 (如图)" />

        <div className="label2">
            全局消息确认
        </div>
        <div className="doc-content">
            如
            <Button type='link' size='small' onClick={() => {
                message.success('数据添加成功！')
            }}>添加成功提示</Button>、
            <Button type='link' size='small' onClick={() => {
                Modal.confirm({
                    content: '是否删除此条数据'
                })
            }}>是否删除确认</Button>
            此类不占位但可以使用的，具体 <Text code>API</Text> 点击如图 <Text>全局消息确认 <QuestionCircleOutlined style={{ fontSize: 12 }} /></Text> 文案会有具体说明。如当我们数据添加成功后给出提示，
            部分代码:
            <Text code>$api.insert(data).then(res {`=> {
                $modal.message.success('用户添加成功！')
            }`} )</Text>

        </div>
        <DocImg name={"lightDoc_组件_全局消息.png"} height={380} text="全局消息确认 API (如图)" />

        <div className="label2">
            组件
        </div>
        <div className="doc-content">
            倾向于业务，如 <Text>Form(表单)</Text>、<Text>Table(表格)</Text>、<Text>Search(查询)</Text> , 它们像是一个容器，装载入其中的 <Text>组件</Text>、<Text>元素</Text>、<Text>容器</Text>会
            继承其特定的样式、属性等。而它们对应的也是 freedomen 中的 <Text>组件</Text>，如果你想要了解更多的内容请查看代码文档中的<ILink url={'doc/freedomen/region'}>组件</ILink> 相关内容
            <div className='doc-content-line'>
                介绍：
            </div>
            <div className='doc-content-line'>
                <Text>Region(域)</Text>：数据结构 <Text code> {"{}"}</Text> ；顾名思义，就是一块区域，一整个页面可以是一块区域，一个卡片可以是一块区域，一个或两个按钮也可以是一块区域， 它是 <Text>freedomen</Text> 设计的核心，
                <Text>Form</Text>，<Text>Table</Text> 与 <Text>List</Text> 的行都是继承自 <Text>Region</Text>，那么我们什么时候 <Text >使用</Text> 呢？ 如表格上方希望放一些功能按钮，而按键是元素，
                元素是不可以直接放入到设计页面中的，它们就需要借助 <Text>Region</Text> 来使用。即，先在设计页面中放入 <Text>Region</Text> 容器，再在其中放入按钮或其它。
            </div>
            <div className='doc-content-line'>
                <Text>Form(表单)</Text>：数据结构 <Text code> {"{}"}</Text> ； 主要用于数据收集、校验、查询等，放入其中的子元素都会继承label(标签)，rule(校验)等属性
            </div>
            <div className='doc-content-line'>
                <Text>Search(查询)</Text>：数据结构 <Text code> {"{}"}</Text> ； 主要用于查询，同 <Text>Form</Text> 的内联样式，复杂样式请使用 <Text>Form</Text> 标签。
            </div>
            <div className='doc-content-line'>
                <Text>FormList(表单列表)</Text>：数据结构 <Text code> {"[]"}</Text> ； 主要嵌套于表单内，用于处理数据结构数据，继承 <Text>Form</Text> 属性。
            </div>
            <div className='doc-content-line'>
                <Text>Table(表格)</Text>：数据结构 <Text code> {"[]"}</Text> ； 主要用于列表数据展示，处理等。
            </div>
            <div className='doc-content-line'>
                <Text>List(列表)</Text>：数据结构 <Text code> {"[]"}</Text> ； 主要无规则的列表数据处理、展示等。
            </div>

            <div className='doc-content-line'>
                <Text>
                    通过上面介绍可知，他们都是对应相应的数据结构，那么我们就可以根据相应的数据结构来组合与数据结构的一一对应，来完成复杂的交互。一般数据交互我们都是使用表单，所以我们以表单为例，
                    服务端有这个一个数据结构:
                    <pre>
                        <Text code>
                            {code1}
                        </Text>
                    </pre>
                    那么我们的组件结构应该是：
                    <pre>
                        <Text code>
                            {jsx1}
                        </Text>
                    </pre>
                    当然，因为我们的 <Text code>prop</Text> 可以使用链式，所以可以将元素扁平化处理，将上面的两个 Region 子元素直接放入 Form 中，使得属性 prop = user.name, prop = address.*，也可以达到同样效果：
                </Text>
            </div>
        </div>
        <DocImg name={"lightDoc_组件_组件.png"} height={380} text="组件 (如图)" />

        <div className="label2">
            模态框
        </div>
        <div className="doc-content">
            弹出式浮层，常用于数据创建/编辑等，其中 <Text>Dialog</Text> 是在页面正中间的弹窗，<Text>FDialog</Text> 是表单弹窗，即与<Text>Dialog</Text> 中放入 <Text>Form</Text>是等价的;
            <Text code>Drawer</Text> 是侧滑出的弹窗，<Text>FDrawer</Text> 是表单弹窗，即与<Text>Drawer</Text> 中放入 <Text>Form</Text>是等价的; 它们虽然在设计页面中是占位的，但是在预览的
            时候没有，那是因为初始它们并不存在，而是通过 <Text code>$dialog/$drawer.*</Text> API 来动态显示与隐藏，点击其标题 <Text>模态框 <QuestionCircleOutlined style={{ fontSize: 12 }} /></Text> 会有相关使用说明
        </div>
        <DocImg name={"lightDoc_组件_模态框.png"} height={380} text="模态框 (如图)" />

        <div className="label2">
            元素
        </div>
        <div className="doc-content">
            它们只可以通过放入到 <Text>组件</Text> 或 <Text>容器</Text> 中来使用，它们是基本的展示或交互的最小单位，如输入框，按钮等等。 而且他们的 <Text>type</Text> 属性也会改变其功能或形态，如 <Text>input</Text> 是输入框，
            但是如果将其 <Text>type</Text> 改为 <Text>input-area</Text> 会变成输入区域，其它元素也会有同样效果。如果你想要了解详细的元素介绍请查看代码文档中的<ILink url={'doc/freedomen/autocomplete'}>元素</ILink> 相关内容。
            当基本满足不了需求可以点击 <Text>添加更多</Text> 去添加一些外部的元素来满足需求，
            如 图表、流程图、日历 等等
        </div>
        <DocImg name={"lightDoc_组件_元素.png"} height={380} text="元素 (如图)" />

        <div className="label2">
            容器
        </div>
        <div className="doc-content">
            它们同样也只可以通过放入到 <Text>组件</Text> 或 <Text>容器</Text> 中来使用，他们如透明或花样的碗可以结构化其内组件，一块区域的动态加载（联动）等功能。而且他们的 <Text>type</Text> 属性也可能会改变其功能或形态。
            如果你想要了解详细的容器介绍请查看代码文档中的<ILink url={'doc/freedomen/affix'}>容器</ILink> 相关内容。

        </div>
        <DocImg name={"lightDoc_组件_容器.png"} height={380} text="容器 (如图)" />

        <div className="label2">
            布局
        </div>
        <div className="doc-content">
            可以直接放到设计页面中的容器，目前分为 <Text>div</Text> 和 <Text>Tabs（切换面板）</Text>，点击如图 <Text>布局 <QuestionCircleOutlined style={{ fontSize: 12 }} /></Text> 文案有具体使用说明
        </div>
        <DocImg name={"lightDoc_组件_布局.png"} height={380} text="布局 (如图)" />
    </div>
}