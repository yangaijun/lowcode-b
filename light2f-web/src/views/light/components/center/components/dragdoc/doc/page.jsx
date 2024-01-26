import { Image } from 'antd'
import { AntdURL } from 'libs/contants'
import DocImg from 'views/doc/DocImg'
import { CodeJs, useType } from 'views/light/components/panel/component/doc'
import styles from './index.module.less'

function Title({ children }) {
    return <div className={styles.title}>
        {children}
    </div>
}
function CopyCodeJs(value) {
    return CodeJs({ value }, useType.copy)
}
function DetailCodeJs(value) {
    return CodeJs({ value }, useType.none)
}
function Detail({ list }) {
    return <ul>
        {list?.map((el, index) => <li key={index} id={index}>
            {el.title}
            {el.des && <div className='des'>
                {el.des}
            </div>}
            {el.code}
            {
                el.imgs && <Image.PreviewGroup>
                    {
                        el.imgs.map((props, key) => <DocImg {...props} key={key} />)
                    }
                </Image.PreviewGroup>
            }
        </li>)}
    </ul>
}

const marginTopStyle = { marginTop: 6 }

export const details = {
    UseStart: [
        {
            title: '需求分析：无论项目大小，需求分析少不了，定义一下项目功能清单',
            des: <div>
                酒店管理系统功能清单：
                <ol>
                    <li>
                        登录（进入系统入口）：输入帐号、密码点击登录后进入系统
                    </li>
                    <li>
                        会员管理（如张三, 18858465513）：按姓名、电话号码查询；展示姓名、电话；可按姓名、电话号码新增或编辑；删除要二次确认
                    </li>
                    <li>
                        房间类型管理（如双人床、大床房、小床房）：按房间名称查询；展示房间名称、单价、面积、容纳人数；可按名称、单价、面积、容纳人数新增或编辑；删除要二次确认
                    </li>
                    <li>
                        房间管理（如203、502、608）：注：房间类型选择是对应 房间类型管理 的列表。对应按房号、房间类型查询；展示房号、房间类型、单价、面积、容纳人数、状态（使用中、空闲）；可按
                        房号、房间类型新增或编辑；删除要二次确认
                    </li>
                    <li>
                        预约订单管理（如张三预定明天小床房）：注：会员名选择是对应 会员管理 的列表，房间类型选择是对应 房间类型管理 的列表。按会员名称、会员电话查询；展示会员名称、会员电话、房间类型、单价、开始到结束日期、总天数、状态（已预定、已转订单、已取消）；
                        可按会员名、房间类型、开始日期、结束日期新增或编辑（已预定状态下）；取消预定（已预定状态下）；转为订单（已预定状态下）：弹出对应空闲房间列表，选择的房间，确认；删除要二次确认
                    </li>
                    <li>
                        订单管理（住房记录）：注：会员名选择是对应 会员管理 的列表，房间类型选择是对应 房间类型管理 的列表，房号选择是对应 房间管理 的列表。按会员名称、会员电话查询；按会员名称、会员电话、房间类型、单价、面积、总价、开始到结束日期、
                        总天数、状态（进行中、已完成）；可按会员名、房间类型、房号、开始日期、结束日期新增或编辑；退房（进行中状态下）；删除要二次确认（已完成状态下）
                    </li>
                </ol>
            </div>
        },
        {
            title: '接口定义：服务端定义接口、输出的数据结构等',
            des: <div>示例项目提供了一套公共的接口，而实际开发时接口需要自行提供的，此项目并不生成服务端的代码。酒店管理系统对应服务端的： <a href='https://github.com/yangaijun/hotelapidoc' target={"_blank"}>接口文档</a></div>
        },
        {
            title: '创建项目母版：创建并配置一下脚手架的基本信息',
            des: <div>
                从手动开发思考，在创建项目之前我们需要确定使用的js库（react）、UI库（antd）、http库（axios）等；而创建项目母版等同此步骤，创建时选择脚手架并配置一下基本信息
                <div style={marginTopStyle}>
                    点击库-项目母版-我的-复制系统通用即可；修改一个母版名称其它缺省，用到时再修改，点击保存即可
                </div>
            </div>,
            imgs: [
                {
                    name: `light/use/0.png`
                },
                {
                    name: `light/use/1.png`
                }
            ]
        },
        {
            title: '创建页面母版：创建项目中多处使用到的重复功能',
            des: <div>
                从手动开发思考，在项目开发中我们可能会将项目中多处使用到的功能提取并称之为组件，通过传不同参数就可以快速使用其功能；而页面母版与之相似但却不同，相似是因为都是提取项目中多个页面中相似的功能，
                比如增删改查导入导出等等；不同是因为页面母版是用来创建页面时初始化页面的，以复制的方式而不是同源的方式来使用
                <div style={marginTopStyle}>
                    点击库-页面母版-我的-复制基本增删改查（系统预定义，系统中预定义了一个通用的增删改查母版，我们可以复制一套修改为适合自己项目的），修改一个名称并设为缺省后确定。点击刚刚创建的卡片上的结构设计并
                    选择刚刚创建的项目母版，进入结构设计
                </div>
            </div>,
            imgs: [
                {
                    name: `light/use/2.png`
                },
                {
                    name: `light/use/3.png`
                },
                {
                    name: `light/use/4.png`
                }
            ]
        },
        {
            title: '设计页面母版：设计或配置项目中多处使用到的如增删改查',
            des: <div>主要需要修改两个地方：
                <ol>
                    <li>
                        变量模版：每个系统使用时会变化的代码片断，统一做成变量模版。如接口查询的时候的分页参数，有的后台可能定义为 pageNo，也有定义为 page_no、no 等，
                        又如接口返回成功后的判断：res.success 或 res.code !== 0。将这些会变化的代码片断定义为模版变量，方便应对不同系统时方便修改。如图，我们将模版变量修改
                        为对应我们需要的片断。
                    </li>
                    <li>
                        接口：页面调用服务端的接口。分别修改访问路径，一般增删改查都是以固定名称结尾如 /search、/saveOrUpdate 等，变化的是前缀如 user/search, sys/search，那前缀变化的
                        部分使用的是变量，创建页面时的文件名：{"${fileName}"}，即在创建页面时候才确定前缀。如图，我们将接口修改为对应我们服务端定义的接口。
                    </li>
                </ol>
            </div>,
            code: CopyCodeJs(`{
                //变量模版代码片断修改
                pageNo: 'pageNo',
                pageSize: 'pageSize',
                resSuccess: 'res.code === 0',
                resTotal: 'res.data.total',
                resPageNo: 'res.data.current',
                resPageSize: 'res.data.size',
                resList: 'res.data.records'
            }`),
            imgs: [
                {
                    name: `light/use/5.png`,
                    text: `修改变量模版`
                },
                {
                    name: `light/use/6.png`,
                    text: `更新或修改接口`
                },
                {
                    name: `light/use/7.png`,
                    text: `删除接口`
                },
                {
                    name: `light/use/8.png`,
                    text: `查询接口`
                }
            ]
        },
        {
            title: '创建项目：创建将要开发的项目，并进入工作区',
            des: '点击我的项目-新建项目，输入项目名称，选择刚刚创建的项目母版确定。悬浮刚刚创建的项目卡片，点击第四个右箭头进入工作区',
            imgs: [
                {
                    name: `light/use/9.png`
                },
                {
                    name: `light/use/10.png`
                }
            ]
        },
        {
            title: '登录页调试：登录页面的功能调试',
            des: <>
                项目创建成功后就会附带一个简单的登录页面。先配置一下项目母版中的 axios(http库) 信息：基本路径与token名。然后选中登录页面，修改用户名与密码对应的字段名
                再处理点击登录后触发的表单提交事件：将表单数据提交并处理接口调用成功后的数据。
            </>,
            imgs: [
                {
                    name: `light/use/101.png`,
                    text: '配置项目母版 axios 信息'
                },
                {
                    name: `light/use/11.png`,
                    text: '配置字段名'
                },
                {
                    name: `light/use/12.png`,
                    text: '处理提交事件'
                },
                {
                    name: `light/use/13.png`,
                    text: '登录测试'
                }
            ]
        },
        {
            title: '会员管理：使用页面母版创建页面，配置相关字段',
            des: <>
                通过页面母版来创建会员管理页面，需要注意的是文件名会关联创建时母版中的接口前置路径。由于母版中查询等逻辑已经处理了，所以配置一下查询组件与字段，显示的组件与字段，
                新增与编辑的组件与字段即可完成完整页面功能
            </>,
            imgs: [
                {
                    name: `light/use/14.png`,
                    text: '创建页面'
                },
                {
                    name: `light/use/15.png`,
                    text: '配置查询功能'
                },
                {
                    name: `light/use/16.png`,
                    text: '配置表格显示数据'
                },
                {
                    name: `light/use/17.png`,
                    text: '配置新增或编辑'
                },
                {
                    name: `light/use/18.png`,
                    text: '功能测试'
                }
            ]
        },
        {
            title: '房间类型管理：使用页面母版创建页面，配置相关字段',
            des: <>
                标准通用页面，通过页面母版来创建后，配置一下查询组件与字段，显示的组件与字段，新增与编辑的组件与字段即可完成完整页面功能
            </>,
            imgs: [
                {
                    name: `light/use/19.png`,
                    text: '创建页面'
                },
                {
                    name: `light/use/20.png`,
                    text: '配置查询功能'
                },
                {
                    name: `light/use/21.png`,
                    text: '配置表格显示数据'
                },
                {
                    name: `light/use/22.png`,
                    text: '配置新增或编辑'
                },
                {
                    name: `light/use/23.png`,
                    text: '测试预览'
                }
            ]
        },
        {
            title: '房间管理：使用页面母版创建页面，配置相关字段',
            des: <>
                通过页面母版来创建并配置相关属性。注意此处房间类型的选择是来自接口查询出来，所以要添加接口处理 Select 组件的 options 属性来进行查询。
                ctrl + c 可以复制组件，ctrl + v 可以粘贴到选择的容器中，同组件同属性可避免二次配置
            </>,
            code: CopyCodeJs(`({resolve, data, value }) => {
                $api.roomTypeOptions({
                    pageNo: 1,
                    pageSize: 9999
                }).then(res => {
                    if (res.data?.records) {
                        resolve(res.data?.records)
                    }
                })
            }`),
            imgs: [
                {
                    name: `light/use/31.png`,
                    text: '创建页面'
                },
                {
                    name: `light/use/32.png`,
                    text: '添加房间类型查询接口'
                },
                {
                    name: `light/use/33.png`,
                    text: '配置Select Option'
                },
                {
                    name: `light/use/34.png`,
                    text: '配置Select labelname 与 valuename'
                },
                {
                    name: `light/use/35.png`,
                    text: '配置查询的其它项'
                },
                {
                    name: `light/use/36.png`,
                    text: '配置表格显示项'
                },
                {
                    name: `light/use/37.png`,
                    text: '配置新增与编辑'
                },
                {
                    name: `light/use/38.png`,
                    text: '测试预览'
                }
            ]
        },
        {
            title: '预约订单管理',
            des: <>
                通过页面母版来创建并配置相关属性。注意此处会员名的选择是来自接口查询出来，所以要添加接口处理 Select 组件的 options 属性来进行查询。
                而房间类型也是接口，但我们上一个页面有用过，所以可以回到房间管理页面将房间类型组件右击添加到模块，然后就可以复用了。
                注意表格显示的时候会将两个日期放在一个列内显示，以及使用 dayjs 工具格式化日期，添加或编辑的时候选择日期的校验
            </>,
            code: CopyCodeJs(`({ value, data }) => {
                //日期使用 dayjs 格式化
                return $util.dayjs(data.prebookStartedAt).format('YYYY-MM-DD') 
                    + " 至 " 
                    + $util.dayjs(data.prebookEndedAt).format('YYYY-MM-DD')
            } 
            //会员列表 options 属性
            ({resolve, data, value }) => {
                $api.vipOptions({
                    pageNo:1,
                    pageSize: 9999
                }).then(res => {
                    if (res.data?.records) {
                        resolve(res.data?.records)
                    }
                })
            }
            //开始日期校验
            ({data, value}) => {
                if (!value) {
                    return Promise.reject('请选择！')
                } else if ($util.dayjs().isAfter(value, 'day')) {
                    return Promise.reject('请不要选择历史时间！')
                } else {
                    return Promise.resolve()
                }
            }
            //结束日期校验
            ({data, value}) => {
                if (!value) {
                    return Promise.reject("请选择！")
                } else if ($util.dayjs(data.prebookStartedAt) > $util.dayjs(value)) {
                    return Promise.reject("结束时间不能小于开始时间！")
                } else {
                    return Promise.resolve()
                }
            }
            `),
            imgs: [
                {
                    name: `light/use/41.png`,
                    text: '创建页面'
                },
                {
                    name: `light/use/42.png`,
                    text: '配置查询'
                },
                {
                    name: `light/use/43.png`,
                    text: '配置表格'
                },
                {
                    name: `light/use/44.png`,
                    text: '两日期同列显示与日期格式化'
                },
                {
                    name: `light/use/45.png`,
                    text: '将房间管理的房间类型选择器创建为模块'
                },
                {
                    name: `light/use/46.png`,
                    text: '使用房间类型选择器模块'
                },
                {
                    name: `light/use/47.png`,
                    text: '创建查询会员列表的接口'
                },
                {
                    name: `light/use/48.png`,
                    text: '配置会员列表选项的 options 属性'
                },
                {
                    name: `light/use/49.png`,
                    text: '配置会员列表选项的选项对应的字段'
                },
                {
                    name: `light/use/491.png`,
                    text: '表单弹窗配置'
                },
                {
                    name: `light/use/492.png`,
                    text: '表格添加其他操作，注意根据状态加载'
                },
                {
                    name: `light/use/493.png`,
                    text: '创建取消功能的接口'
                },
                {
                    name: `light/use/494.png`,
                    text: '处理取消接口事件，调用接口'
                }
            ]

        }
    ],
    ProjectConfig: [
        {
            title: '服务器基本路径：创建每一个项目有一个基础脚手架，里面会依赖一个 axios(http 库)来用于调用接口，axios 基本路径配置（多个接口前面相同的地方）',
            code: DetailCodeJs(`//如项目中有如下三个接口，查询用户列表\nhttp://localhost:8080/myproject/user/search\n//删除用户\nhttp://localhost:8080/myproject/user/delete\n//查询订单列表\nhttp://localhost:8080/myproject/order/search\n//那么基本路径则为\nhttp://localhost:8080/myproject/`)
        },
        {
            title: 'Token名：一般与服务端进行数据传输时会在header中放一个令牌的名称，如 token、x-token、auth，通过 $util.setToken 设置令牌的值',
            code: DetailCodeJs(`//服务端获取请求的令牌，那么此处则应该是x-token\nrequest.getHeader("x-token")\n//请求服务端登录后返回令牌，在登录页面来设置token\n$api.login({password}).then(data => {\n    $util.setToken(data.token)\n})`)
        },
        {
            title: 'ContentType： 传给服务端的数据类型默认 json',
        },
        {
            title: `全局数据：项目中多处使用到的同样的静态数据，const 常量名 = 值，使用$global.常量名`,
            code: DetailCodeJs(`const genderOptions = [
                { value: 1, label: 'boy' },
                { value: 2 label: 'girl' }
            ]
            const maxLine = 9527
            //页面中使用
            $global.genderOptions, $global.maxLine`)
        },
        {
            title: 'Freedomen配置：UI框架的配置，如上传文件组件的上传地址、组件的大小、元素的权限、表单校验的自定义等，具体点击对应的 label 会有提示',
            code: DetailCodeJs(`Freedomen.setPermission({column, data, value} => {...})\nFreedomen.registerRules({...})\nFreedomen.setDefaultConfigs(() => {...})`)
        },
        {
            title: '全局样式.less：比如每个页面都有相同的样式，即可以写到此处，然后使用到的地方使用此样式名称',
            code: DetailCodeJs(`.mypage {
                padding: 12px;
            }`)
        }
    ],
    PageCreate: [
        {
            title: `页面类型：母版页面、空白页面。母版页面需要选择页面母版，在创建的时候会附带母版功能。空白页面则是空的页面`,

        },
        {
            title: `页面名称：左侧菜单显示的名称，如用户管理、订单管理等`,

        },
        {
            title: `文件名称：生成前端页面的文件名称（缺省为页面名称全拼音），如 user，则生成的代码文件为：user.jsx，同一级下不能重复。创建选择母版页面时，也许母版在创建接口时会使用到了此名称`,
            code: DetailCodeJs(`//在设计母版时有一接口为\n\${fileName}/search\n//那在创建此接口时会将 \${fileName} 修改为此处名称，即\nuser/search`)
        },
        {
            title: `路由路径：在开发时用于跳转到此页面时的路径，如：user`,
            code: DetailCodeJs(`//开发时跳转到此页面\n$history.push('/user')`)
        },
        {
            title: `页面母版(选择了母版页面状态下)：创建页面时的基础依赖，比如空的（查询、编辑等功能在，但没有元素）增删改查等功能`,
        },
        {
            title: `在菜单中：在真实环境下左侧菜单中是否显示页面名称`,
            code: DetailCodeJs(`//通过方法依然可以跳转到此页面\n$history.push('/user')`)
        },
    ],
    PageRouter: [
        {
            title: `跳转页面（push）：$history.push("pathname"[, state])`,
            code: DetailCodeJs(`//跳转到登录\n$history.push("/login")\n//附带参数\n$history.push("/login", { id: 12, address: { a: 1, b:2 } })`)
        },
        {
            title: `跳转页面（replace）：$history.replace("pathname"[, state])，用法同上`,

        },
        {
            title: `到历史记录：$history.go(number)`,
            code: DetailCodeJs(`//回到上一页\n$history.go(-1)`)
        },
        {
            title: `获取参数：$history.state，url上的参数`,
            code: DetailCodeJs(`//A 页面跳转到 B\n$history.push("/login", { id: 12, address: { a: 1, b:2 } })\n//B 取 A 传过来的参数\n$history.state.id //1\n$history.state.address //{ a: 1, b:2 }`)
        },
    ],
    CmpMsg: [
        {
            title: `成功提示：$modal.message.success`,
            code: CopyCodeJs(`$modal.message.success("成功!")`),
            imgs: [{
                name: "light/component/msg/1.png"
            }]

        },
        {
            title: `失败提示：$modal.message.error`,
            code: CopyCodeJs(`$modal.message.error("失败!")`),
            imgs: [{
                name: "light/component/msg/2.png"
            }]

        },
        {
            title: `警告提示：$modal.message.warning`,
            code: CopyCodeJs(`$modal.message.warning("警告!")`),
            imgs: [{
                name: "light/component/msg/3.png"
            }]

        },
        {
            title: `消息提示：$modal.message.info`,
            code: CopyCodeJs(`$modal.message.info("消息!")`),
            imgs: [{
                name: "light/component/msg/4.png"
            }]
        },
        {
            title: `加载中提示：$modal.message.loading`,
            code: CopyCodeJs(`$modal.message.loading("加载中!")`),
            imgs: [{
                name: "light/component/msg/5.png"
            }]

        },
        {
            title: `确认对话框：$modal.confirm`,
            code: CopyCodeJs(`$modal.confirm({
                title: "title",
                content: "提示内容",
                onOk() { alert("确定回调") },
                onCancel() { alert("取消回调") }
            })`),
            imgs: [{
                name: "light/component/msg/6.png"
            }]

        },
        {
            title: `警告对话框：$modal.warning`,
            code: CopyCodeJs(`$modal.warning({
                title: "title",
                content: "提示内容",
                onOk() { alert("确定回调") }
            })`),
            imgs: [{
                name: "light/component/msg/7.png"
            }]
        },
        {
            title: `错误对话框：$modal.error`,
            code: CopyCodeJs(`$modal.error({
                title: "title",
                content: "提示内容",
                onOk() { alert("确定回调") }
            })`),
            imgs: [{
                name: "light/component/msg/8.png"
            }]
        },
        {
            title: `成功对话框：$modal.success`,
            code: CopyCodeJs(`$modal.success({
                title: "title",
                content: "提示内容",
                onOk() { alert("确定回调") }
            })`),
            imgs: [{
                name: "light/component/msg/9.png"
            }]
        },
        {
            title: `消息对话框：$modal.info`,
            code: CopyCodeJs(`$modal.info({
                title: "title",
                content: "提示内容",
                onOk() { alert("确定回调") }
            })`),
            imgs: [{
                name: "light/component/msg/10.png"
            }]
        },
    ],
    CmpRegion: [
        {
            title: `赋值：给 Region 添加 data 对应到其内的元素中`,
            des: "由图可以看出，内部组件的字段名对应 key，组件是可以嵌套的，每嵌套一个组件并设置字段名后会为 data 增加一个层级，而其它没有字段名的容器类无论嵌套多少层也不会影响数据结构。如 data 为 {a: {b: 1}}, 让组件直接对应 b，可以将字段名设置为 a.b，以此类推",
            imgs: [{
                name: "light/component/region/1.png", text: '数据分配'
            }]
        },
        {
            title: `数据收集：有字段名并触发了 onChange 事件元素的数据都会被自动收集到 Region 的 data 中，并会触发 Region 的 change 事件`
        },
        {
            title: `联动：内部组件的样式、失效、显示等关联关系`,
            des: "Region 收集数据会时时传到其各个元素中，而每个组件、容器、元素则可以据此动态转换显示、失效、样式等功能。如下，预先在input中判定域内radio字段的值为 1 时显示即可，在使用时 Region 会将 radio 的值实时通知到 input",
            imgs: [
                {
                    name: "light/component/region/2.png",
                    text: '配置 radio'
                },
                {
                    name: "light/component/region/3.png",
                    text: '配置显示时机，域内 radio 的值为 1 时才显示'
                }
            ]
        },
        {
            title: '手动修改值：$ref.(ref名称).set("propName", newValue/(current) => newValue)，给 Region 的 ref 属性添加个名称，如 regionRef',
            code: DetailCodeJs(`//region 的 data 为\n{a: 12, b: { c: 12 }}\n//将 a 属性修改为 1\n$ref.regionRef.set("a", 1)\n//将 b 属性下的 c 值加1\n$ref.regionRef.set("b.c", current=> current + 1)`),
        },
        {
            title: '手动获取值：$ref.(ref名称).get("propName"/undefined)，给 Region 的 ref 属性添加个名称，如 regionRef',
            code: DetailCodeJs(`//获取全部数据\n$ref.regionRef.get()\n//获取属性 a 的值\n$ref.regionRef.get("a")\n//获取属性 b 下的 c 的值\n$ref.regionRef.get("b.c")`),
        },
        {
            title: `分步表单：通过联动实现分步表单`,
            des: "思路：在 Region 中放入一个步骤组件，再放入三个表单，步骤条值为 1 时显示第一个，由此类推。只要了解通过数据驱动组件的思路，组件内预判数据变化给出处理方案，就可随机应变",
            imgs: [
                {
                    name: "light/component/region/4.png", text: '配置 step'
                },
                {
                    name: "light/component/region/5.png", text: '配置表单二'
                },
                {
                    name: "light/component/region/6.png", text: '配置表单三'
                }
            ]
        }
    ],
    CmpSearch: [
        {
            title: `查询：将 Search 内数据收集来调用查询接口`,
            des: `在 Search 中放入一个按钮，将按钮的字段名任意设置(如search)，值为查询，点击事件中 params.row 则为 Search 内的所有数据，即再在Search中放入一个Input并配置字段名，修改Input值后 params.row 中依然会有此 Input 的值`,
            imgs: [
                {
                    name: "light/component/search/1.png"
                }
            ]
        },
        {
            title: `重置：将 Search 内数据重置为第一将绑定的数据`,
            des: `在 Search 中放入一个按钮，并将按钮的字段名固定设计为以 $reset 开头(如：$reset, $reset1, $reset-two)，那么此按钮被点击时会触发重置功能`
        },
    ],
    CmpForm: [
        {
            title: `提交：触发校验，校验成功后将表单内数据回调到表单提交函数中用于调用保存或修改接口`,
            des: `在 Form 中放入一个按钮，并将按钮的字段名固定设计为以 $submit 开头(如：$submit, $submit-next, $submit-prev)，那么此按钮被点击时会触发提交功能，或者配置 ref 名后手动调用 $ref.(refName).submit() 也可以`,
            imgs: [{
                name: "light/component/form/6.png",
                text: "提交按钮"
            }, {
                name: "light/component/form/8.png",
                text: "ref 手动提交"
            }]
        },
        {
            title: `重置：将 Form 内数据重置为第一将绑定的数据`,
            des: `在 Form 中放入一个按钮，并将按钮的字段名固定设计为以 $reset 开头(如：$reset, $reset1, $reset-two)，那么此按钮被点击时会触发重置功能，或者配置 ref 名后手动调用 $ref.(refName).reset()`
        },
        {
            title: `多元素一行：多元素对应一个label`,
            des: `在 Form 中放入一个 FormItem，再在 FormItem 中放元素即可将多元素对应一个label（但其数据结构还是对应多个字段），可以在 FormItem中再放一些其它控制样式的容器来美化布局，如Space、InputGroup 等`,
            imgs: [{
                name: "light/component/form/1.png",
                text: "普通二合一"
            }, {
                name: "light/component/form/2.png",
                text: "加 Space 容器二合一"
            }, {
                name: "light/component/form/3.png",
                text: "加 InputGroup 容器二合一"
            }]
        },
        {
            title: `多列布局：一行多列`,
            des: `在 Form 中放入一个 Row，设置 Row 的 itemSpan 属性为 8，那么放入其中的组件则为 3 列，而如果设置 itemSpan 属性为 12 那么则为 2 列布局，6 为 4 列`,
            imgs: [{
                name: "light/component/form/4.png",
                text: "3列一行"
            }, {
                name: "light/component/form/5.png",
                text: "2列一行"
            }]
        },
        {
            title: `其它组合：可以自由任意复杂组合，如放入Table、FormList、等等`,
            des: `无论如何组合，核心是控制好数据结构，以数据驱动，如Form、Region等对应结构为{}; Table、FormList 等对应[]; 以此类推`,
            imgs: [{
                name: "light/component/form/7.png",
                text: "组合表格"
            }]
        },
    ],
    CmpFormList: [
        {
            title: `添加一条：给 FormList 添加一条数据`,
            des: `第一种通过 $push 字段名：放入一个按钮将其属性设置为 $push 即可，在点击按钮后会自动添加一条空数据; 第二种通过 Form 的 ref 直接修改数据结构（以数据驱动）：设置 Form 的 ref，设置 FormList 的字段名，通过 $ref 方式，此方式更灵活，如可以设置新一条数据的初始值等等`,
            imgs: [{
                name: "light/component/formlist/1.png",
                text: "第一种方案 1，初始化数据"
            }, {
                name: "light/component/formlist/2.png",
                text: "第一种方案 2，设置按钮字段名"
            }, {
                name: "light/component/formlist/3.png",
                text: "第二种方案 1，设置 ref 字段"
            }, {
                name: "light/component/formlist/4.png",
                text: "第二种方案 2，点击事件处理"
            }]
        },
        {
            title: `删除一条：删除一条 FormList 的数据`,
            des: `第一种通过 $delete 字段名：放入一个按钮将其属性设置为 $delete 即可，点击会自动删除按钮所在行；第二种同样通过 Form 的 ref 直接修改：父组件数据结构是数据时，子元素事件的回调的行数据会有当前数据下标 $index，通过此 $index 来删除对应行数据即可`,
            imgs: [{
                name: "light/component/formlist/5.png",
                text: "第一种方案 1，初始化数据"
            }, {
                name: "light/component/formlist/6.png",
                text: "第一种方案 2，设置按钮字段名"
            }, {
                name: "light/component/formlist/7.png",
                text: "第二种方案，点击事件处理"
            }]
        },
    ],
    CmpTable: [
        {
            title: `常见数据展示：展示列表的数据并有操作列`,
            des: `将需要展示的对应类型组件放入到 Table 中， 如文本(Text), 图片(Img、Image)、标签(Tag)等等; 再放入一个容器，任意容器都可以将多个元素结合为一列，如Div、Space、Fragment等等，再在容器中放入两个按钮，并初始化 Table 值`,
            imgs: [
                {
                    name: "light/component/table/1.png",
                    text: "数据展示"
                }
            ]
        },
        {
            title: `固定列与滚动：数据列过多时，固定某些列，显示不下时滚动`,
            des: `配置表格 scrollX 值，配置每一列固定宽度，配置列固定的位置`,
            imgs: [
                {
                    name: "light/component/table/2.png",
                },
                {
                    name: "light/component/table/3.png",
                },
                {
                    name: "light/component/table/4.png"
                }
            ]
        },
        {
            title: `多元素一列：一个列中展示多组数据`,
            des: `放入一个组件会占一列，放入一个容器也是占一列，所以放可以容纳元素的（如Region、Table、Space、Div）即可以将多元素组合为一列。同样没有字段的容器不会影响数据结构层级`,
            imgs: [
                {
                    name: "light/component/table/5.png",
                }
            ]
        },
        {
            title: `设置数据：设置列表数据`,
            des: `一般查询后会重新修改表格的数据，我们需要给 Table 配置一个字段名，然后通过 $set('字段名', []) 来修改`,
            imgs: [
                {
                    name: "light/component/table/6.png",
                },
                {
                    name: "light/component/table/7.png",
                }
            ]
        },
        {
            title: `树行结构展示：有子集同结构的数据展示: [{a:"1", children: [{a: "1-1"}]}]`,
            code: DetailCodeJs(`//如上 data 有 children 子层级即可\n[\n    {\n        name: '爸爸',\n        children: [\n            { name: '儿子' },\n            { name: '女儿' }\n        ]\n    }\n]`),
            imgs: [
                {
                    name: "light/component/table/8.png"
                }
            ]
        },
        {
            title: `选中行数据：选中多行数据用于对多数据操作，以及行不可选`,
            des: `将 Table 的属性 是否可选 打开，会有两个处理函数用来处理选中的数据与行数据是否可选`,
            imgs: [
                {
                    name: "light/component/table/9.png",
                    text: "显示选中"
                },
                {
                    name: "light/component/table/10.png",
                    text: "不可选"
                }
            ]
        },
        {
            title: `分页：数据过多时，配置分页，与相关操作等`,
            des: `将 Table 的属性 是否分页 打开，即会有对应配置与处理函数，一般触发分页会调用接口重新查询对应页数据，而配置则是查询的数据来更新分页信息（如多少条）`
        }
    ],
    CmpList: [],
    ModalFDialog: [
        {
            title: `打开弹窗：通过指令打开弹窗 $dialog.open`,
            des: `配置 FDialog 的 name 属性（如: userDialog），然后通过指令即可打开对应 name 的弹窗。对话框配置同 antd Modal 的参数如： width、title 等`,
            code: DetailCodeJs(`$dialog.open("name", title | {对话框配置}, {表单参数})`),
            imgs: [
                {
                    name: "light/component/fdialog/1.png",
                    text: "配置 name 属性"
                },
                {
                    name: "light/component/fdialog/2.png",
                    text: "按钮点击事件中处理"
                }
            ]
        },
        {
            title: `关闭弹窗：通过指令关闭弹窗 $dialog.close`,
            des: `配置 FDialog 的 name 属性（如: userDialog），然后通过指令即可关闭对应 name 的弹窗，点击取消按钮或关闭按钮当然也会关闭弹窗。如点击确定验证表单成功后关闭弹窗`,
            code: DetailCodeJs(`$dialog.close("name")`),
            imgs: [
                {
                    name: "light/component/fdialog/3.png",
                    text: "按钮点击事件中处理"
                }
            ]
        },
        {
            title: `弹窗确定/取消加载中：通过指令使弹窗的确定按钮处于加载中 $dialog.loading`,
            des: `配置 FDialog 的 name 属性（如: userDialog），然后通过指令即可通过对应 name 使确定按钮处于加载中状态。点击确定提交时是异步请求，此过程中可以让确定处于加载中`,
            code: DetailCodeJs(`$dialog.loading("name"[, true/false(缺省 true)])`),
            imgs: [
                {
                    name: "light/component/fdialog/4.png",
                    text: "按钮点击事件中处理"
                }
            ]
        },
        {
            title: `打开弹窗并配置与传参：打开弹窗并修改弹窗与宽度去掉按钮并初始化表单数据`,
            des: `配置 FDialog 的 name 属性（如: userDialog），然后通过指令即可打开对应 name 的弹窗并附带参数`,
            imgs: [
                {
                    name: "light/component/fdialog/5.png",
                    text: "按钮点击事件中处理"
                }
            ]
        }
    ],
    ModalDialog: [
        {
            title: `打开、关闭、加载中：与 FDialog 指令相同`,
            des: `配置 FDialog 的 name 属性（如: userDialog），然后通过指令即可打开对应 name 的弹窗并附带参数`
        },
        {
            title: `弹出查询：弹出窗查询与表格列表`,
            des: `在弹窗中放入一个 Search 用于查询， Table 用于数据显示`,
            imgs: [
                {
                    name: "light/component/dialog/1.png",
                    text: "配置"
                },
                {
                    name: "light/component/dialog/2.png",
                    text: "展示"
                }
            ]
        }
    ],
    ModalFDrawer: [
        {
            title: `打开、关闭、加载中：与 FDialog 指令相同，将 $dialog 改为 $drawer 即可`,
            des: `配置 FDrawer 的 name 属性（如: userDrawer），然后通过指令即可打开对应 name 的弹窗并附带参数`,
            code: DetailCodeJs(`$drawer.open("name", title | {侧滑窗配置}, {表单参数})`),
            imgs: [
                {
                    name: "light/component/fdrawer/1.png",
                    text: "打开"
                }
            ]
        }
    ],
    ModalDrawer: [],
    ModelCreate: [
        {
            title: `提取查询功能：将查询功能与逻辑提取成模块`,
            des: ``,
            imgs: [
                {
                    name: "light/model/1.png",
                    text: "打开"
                },
                {
                    name: "light/model/2.png",
                    text: "打开"
                },
                {
                    name: "light/model/3.png",
                    text: "打开"
                },
                {
                    name: "light/model/4.png",
                    text: "打开"
                }
            ]
        }
    ]
}

