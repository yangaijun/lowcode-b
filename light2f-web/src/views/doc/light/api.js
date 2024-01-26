import { Region } from 'freedomen'
import { Space, Typography } from 'antd'
import DocImg from '../DocImg'

const { Text } = Typography

export default function DApi() {
    return <div>
        <Region
            columns={[
                { type: 'text-div@title', value: "接口" },
                {
                    type: 'text',
                    className: 'des',
                    value: <>
                        位于工作台左侧第四个菜单, 点击 <Text code><span className='iconfont icon-APIguanli' /></Text> 按钮进入，主要作用是与服务端做数据交互
                    </>
                }
            ]}
        />
        <div className="label2">
            注意
        </div>
        <div className="doc-content">
            <b style={{ color: 'red' }}>
                在线调用本地接口可能存在跨域问题，一般处理方案有前端代理、内网击穿、服务端允许跨域等。这里最方便的方式是在调试环境时服务端允许任意跨域，
                生产环境时关闭。
            </b>
        </div>
        <DocImg name={"lightDoc_backendCross.png"} text="示例：服务端 spring boot 框架配置的一种方式 (如图)" />
        <div className="label2">
            简介
        </div>
        <div className="doc-content">
            接口中用于定义访问服务端的接口如查询、删除、修改、添加、下载等等来与服务端数据交互，创建的接口应是当前页面所使用的
        </div>
        <div className="label2">
            添加
        </div>
        <div className="doc-content">
            点击 <Text code>添加</Text> 按钮将会弹出创建接口的表单。如我们服务端定义的查询列表的全路径为 <Text code>http://localhost:8080/freedomen/user/list</Text> ,而我们
            在 <Text>项目母版</Text> 中定义了 <Text>服务器基本路径</Text> 为 <Text code>http://localhost:8080/freedomen/api</Text> ，那么我们此处的需要输入的路径应该
            是 <Text code>user/list</Text> ，其中参数为固定名 params，如路径中有参数则可以 <Text code>user/{"${params.id}"}/list</Text>来取值； 而名称则是使用时候的方法名称，同一个页面不可以重复，如 <Text code>search</Text> , <Text code>list</Text> 等等；返回类型是服务端返回的数据，
            如下载接口则可以为 blob/ms-stream 等。 注释是使用时候的提醒，没有实际使用意义。其中参数名为固定
        </div>
        <DocImg name={"lightDoc_创建接口.png"} text="创建接口 (如图)" />

        <div className="label2">
            使用
        </div>
        <div className="doc-content">
            通过 <Text code>$api.名称</Text> 即可调用接口。如我们定义了一个 Method为：<Text code>post</Text>，路径为：<Text code>user/list</Text> ，返回类型默认(如下载接口，可以选择blob), 名称为：<Text code>search</Text> 的接口，而一般会在函数中调用，此处我们
            定义了个 <Text code>loadData</Text> 函数来调用此接口，那么我们在函数体内 <Text code>$api.search(searchData(参数))</Text> 来调用，又因为接口都是异步的(Promise)，所以我们要用 <Text code>.then(res {"=> {}"})</Text> 来
            处理我们服务端返回的数据，完整的调用即应是 <Text code>$api.search().then(res {"=> {}"})[.catch(res {"=> {}"}).finally(res {"=> {}"})]</Text>
        </div> 
        <DocImg name={"lightDoc_使用接口.png"} text="使用接口 (如图)" />
    </div>
}