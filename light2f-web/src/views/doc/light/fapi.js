import { Region, Dialog, Drawer } from 'freedomen'
import { Button, message, Modal, Typography } from 'antd'
import { AntdURL } from 'libs/contants'

const { Text } = Typography
const style = { paddingLeft: 0 }
const antdBaseUrl = `${AntdURL}/components/`

export default function DFapi() {
    return <div>
        <Dialog name='dialog' width={680} />
        <Drawer name='drawer' width={600} />

        <Region
            columns={[
                { type: 'text-div@title', value: "内置函数" },
                {
                    type: 'text',
                    className: 'des',
                    value: <>
                        为了方便使用（代码提示）与预览，我们对一些语法做了特殊的处理，处理后的语法我们称之为内置函数。当然在最终生成的代码里是会被转回正常写法
                    </>
                }
            ]}
        />

        <div className="label2">
            $var 变量访问
        </div>
        <div className="doc-content">
            使用：<Text>$var.常量名</Text>
            <div className='doc-content-line'>
                如我们定义了个变量 <Text code>name</Text>， 访问 <Text>name</Text>：<Text>$var.name</Text> 。我们会将页面中的变量都挂在到 <Text>$var</Text> 上，方便我们提示以及查找，当然，
                实际生成的代码是没有 <Text>$var.</Text> 的
            </div>
        </div>
        <div className="label2">
            $set 设置变量值
        </div>
        <div className="doc-content">
            使用：<Text>$set(变量名，新的值)</Text>
            <div className='doc-content-line'>
                如我们定义了个变量 <Text code>name</Text>，我们点击按钮后将其设置为 <Text code>light</Text> 。那么
                我们在按钮元素的 <Text>@click(单击事件)</Text> 中的代码则是 <Text code>$set('name', 'light')</Text>。而定义变量的实际生成代码则是
                <Text code>const [name, setName] = useState()</Text>， 而 <Text code>$set('name', 'light')</Text> 则是 <Text code>
                    setName('light')
                </Text>
            </div>
        </div>
        <div className="label2">
            $fn 函数访问
        </div>
        <div className="doc-content">
            使用：<Text>$fn.函数名</Text>

            <div className='doc-content-line'>
                如定义了个函数为 <Text>loadData</Text>，访问：<Text>$fn.loadData()</Text> 。
                我们会将页面中的函数都挂在到 <Text>$fn</Text> 上，方便我们提示以及查找，当然，实际生成的代码是没有 <Text>$fn.</Text> 的
            </div>
        </div>
        <div className="label2">
            $ref 访问组件
        </div>
        <div className="doc-content">
            使用：<Text>$ref.ref名</Text>
            <div className='doc-content-line'>
                比如我们手动提交表单就需要调用表单内部方法 <Text>submit()</Text>，那么我们就需要给设计页面里的 <Text>Form</Text> 组件的 <Text>ref</Text> 属性设置个值如 <Text>form</Text> ，在按钮元素的 <Text>@click(单击事件)</Text> 中的代码则是 <Text code>$ref.form.submit()</Text>。
                实际生成代码则是会选定义个 <Text>ref</Text>：<Text code>const form = useRef()</Text>，再将 <Text code>$ref.form.submit()</Text> 转为 <Text code>form.current.submit()</Text>。
                又如修改某属性的值<Text code>set('propName', newData/(oldData) {"=>"} newData)</Text>，则是：<Text code>$ref.form.set('list', [])</Text>，同时修改多个属性值 <Text code>set({`{propName: newData/(oldData) {"=>"} newData}`})</Text>

            </div>
        </div>

        <div className="label2">
            $global 全局
        </div>
        <div className="doc-content">
            使用：<Text>$global.常量名</Text>

            <div className='code-line'>
                来自项目母版 <Text>全局数据(项目中多处用到的相同数据或配置)</Text> 定义，当项目使用此项目母版，那么此处定义将可以在全局任意处使用
            </div>
        </div>

        <div className="label2">
            $api 接口调用
        </div>
        <div className="doc-content">
            使用：<Text>$api.接口名称([参数])[.then(res ={"> { }"})[.catch(res ={"> { }"})]]</Text>
            <div className='doc-content-line'>
                我们定义了个接口名称为 <Text>search</Text> 。那么我们调用则是
                <Text code>$api.search()</Text>。而实际生成代码则是先引入接口文件(创建接口时我们会创建一个和当前页面名称相同的文件放到 service 目录中)，
                <Text code>import userService from 'service/user'</Text>（假设文件名称为 <Text>user</Text>）；再将 <Text code>$api</Text> 改为引入名：
                <Text code>userService.search()</Text>，后续不变，接口是返回的是 Promise ，所以我们依然用 <Text>.then()</Text>，<Text>.catch()</Text> 处理服务端返回的数据
            </div>
        </div>

        <div className="label2">
            $sys 系统
        </div>
        <div className="doc-content">
            使用：<Text>$sys.属性名</Text>
            <div className='code-line'>
                <Text code>$sys.pageMenuOptions</Text>： 项目的页面菜单，用于权限控制的选项
            </div>
        </div>

        <div className="label2">
            $util 工具
        </div>
        <div className="doc-content">
            使用：<Text>$util.方法名([参数])</Text>
            <div className='code-line'>
                <Text code>$util.setUserMenuPaths(menuPaths: string[])</Text>： 控制权限，如 $util.setUserMenuPaths(["/user"])，那么当前用户只有 /user 路径页面能访问
            </div>
            <div className='code-line'>
                <Text code>$util.setPageLoading(loading = true)</Text>： 设置页面是否显示加载中图标并不可以操作
            </div>
            <div className='code-line'>
                <Text code>$util.setToken(token: string)</Text>：设置用户的 token 信息，比如登录成功后把token保存到本地
            </div>
            <div className='code-line'>
                <Text code>$util.getToken()</Text>：获取用户的 token 信息，用于获取保存后的token信息，一般在axios全局处理处使用
            </div>
            <div className='code-line'>
                <Text code>$util.setUserId(id: string | number)</Text>：设置用户的 id
            </div>
            <div className='code-line'>
                <Text code>$util.getUserId()</Text>：获取用户的 id
            </div>
            <div className='code-line'>
                <Text code>$util.download(response, fileName)</Text>：下载文件(new Blob方式，只适合下载几 MB 的小文件，千万不要下载大文件)。 response： 文件数据；fileName：文件名，如 user.zip
            </div>
            <div className='code-line'>
                <Text code>$util.dayjs()</Text>：日期和时间处理第三方工具库, 详细使用说明：<Button size='small' type='link' target='_blank' href='https://dayjs.fenxianglu.cn/'>地址</Button>
            </div>
        </div>

        <div className="label2">
            $ls 本地存储
        </div>
        <div className="doc-content">
            使用：<Text>$ls.方法名()</Text>
            <div>
                同 localStorage， 由于直接使用 localStorage 会操作到系统的数据，所以使用被禁止了，所以要使用包装后的 $ls：localStorage
            </div>
            <div className='code-line'>
                <Text code>$ls.setItem(key: string, value: string)</Text>： 存数据
            </div>
            <div className='code-line'>
                <Text code>$ls.getItem(key: string)</Text>： 取数据
            </div>
            <div className='code-line'>
                <Text code>$ls.removeItem(key: string)</Text>： 删除数据
            </div>
        </div>

        <div className="label2">
            $history 路由
        </div>
        <div className="doc-content">
            <div className='code-line'>
                <Text code>$history.push("pathname"[, state])</Text>： 跳转页面，如：跳转到登录 <Text>$history.push("/login")</Text>， 并且附带参数 <Text>$history.push("/login", {"{ id: 12, address: { a: 1, b:2 } }"})</Text>
            </div>
            <div className='code-line'>
                <Text code>$history.replace("pathname"[, [state])</Text>：替换当前页面路由，用法同上
            </div>
            <div className='code-line'>
                <Text code>$history.go(number)</Text>：到历史记录，如：上一页 <Text>$history.go(-1) </Text>
            </div>
            <div className='code-line'>
                <Text code>$history.state</Text>：url上的参数，如 A页面按钮点击跳转到登录 <Text>$history.push("/login", {"{ id: 12, address: { a: 1, b:2 } }"})</Text>， 那么登录页取A页面传的参数即：
                <Text>$history.state.id </Text> 值为 1，<br />
                那么 <Text>$history.state.address </Text> 值为 {"{ a: 1, b:2 }"}
            </div>
        </div>

        <div className="label2">
            $dialog 弹窗
        </div>
        <div className="doc-content">
            用于操作弹窗，需要在设计页面中给要操作的 <Text>Dialog/FDialog</Text> 添加 <Text >name</Text> 属性
            <div className='doc-content-line'>
                <Button style={style} type='link' size='small' onClick={() => {
                    Dialog.open('dialog', { title: 'title' }).then(set => {
                        set(<>
                            我的 name 为 dialog，那么打开我： <Text code>$dialog.open('dialog', {"{ title: 'title' }"})</Text>
                        </>)
                    })
                }}>打开</Button>： <Text code>$dialog.open(name[, {"string(title) | { title: 'title', ...其他属性 }"}])</Text>，第二个配置参数同
                <Button type='link' target='_blank' size='small' href={`${antdBaseUrl}modal-cn/#API`}>antd Modal</Button>属性
            </div>

            <div className='doc-content-line'>
                <Button style={style} type='link' size='small' onClick={() => {
                    Dialog.open('dialog', { title: '关闭demo' }).then(set => {
                        set(<>
                            我的 name 为 dialog，<Button type='link' size='small' onClick={() => {
                                Dialog.close('dialog')
                            }}>点我关闭</Button>： <Text code>$dialog.close('dialog')</Text>
                        </>)
                    })
                }}>关闭</Button>： <Text code>$dialog.close(name)</Text>
            </div>

            <div className='doc-content-line'>
                <Button style={style} type='link' size='small' onClick={() => {
                    Dialog.open('dialog', { title: '关闭demo' }).then(set => {
                        set(<>
                            我的 name 为 dialog， <Text code>$dialog.loading('dialog')</Text>
                            <div>
                                点击<Button size='small' type='link' onClick={() => {
                                    Dialog.loading("dialog", false)
                                }}>取消loading </Button>: <Text code>$dialog.loading('dialog', false)</Text>
                            </div>
                        </>)

                        Dialog.loading('dialog')
                    })
                }}>使确认按钮loading或取消loading</Button>： <Text code>$dialog.loading(name[, true/false])</Text>，常用于表示表单正在提交中
            </div>
        </div>

        <div className="label2">
            $drawer 侧滑
        </div>
        <div className="doc-content">
            用于操作侧滑窗口，需要在设计页面中给要操作的 <Text>Drawer/FDrawer</Text> 添加 <Text >name</Text> 属性
            <div className='doc-content-line'>
                <Button style={style} type='link' size='small' onClick={() => {
                    Drawer.open('drawer', { title: 'title' }).then(set => {
                        set(<>
                            我的 name 为 drawer <Text code>$drawer.open('drawer', {"{ title: 'title' }"})</Text>
                        </>)
                    })
                }}>打开</Button>： <Text code>$drawer.open(name[, {"string(title) | { title: 'title', ...其他属性 }"}])</Text>，第二个配置参数同
                <Button type='link' target='_blank' size='small' href={`${antdBaseUrl}drawer-cn/#API`}>antd Drawer</Button>属性
            </div>

            <div className='doc-content-line'>
                <Button style={style} type='link' size='small' onClick={() => {
                    Drawer.open('drawer', { title: '关闭demo' }).then(set => {
                        set(<>
                            我的 name 为 drawer<Button type='link' size='small' onClick={() => {
                                Drawer.close('drawer')
                            }}>点我关闭</Button>： <Text code>$drawer.close('drawer')</Text>
                        </>)
                    })
                }}>关闭</Button>： <Text code>$drawer.close(name)</Text>
            </div>

            <div className='doc-content-line'>
                <Button style={style} type='link' size='small' onClick={() => {
                    Drawer.open('drawer', { title: '关闭demo' }).then(set => {
                        set(<>
                            我的 name 为 drawer <Text code>$drawer.loading('drawer')</Text>
                            <div>
                                点击<Button size='small' type='link' onClick={() => {
                                    Drawer.loading("drawer", false)
                                }}>取消loading </Button>: <Text code>$drawer.loading('drawer', false)</Text>
                            </div>
                        </>)

                        Drawer.loading('drawer')
                    })
                }}>使确认按钮loading或取消loading</Button>： <Text code>$drawer.loading(name[, true/false])</Text>，常用于表示表单正在提交中
            </div>
        </div>

        <div className="label2">
            $modal 消息提示/确认
        </div>
        <div className="doc-content">
            消息提示，以<Text code>$modal.message.</Text>开头，同<Button type='link' target='_blank' size='small' href={`${antdBaseUrl}message-cn/#API`}>antd Message</Button>用法：
            <div className='doc-content-line' style={{ marginBottom: 16 }}>
                <Button style={style} type='link' size='small' onClick={() => {
                    message.success('成功提示!')
                }}>成功提示</Button>： <Text code>$modal.message.success("成功提示!")</Text>， 其它 warining、info、error 等用法相同
            </div>

            对话提示框， 以<Text code>$modal.</Text>开头，同<Button type='link' target='_blank' size='small' href={`${antdBaseUrl}modal-cn/#API`}>antd Modal</Button>中对话框用法：
            <div className='doc-content-line'>
                <Button style={style} type='link' size='small' onClick={() => {
                    Modal.confirm({
                        content: '确认删除？'
                    })
                }}>确认提示</Button>： <Text code>$modal.confirm({"{ content: '确认删除？'}"})</Text>， 其它 success、warining、info、error 等用法相同
            </div>
        </div>
    </div>
}