const UseStart = () => {
    return <div>
        <Title>
            {UseStart.title}
        </Title>
        <div>
            详细介绍如何高效的（10-15 分钟）从零开发一个简单的酒店管理系统对应的前端功能
            <Image.PreviewGroup>
                <DocImg name={"light/use/10000.png"} />
            </Image.PreviewGroup>
            <Detail list={details.UseStart} />
        </div>
    </div>
}
UseStart.title = "开发酒店管理系统"

const UseLocal = () => {
    return <div>
        <Title>
            {UseLocal.title}
        </Title>
        <div>
            开发完成后下载到本地运行个性化修改
        </div>
    </div>
}
UseLocal.title = "本地运行与编辑"

const ProjectConfig = () => {
    return <div>
        <Title>
            {ProjectConfig.title}
        </Title>
        <div>
            如图，点击左侧设置图标可以打开
            <Image.PreviewGroup>
                <DocImg name={"light/project/1.png"} />
            </Image.PreviewGroup>
            <Detail list={details.ProjectConfig} />
        </div>
    </div>
}
ProjectConfig.title = "项目母版配置"

const PageCreate = () => {
    return <div>
        <Title>
            {PageCreate.title}
        </Title>
        <div>
            如图，点击左侧页面名称后在弹出的页面侧滑抽屉上点击 新建页面 即可
            <Image.PreviewGroup>
                <DocImg name={"light/page/create/1.png"} />
                <DocImg name={"light/page/create/2.png"} />
                <DocImg name={"light/page/create/3.png"} />
            </Image.PreviewGroup>
            <Detail list={details.PageCreate} />
        </div>
    </div>
}
PageCreate.title = "新建页面"

