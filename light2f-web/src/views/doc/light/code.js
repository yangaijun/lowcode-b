import { Region } from 'freedomen'
import { Typography } from 'antd'
import DocImg from '../DocImg'
import { PlusOutlined } from '@ant-design/icons'

const { Text } = Typography

export default function DCode() {
    return <div>
        <Region
            columns={[
                { type: 'text-div@title', value: "预定义" },
                {
                    type: 'text',
                    className: 'des',
                    value: <>
                        位于工作台左侧第三个菜单, 点击 <Text code><span className='iconfont icon-program-code' /></Text> 按钮进入
                    </>
                }
            ]}
        />
        <div className="label2">
            简介
        </div>
        <div className="doc-content">
            预定义可以预定义 变量(useState)、函数(useCallback)、副作用(useEffect)， 如果你有使用过 <Text code>react</Text> 的 <Text code>hook</Text> ，
            那么应该已经知道其作用。
        </div>
        <div className="label2">
            变量(useState)
        </div>
        <div className="doc-content">
            添加：点击 <Text code><PlusOutlined /> 添加</Text> 按钮，在弹出的表单中 <Text>类型</Text> 选择 <Text>变量</Text> 。而什么时候我们会需要用到 <Text>变量</Text> 呢？<br />
            如：需要选中表格的多条数据进行删除，
            而选中的数据就需要变量来存储，那么我们就可以定义个变量名为<Text code>selection</Text> ，而多条数据又应该是数组，
            所以我们保证数据结构一致，设置初始值为空数组<Text code>[]</Text>，而在表格的 <Text>@选择/取消选中</Text> 事件中即可以将选中的值通过系统函数 <Text code>$set('变量名', 设置的值)</Text> 保存到变量 <Text code>selection</Text> 中
            (<Text code>$set('selection', params.value)</Text> ，params.value 为 <Text>@选择/取消选中</Text> 事件回调参数:选中的值)。访问变量 <Text code>$var.selection</Text>， 以 <Text code>$var.</Text> 开头 + 变量名
        </div>
        <DocImg height={400} name={"lightDoc_预定义_创建变量.png"} text="定义变量 (如图)" />

        <div className="label2">
            函数(useCallback)
        </div>
        <div className="doc-content">
            添加：点击 <Text code><PlusOutlined /> 添加</Text> 按钮，在弹出的表单中 <Text>类型</Text> 选择 <Text>函数</Text> 。而什么时候我们会需要用到 <Text>函数</Text> 呢？<br />
            如：载入页面或点击查询会调用接口查询数据，多个事件都要使用的统一逻辑就可以定义为函数，那么我们就可以定义个函数，名为 <Text code>loadData</Text> ，假设我们的函数处理逻辑是：
            设置 <Text code>loading</Text> 变量为 <Text code>true</Text> (控制查询按钮和表格状态); 使用查询变量(因为使用到了此变量，所以影响选项要<Text>选择此变量</Text>)作为
            参数来调用接口(此处我们用setTimeout模拟接口); 接口返回结果后设置 <Text code>loading</Text> 变量为 <Text code>false</Text>，将结果保存到相应的变量。
            访问函数 <Text code>$fn.loadData()</Text>， 以 <Text code>$fn.</Text> 开头 + 函数名
        </div>
        <DocImg height={520} name={"lightDoc_预定义_创建函数.png"} text="创建函数 (如图)" />

        <div className="label2">
            引用(useRef)
        </div>
        <div className="doc-content">
            添加：点击 <Text code><PlusOutlined /> 添加</Text> 按钮，在弹出的表单中 <Text>类型</Text> 选择 <Text>ref</Text> 。 <br/>
            如我们定义名为 <Text code>info</Text>, 使用 <Text code>$ref.info</Text>，而实际代码生成为 <Text code>info.current</Text>
        </div>
        <DocImg height={520} name={"lightDoc_预定义_创建引用.png"} text="创建引用 (如图)" />

        <div className="label2">
            副作用(useEffect)
        </div>
        <div className="doc-content">
            新建：点击<Text code><PlusOutlined /> 新建</Text> 按钮。而什么时候我们会需要用到 <Text>副作用</Text> 呢？<br />
            那么先要了解其执行时机：
            <div className='doc-content-line'>
                页面第一次加载完成（肉眼可见到页面元素）后会执行一次
            </div>
            <div className='doc-content-line'>
                当使用 <Text code>$set('变量名', 设置的值)</Text> 函数修改变量值后会重新加载页面，而如果 <Text>$set</Text> 中的变量名正好在 <Text>副作用</Text> 的 <Text>影响</Text> 选项中时
                （如果选项依赖的是函数，而函数依赖此变量也是同样），那么此 <Text>副作用</Text> 将会在页面加载完成后再次执行
            </div>
            了解执行时机后那么显而易见，常见的使用有 调用加载数据接口
        </div>
        <DocImg name={"lightDoc_预定义_创建副作用.png"} text="新建副作用 (如图)" />
    </div>
}