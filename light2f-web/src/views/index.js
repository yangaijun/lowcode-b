import { PlayCircleOutlined } from '@ant-design/icons'
import { Button, Card, Divider, Image, Space, Statistic } from 'antd'
import { AntdURL } from 'libs/contants'
import { toExample, toProject } from 'libs/utils'
import styles from './index.module.less'
import ApiUser from 'services/user'
import { useEffect, useState } from 'react'

function UrlCard({ url, time, text }) {
    return <Card hoverable className={styles.card} onClick={() => window.open("https://www.bilibili.com/video/" + url, "_blank")}>
        <div className={styles.time}>{time}</div>
        <div className={styles.text}>
            {text}
        </div>
    </Card>
}

function IImage({ name, text, width = 280, height = 150 }) {
    return <div className={styles.imgWrapper}>
        <Image width={width} height={height} src={`https://flightdoc-1256372626.cos.ap-nanjing.myqcloud.com/home/${name}`} />
        {text}
    </div>
}

export default function Index() {
    const [count, setCount] = useState()

    useEffect(() => {
        ApiUser.count().then(res => {
            setCount(res)
        })
    }, [])

    return (
        <div className={styles.main}>
            <div className={styles.title}>
                Light To Freedomen
            </div>
            <div className={styles.des}>
                <div>
                    Light To Freedomen（light 2 f）是在线开发 toB 类纯前端功能的可视化工具 <br />
                    在线开发定制化富交互类中后台系统的前端功能（SPA 应用）时时生成项目源代码，一键即可下载到本地运行部署 <br />
                    面向开发者的工具型低代码，真 · 辅助开发效率 2000% 的提升<br />
                    定制化代码生成无缝接入任意数据结构与服务端语言，灵活多变，可以超轻松开发定制化业务系统 <br />
                </div>
            </div>
            <p style={{ fontSize: 12 }}>
                经实测，您可以使用平台定制各类运营后台（商城、进销存、CMS、CRM、ERP 等），日均 20 + 页面，若以 CRUD (80+%)为主可以达到 100 + 页面，让你的项目比人更快一步抢占市场（平台不生成服务端代码，需自行提供）
            </p>
            {count &&
                <Card className={styles.count}>
                    <Space size={230}>
                        <Statistic title="用户" value={count.userCount} />
                        <Statistic title="项目下载" value={count.downCount} />
                        <Statistic title="已创建项目" value={count.projectCount} />
                        <Statistic title="已创建页面" value={count.pageCount} />
                    </Space>
                </Card>}

            <div className={styles.label}>
                相关帖子
            </div>
            <div className={styles.post}>
                <ul>
                    <li>
                        <a href='https://juejin.cn/post/7312722825139814439'>
                            功能介绍
                        </a>
                    </li>
                    <li>
                        <a href='https://juejin.cn/post/7278119481364840488'>
                            提效设计介绍
                        </a>
                    </li>
                    <li>
                        <a href='https://juejin.cn/post/7275943802938343464'>
                            让后台人员一键拥有自己系统的管理平台前端功能
                        </a>
                    </li>
                </ul>
            </div>
            <div className={styles.label}>
                提效方案
            </div>
            <div>
                第一步：根据创建表的 sql 文件自动生成基本增删改查功能的（没有则创建空项目）初始系统
                <div className={styles.imgs}>
                    <Image.PreviewGroup>
                        <IImage name="struct.png" text={"数据结构"} />
                        <IImage name="design.png" text={"设计器"} />
                        <IImage name="preview.png" text={"预览页"} />
                        <IImage name="code.png" text={"代码"} />
                    </Image.PreviewGroup>
                </div>
                第二步：当然，基本的 CURD 并不能解决什么问题，所以需在基础上修改或开发定制化的功能，并继续添加设计定制化页面，直至完成
                <div className={styles.imgs}>
                    <Image.PreviewGroup>
                        <IImage name="diy.gif" width={450} height={240} text={"基础上添加审批功能"} />
                        <IImage name="lg_form.gif" width={450} height={240} text={"自由组合设计任意复杂页面"} />
                    </Image.PreviewGroup>
                </div>
                第三步：下载项目本地运行 & 测试 & 发布，打包发布
            </div>
            <div className={styles.label}>
                功能介绍
            </div>
            <Space wrap>
                <UrlCard text="系统功能的全量介绍" time="28:16" url={"BV12u4y1b7Xb/?vd_source=1e1650f55b82f75a3fb7b84b195b50a8"} />
            </Space>
            <div className={styles.label}>
                组件使用
            </div>
            <Space wrap>
                <UrlCard text="Region 的使用（重要），布局、联动、数据收集、事件处理" time="13:49" url={"BV1jF411C7Jz/?vd_source=1e1650f55b82f75a3fb7b84b195b50a8"} />
                <UrlCard text="Search 查询的使用" time="05:11" url={"BV1km4y1H7bA/?vd_source=1e1650f55b82f75a3fb7b84b195b50a8"} />
                <UrlCard text="Form 表单的使用" time="14:53" url={"BV1WN411B718/?vd_source=1e1650f55b82f75a3fb7b84b195b50a8"} />
                <UrlCard text="Table 表格的使用" time="17:53" url={"BV1N94y1z7rA/?vd_source=1e1650f55b82f75a3fb7b84b195b50a8"} />
                <UrlCard text="List 列表的使用" time="03:56" url={"BV1Rr4y197pW/?vd_source=1e1650f55b82f75a3fb7b84b195b50a8"} />
                <UrlCard text="模态框的使用" time="10:21" url={"BV19u4y1Q7y1/?vd_source=1e1650f55b82f75a3fb7b84b195b50a8"} />
                <UrlCard text="内置函数与全局配置" time="24:03" url={"BV1gG411Z7FQ/?vd_source=1e1650f55b82f75a3fb7b84b195b50a8"} />
                <UrlCard text="上传自定义组件到系统" time="14:52" url={"BV16w41187Du/?vd_source=1e1650f55b82f75a3fb7b84b195b50a8"} />
            </Space>
            <div className={styles.label}>
                开发提效
            </div>
            <Space wrap>
                <UrlCard text="通过页面母版，实现自定义项目生成" time="20:52" url={"BV1SQ4y1H7jv/?vd_source=1e1650f55b82f75a3fb7b84b195b50a8"} />
                <UrlCard text="巧用页面母版，减少重复劳动" time="11:02" url={"BV19c411R7wr/?vd_source=1e1650f55b82f75a3fb7b84b195b50a8"} />
            </Space>
            <div className={styles.label}>
                项目实战
            </div>
            <Space wrap>
                <UrlCard text="从零实现一套完整的仓库管理系统全过程（包含前端与后端）" time="64:22" url={"BV1Vw411t7x8/?vd_source=1e1650f55b82f75a3fb7b84b195b50a8"} />
                <UrlCard text="ERP中复杂的定制化页面实战" time="47:01" url={"BV1eC4y1m71Z/?vd_source=1e1650f55b82f75a3fb7b84b195b50a8"} />
                <UrlCard text="定制化商城后台实战一" time="65:18" url={"BV1cc411X7LH/?vd_source=1e1650f55b82f75a3fb7b84b195b50a8"} />
                <UrlCard text="定制化商城后台实战二" time="22:30" url={"BV1bc411S7F9/?vd_source=1e1650f55b82f75a3fb7b84b195b50a8"} />
            </Space>
            <Divider />
            <Space className={styles.btns} size={88} split={<Divider type="vertical" />}>
                {/* <Button className={styles.bt} size="large" onClick={() => {
                    history.push('/doc/video/example')
                }}> 更多开发项目视频 </Button> */}
                <Button type='primary' size="large" ghost onClick={toExample} className={styles.bt}> 查看项目示例 </Button>
                <Button type="primary" size="large" onClick={toProject} className={styles.bt} icon={<PlayCircleOutlined />} > 立即尝试 </Button>
            </Space>
            {/* <p style={{ fontSize: 10, color: '#ccc' }}>
                有定制项目需求可添加微信： qiiwowiip， 备注：Light2f
            </p> */}
            <div className={styles.footer}>
                <Space size={20} className={styles.left}>
                    <a href="https://react.dev" target="_blank" rel="noopener noreferrer">ReactJs</a>
                    <a href={AntdURL} target="_blank" rel="noopener noreferrer">Ant Design</a>
                    <a href="mailto:light2f@163.com">
                        E-MAIL：light2f@163.com
                    </a>
                    <div>
                        QQ 群：539848770
                    </div>
                </Space>
                <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">苏ICP备2022034398号-1</a>
            </div>
        </div>
    )
}