const PageMenu = () => {
    return <div>
        <Title>
            {PageMenu.title}
        </Title>
        <div>
            如图，通过拖拽可以修改菜单的顺序、层级，如果有子层级那么其会成为文件夹类型，所以其不可以再进行设计开发。
            系统会附带个登录页面是独立的，不在此功能中。
            <Image.PreviewGroup>
                <DocImg name={"light/page/menu/1.png"} />
                <DocImg name={"light/page/menu/2.png"} />
            </Image.PreviewGroup>
        </div>
    </div>
}
PageMenu.title = "页面菜单结构"

const PageRouter = () => {
    return <div>
        <Title>
            {PageRouter.title}
        </Title>
        <div>
            如图，可以在按钮的点击事件中，通过 $history 进行页面跳转到需要的页面
            <Image.PreviewGroup>
                <DocImg name={"light/page/router/1.png"} />
            </Image.PreviewGroup>
            <Detail list={details.PageRouter} />
        </div>
    </div>
}
PageRouter.title = "页面跳转"

const CmpMsg = () => {
    return <div>
        <Title>
            {CmpMsg.title}
        </Title>
        <div>
            在页面的代码中可以使用对应的方法来直接进行消息提示、消息确认。如点击事件中，接口成功回调中，页面组件加载完成(useEffect)中等等都可以
            <div style={{ paddingTop: 5 }}>
                <b>
                    $modal.message./$modal. 同 <a target={"_blank"} href={`${AntdURL}/components/overview-cn/`}>ant.design</a> 的 Message./Modal. 更多参数
                </b>
            </div>
            <Detail list={details.CmpMsg} />
        </div>
    </div>
}
CmpMsg.title = "全局消息确认"

