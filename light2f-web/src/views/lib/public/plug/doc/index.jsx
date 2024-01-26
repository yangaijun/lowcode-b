import { Button, Divider, Image, Space } from 'antd'
import { TencentURL } from 'libs/contants'
import styles from './index.module.less'

function Code(props) {
    return <code className='code-npm'>{props.children}</code>
}

function DocImg({ name, des }) {
    return <div className={styles.imgWrapper}>
        <Image src={TencentURL + name + '.png'} width={480}  />
        <div className='des'> {des} </div>
    </div>
}

export default function PlugDoc() {
    return <div className={styles.main}>
        <div className={styles.title}>
            如何创建自定义组件
        </div>
        <div className={styles.des}>
            系统基础组件不能满足复杂业务时，或需编写自定义<Code>react</Code>组件来解决复杂业务。可以点击已有的公共组件详情，<Code>查看配置</Code>与<Code>代码预览</Code>作为示例
        </div>
        <div className={styles.stepTitle}>
            第一步
        </div>
        <Divider className={styles.line} />
        <div className={styles.content}>
            先<Button type='link' href='https://flightmodel-1256372626.cos.ap-shanghai.myqcloud.com/f-custom-component.zip' size='small'>下载模版脚手架</Button>，用开发工具(如：VS Code)打开下载并且解压后的文件夹，（请先安装react开发环境，node 12+）
            然后安装依赖: <Code>npm i</Code>；再执行<Code>npm start</Code>即可启动项目
        </div>
        <DocImg name="自定义组件_首页" des="项目启动后，是个测试页面，而待测试的组件为 null (如图)" />

        <div className={styles.stepTitle}>
            第二步
        </div>
        <Divider className={styles.line} />
        <div className={styles.content}>
            打开<Code>src/component/index.jsx</Code>自定义组件的入口文件即可开发。如果不用此入口需要修改<Code>webpack.config.js</Code> 文件，将<Code>entry.index</Code>属性修改成对应入口文件名，并且 
            将<Code>output.path</Code> 属性的第二个参数修改成对应目录 + <Code>/dist</Code>，
            请不要在当前目录(<Code>src/component</Code>)下创建名为<Code>dist</Code>目录，因为在<Code>npm run build</Code>时候会生成此目录
            <div>在定义参数时，系统已经预先使用了一些基本定义名：</div>
            <div className='des'>
                <div>组件的值: <Code>value</Code></div>
                <div>占位符：<Code>placehoder</Code> </div>
                <div>使失效：<Code>disabled</Code> </div>
                <div>类名：<Code>className</Code> </div>
                <div>样式：<Code>style</Code></div>
                <div>值改变：<Code>onChange(newValue)</Code></div>
            </div>
            其它自定义属性请放到<Code>config</Code>中，如：定义了个<Code>max</Code>属性，那么参数应为<Code>{"config?: { max?: number }"}</Code>
        </div>
        <DocImg name="自定义组件_入口文件" des="入口文件 (如图)" />

        <div className={styles.stepTitle}>
            第三步
        </div>
        <Divider className={styles.line} />
        <div className={styles.content}>
            编码 & 测试
        </div>
        <div className={styles.stepTitle}>
            第四步
        </div>
        <Divider className={styles.line} />
        <div className={styles.content}>
            完成了编码并且经过测试成功后，那么就可以执行<Code>npm run build</Code> 来完成打包，打包成功将在<Code>component</Code>目录下生成<Code>dist</Code>目录
        </div>
        <DocImg name="自定义组件_编译" des="编译后生成 dist 文件夹 (如图)" />

        <div className={styles.stepTitle}>
            第五步
        </div>
        <Divider className={styles.line} />
        <div className={styles.content}>
            回到系统<Code>组件库 ={">"} 添加组件</Code>填写好组件信息，并将<Code>component</Code>文件夹上传到组件，并配置好参数。
            然后点击 "组件测试"，检查是否符合预期，不符合：重修改后接第四步；符合：直接点击提交即可完成
        </div>
        <Space>
            <DocImg name="自定义组件_上传" des="到系统上传页，上传component文件夹，配置参数 (如图)" />
            <DocImg name="自定义组件_测试" des="配置好参数点击 组件测试 (如图)" />
        </Space>
    </div>
}