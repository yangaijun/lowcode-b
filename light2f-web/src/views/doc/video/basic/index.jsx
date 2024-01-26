import { Space } from 'antd'
import { Region } from 'freedomen'
import styles from '../index.module.less'

export default function VideoBasic() {
    return <div>
        <Region
            columns={[
                { type: 'text-div@title', value: "组件用法" },
                {
                    type: 'text',
                    className: 'des',
                    value: <>
                        快速了解组件的用法，以可视化方式让效率开发飞起来，完成的示例项目请查看 <b>开发示例</b> 下的 <a href='https://light2f.com/#/preview?projectId=226&mpId=212' target="_blank">全场景覆盖</a> 的功能
                    </>
                }
            ]}
        />
        <div className={styles.videoCard}>
            <Space direction="vertical">
                <a href="https://www.bilibili.com/video/BV1Uv4y1j7or/?vd_source=1e1650f55b82f75a3fb7b84b195b50a8" target="_blank">
                    组件用法一（Bibibili 视频观看地址）
                </a>
                <a href="https://www.bilibili.com/video/BV1Rb411f7fz/?vd_source=1e1650f55b82f75a3fb7b84b195b50a8" target="_blank">
                    组件用法二（Bibibili 视频观看地址）
                </a>
            </Space>
        </div>

        <Region
            columns={[
                { type: 'text-div@title', value: "母版" },
                {
                    type: 'text',
                    className: 'des',
                    value: <>工欲善其事必先利其器，能够学会抽象母版即使是非常定制化的项目也能够事半功倍，是项目高效开发方式中必不可少的一步。<br />
                        实际开发时我们可以复制系统赠送的修改成自己项目的风格即可，因为处理逻辑一般是不变的，大可不必从头开发。<br />
                        当然，我们是教程，为了加强大家理解，所以是从 <b>零</b> 创建的完整示例。
                    </>
                }
            ]}
        />
        <div className={styles.videoCard}>
            <a href="https://www.bilibili.com/video/BV1FX4y1S71k/?vd_source=1e1650f55b82f75a3fb7b84b195b50a8" target="_blank">
                项目与页面母版（Bibibili 视频观看地址）
            </a>
        </div>

        <Region
            columns={[
                { type: 'text-div@title', value: "自定义组件到平台" },
                {
                    type: 'text',
                    className: 'des',
                    value: "开发功能型组件到平台，能够让更多人使用，使系统组件库更丰富而可以完成更加复杂的项目"
                }
            ]}
        />
        <div className={styles.videoCard}>
            video building
        </div>

        <Region
            columns={[
                { type: 'text-div@title', value: "本地运行扩展与维护" },
                {
                    type: 'text',
                    className: 'des',
                    value: "不怕一万，就怕万一真的需要扩展什么功能怎么办？没关系，react开发者并不需要学习成本，看一下如何搞定"
                }
            ]}
        />
        <div className={styles.videoCard}>
            video building
        </div>

        <Region
            columns={[
                { type: 'text-div@title', value: "在本地已有项目中使用" },
                {
                    type: 'text',
                    className: 'des',
                    value: "如果我们本地已经有个手动开发的 react 项目，有些页面比较太简单或复杂，迟迟不想下手，那我们看看如何使用 light2f 无缝接入"
                }
            ]}
        />
        <div className={styles.videoCard}>
            video building
        </div>
    </div>
}