const CmpRegion = () => {
    return <div>
        <Title>
            {CmpRegion.title}
        </Title>
        <div>
            可以理解为一个容器（有样式时是div,没则是 Fragment 空标签），用于承载元素、容器、组件等（元素容器不可以直接放到页面中），
            而 Region 就是核心（Form、Table、List等皆是以此为根基），负责控制其中的组件的权限（联动）、数据收集/分发、事件代理等以更方便我们来控制
            <DocImg name={"light/component/region/0.png"} text="组件下的第一个便是，没元素时没有形态" />
            <Detail list={details.CmpRegion} />
        </div>
    </div>
}
CmpRegion.title = "域 Region"

const CmpSearch = () => {
    return <div>
        <Title>
            {CmpSearch.title}
        </Title>
        <div>
            表单(Form)的内联(一行)样式，复杂查询(条件非常多)使用表单(Form)做为查询，用于将内部组件的数据收集用来查询。
            放入其中的元素、容器、组件等会附带 label、rule、help 等等表单的属性
            <DocImg name={"light/component/search/0.png"} text="组件下的第二个便是，没元素时没有形态" />
            <Detail list={details.CmpSearch} />
        </div>
    </div>
}
CmpSearch.title = "查询 Search"

const CmpForm = () => {
    return <div>
        <Title>
            {CmpForm.title}
        </Title>
        <div>
            常用于数据录入，放入其中的元素、容器、组件等会附带 label、rule、help 等等表单的属性
            <DocImg name={"light/component/form/0.png"} text="组件下的第三个便是，没元素时没有形态" />
            <Detail list={details.CmpForm} />
        </div>
    </div>
}
CmpForm.title = "表单 Form"

