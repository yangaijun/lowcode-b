import { Timeline } from 'antd'
import styles from './index.module.less'
import classnames from 'classnames'

export default function Log() {
    return <div className={classnames(styles.main)}>
        <h1 className={styles.title}>
            日志信息
        </h1>
        <Timeline
            mode="left"
            items={[
                {
                    children: <div>
                        <div className={styles.date}>2024-01-15</div>
                        支持复杂表头，放开 localStorage 等
                        <p>
                            支持复杂表头，添加只可以放在表格中的新容器 TableColGroup，用于表头分组（以前本地项目需要使用，请更新 freedomen 版本 {">"}= 3.1.0）
                        </p>
                        <p>
                            开放 localStorage，挂载到 $ls 变量上，具体请查看设计器文档的内置函数
                        </p>
                        <p>
                            Search 组件的元素添加默认样式 margin-bottom: 12px;
                        </p>
                    </div>
                },
                {
                    color: 'gray',
                    children: <div>
                        <div className={styles.date}>2023-12-25</div>
                        功能优化与升级
                        <p>
                            代码编辑器有些情况报错bug
                        </p>
                        <p>
                            预览的报错提示和系统提示分开
                        </p>
                        <p>
                            预览项目权限、token 配置等按项目隔离 
                        </p>
                    </div>
                },
                {
                    color: 'gray',
                    children: <div>
                        <div className={styles.date}>2023-11-10</div>
                        功能优化与升级
                        <p>
                            富文本支持直接粘贴图片
                        </p>
                    </div>
                },
                {
                    color: 'gray',
                    children: <div>
                        <div className={styles.date}>2023-10-20</div>
                        功能优化与升级
                        <p>
                            修改AI智能生成时，约束校验等
                        </p>
                        <p>
                            添加问题反馈功能
                        </p>
                        <p>
                            添加新元素 Alert、Segmented
                        </p>
                    </div>
                },
                {
                    color: 'gray',
                    children: <div>
                        <div className={styles.date}>2023-10-16</div>
                        功能优化
                        <p>
                            自动生成数据多时，自动变换布局，表格自动加宽度可滚动等
                        </p>
                    </div>
                },
                {

                    children: <div>
                        <div className={styles.date}>2023-09-26</div>
                        功能扩展
                        <p>
                            添加全局可配置失效函数与局部失效控制 Context
                        </p>
                    </div>
                },
                {
                    color: 'gray',
                    children: <div>
                        <div className={styles.date}>2023-09-22</div>
                        使用优化
                        <p>
                            系统操作使用上以及 UI 优化
                        </p>
                        <p>
                            组件面板监听键盘过滤出对应组件
                        </p>
                    </div>
                },
                {
                    color: 'gray',
                    children: <div>
                        <div className={styles.date}>2023-06-13</div>
                        模块功能大优化等
                        <p>
                            模块分为系统预定义、自定义
                        </p>
                        <p>
                            创建模块时，自动提取变量、函数、引用、影响、接口等抽像出可变化为变量模版
                        </p>
                        <p>
                            模块拖拽可以排序，但有组的始终在最上面
                        </p>
                        <p>
                            使用模块时根据变量模版自动创建变量、函数、引用、影响、接口等
                        </p>
                        <p>
                            模块相关使用文档修改
                        </p>
                    </div>
                },
                {
                    color: 'gray',
                    children: <div>
                        <div className={styles.date}>2023-05-30</div>
                        预定义添加 ref 的创建，显示优化等
                        <p>
                            设计器中预定义添加 ref 的创建、编辑
                        </p>
                        <p>
                            预定义、service 等添加更多显示信息
                        </p>
                    </div>
                },
                {
                    color: 'gray',
                    children: <div>
                        <div className={styles.date}>2023-05-25</div>
                        utils添加新方法，自定义上传组件修复等
                        <p>
                            utils添加让整页面 Loading 方法 setPageLoading(loading = true)
                        </p>
                        <p>
                            自定义上传组件中自定义属性方案设置数据不对应修复
                        </p>
                    </div>
                },
                {
                    color: 'gray',
                    children: <div>
                        <div className={styles.date}>2023-05-12</div>
                        添加菜单权限功能，可以根据不同角色分菜单权限，小窗口预览等
                        <p>
                            设计器文档中添加相关使用方法介绍
                        </p>
                        <p>
                            在设计时即可以小窗口方式实时预览，以及其拖拽、放大、缩小、隐藏等功能
                        </p>
                    </div>
                },
                {
                    color: 'gray',
                    children: <div>
                        <div className={styles.date}>2023-05-08</div>
                        右击组件添加到模块功能升级等
                        <p>
                            右击组件添加到模块功能可以包含当前页面的接口，其它页面使用时会自动创建
                        </p>
                        <p>
                            右击组件可以替换组件
                        </p>
                    </div>
                },
                {
                    color: 'gray',
                    children: <div>
                        <div className={styles.date}>2023-05-04</div>
                        页面母版设计功能升级
                        <p>
                            添加变量模型定义功能，用来统一替换变化属性，不用再去各个方法中寻找
                        </p>
                    </div>
                }
            ]}
        />
    </div>
}