import { Region } from 'freedomen'
import styles from '../index.module.less'

export default function VideoExample() {
    return <div>
        <Region
            columns={[
                { type: 'text-div@title', value: "小游戏运营后台" },
                {
                    type: 'text',
                    className: 'des',
                    value: <>
                        非常小的一个游戏配置后台，通过这个小系统可以非常快速了解开发全流程，完成的项目示例预览：<a href='https://light2f.com/#/preview?projectId=229&mpId=208' target="_blank">小游戏运营后台</a> 
                    </>
                }
            ]}
        />
        <div className={styles.videoCard}>
            <a href="https://www.bilibili.com/video/BV1io4y1B7QP/?vd_source=1e1650f55b82f75a3fb7b84b195b50a8" target="_blank">
                小游戏运营后台实战（Bibibili 视频观看地址）
            </a>
        </div>

        <Region
            columns={[
                { type: 'text-div@title', value: "智慧园区管理系统" },
                {
                    type: 'text',
                    className: 'des',
                    value: <>
                        仿的 git 上开源系统，大概 <b>70</b> 多页面，完成的项目示例预览：<a href='https://light2f.com/#/preview?projectId=200&mpId=213' target="_blank">园区管理系统</a>，
                        对应开源仓库：<a href='https://gitee.com/fcba_zzm/ics-park' target="_blank">地址</a>
                    </>
                }
            ]}
        />
        <div className={styles.videoCard}>
            video building
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: "新零售/网店/商城后台" },
                {
                    type: 'text',
                    className: 'des',
                    value: <>
                        仿的 git 上 start 很多的开源系统 <b>mall-admin-web</b>，完成的项目示例预览：<a href='https://light2f.com/#/preview?projectId=219&mpId=190' target="_blank">新零售商城后台</a>，
                        对应开源仓库：<a href='https://gitee.com/macrozheng/mall-admin-web' target="_blank">地址</a>
                    </>
                }
            ]}
        />
        <div className={styles.videoCard}>
            <a href="https://www.bilibili.com/video/BV1K54y1T7k3/?vd_source=1e1650f55b82f75a3fb7b84b195b50a8" target="_blank">
                mall-admin-web 系统实战一（Bibibili 视频观看地址）
            </a>
        </div>
    </div>
}