const CmpFormList = () => {
    return <div>
        <Title>
            {CmpFormList.title}
        </Title>
        <div>
            常用于数据录入表单中的数组([])数据结构，录入同key名的多条数据，表格Table、列表List也可以实现，但展示样式不同。
            FormList 只可以放在 Form 组件中使用，其它(Table、List)可以单独使用也可以放在 Form 中。
            用法与 Form 相同，按Form来使用，只是数据为多条时展示为多个 Form
            <DocImg name={"light/component/formlist/0.png"} text="组件下的第四个，要放在 Form 中使用" />
            <Detail list={details.CmpFormList} />
        </div>
    </div>
}
CmpFormList.title = "表单列表 FormList"

const CmpTable = () => {
    return <div>
        <Title>
            {CmpTable.title}
        </Title>
        <div>
            常用于列表数据展示与操作，也可以用到表单中做数据录入等等
            <DocImg name={"light/component/table/0.png"} text="组件下的第5个" />
            <Detail list={details.CmpTable} />
        </div>
    </div>
}
CmpTable.title = "表格 Table"

const CmpList = () => {
    return <div>
        <Title>
            {CmpList.title}
        </Title>
        <div>
            常用于列表数据展示与操作，也可以用到表单中做数据录入等等
            <DocImg name={"light/component/list/0.png"} text="组件下的第6个" />
            <Detail list={details.CmpList} />
        </div>
    </div>
}
CmpList.title = "列表 List"

const ModalFDialog = () => {
    return <div>
        <Title>
            {ModalFDialog.title}
        </Title>
        <div>
            弹出层表单，常用于数据编辑与录入。由于表单使用频率较高，所以由 Dialog 中放入 Form 组件组合而成，弹窗对应的确定按钮会触发表单的校验与提交事件（校验通过）
            <DocImg name={"light/component/fdialog/0.png"} text="模态框下的第1个" />
            <Detail list={details.ModalFDialog} />
        </div>
    </div>
}
ModalFDialog.title = "表单弹窗 FDialog"

const ModalDialog = () => {
    return <div>
        <Title>
            {ModalDialog.title}
        </Title>
        <div>
            弹窗
            <DocImg name={"light/component/dialog/0.png"} text="模态框下的第2个" />
            <Detail list={details.ModalDialog} />
        </div>
    </div>
}
ModalDialog.title = "弹窗 Dialog"

const ModalFDrawer = () => {
    return <div>
        <Title>
            {ModalFDrawer.title}
        </Title>
        <div>
            同 FDialog，打开、关闭、加载中等等操作指令相同，只有名不同 $dialog {"=>"} $drawer，只有 UI 不同。
            <DocImg name={"light/component/fdrawer/0.png"} text="模态框下的第3个" />
            <Detail list={details.ModalFDrawer} />
        </div>
    </div>
}
ModalFDrawer.title = "表单侧滑抽屉 FDrawer"

const ModalDrawer = () => {
    return <div>
        <Title>
            {ModalDrawer.title}
        </Title>
        <div>
            同 Dialog，打开、关闭、加载中等等操作指令相同，只有名不同 $dialog {"=>"} $drawer，只有 UI 不同。
            <DocImg name={"light/component/drawer/0.png"} text="模态框下的第4个" />
            <Detail list={details.ModalDrawer} />
        </div>
    </div>
}
ModalDrawer.title = "侧滑抽屉 Drawer"

const ModelCreate = () => {
    return <div>
        <Title>
            {ModelCreate.title}
        </Title>
        <div>
            将现在有功能提取出来，用于当前项目的其它页面中
            <DocImg name={"light/component/drawer/0.png"} text="组件下的第6个" />
            <Detail list={details.ModelCreate} />
        </div>
    </div>
}
ModelCreate.title = "创建模块"

const ModelUse = () => {
    return <div>
        <Title>
            {ModelUse.title}
        </Title>
        <div>
            常用于列表数据展示与操作，也可以用到表单中做数据录入等等
            <DocImg name={"light/component/list/0.png"} text="组件下的第6个" />
            <Detail list={details.CmpList} />
        </div>
    </div>
}
ModelUse.title = "使用模块"

const PreviewCreate = () => {
    return <div>
        <Title>
            {PreviewCreate.title}
        </Title>
        <div>
            常用于列表数据展示与操作，也可以用到表单中做数据录入等等
            <DocImg name={"light/component/list/0.png"} text="组件下的第6个" />
            <Detail list={details.CmpList} />
        </div>
    </div>
}
PreviewCreate.title = "创建预定义"

const PreviewUse = () => {
    return <div>
        <Title>
            {PreviewUse.title}
        </Title>
        <div>
            常用于列表数据展示与操作，也可以用到表单中做数据录入等等
            <DocImg name={"light/component/list/0.png"} text="组件下的第6个" />
            <Detail list={details.CmpList} />
        </div>
    </div>
}
PreviewUse.title = "使用预定义"

const ApiCreate = () => {
    return <div>
        <Title>
            {ApiCreate.title}
        </Title>
        <div>
            常用于列表数据展示与操作，也可以用到表单中做数据录入等等
            <DocImg name={"light/component/list/0.png"} text="组件下的第6个" />
            <Detail list={details.CmpList} />
        </div>
    </div>
}
ApiCreate.title = "创建接口"

const ApiUse = () => {
    return <div>
        <Title>
            {ApiUse.title}
        </Title>
        <div>
            常用于列表数据展示与操作，也可以用到表单中做数据录入等等
            <DocImg name={"light/component/list/0.png"} text="组件下的第6个" />
            <Detail list={details.CmpList} />
        </div>
    </div>
}
ApiUse.title = "使用接口"

export default {
    UseStart,
    UseLocal,
    ProjectConfig,
    PageCreate,
    PageMenu,
    PageRouter,
    CmpMsg,
    CmpRegion,
    CmpSearch,
    CmpForm,
    CmpFormList,
    CmpTable,
    CmpList,
    ModalFDialog,
    ModalDialog,
    ModalFDrawer,
    ModalDrawer,
    ModelCreate,
    ModelUse,
    PreviewCreate,
    PreviewUse,
    ApiCreate,
    ApiUse
}