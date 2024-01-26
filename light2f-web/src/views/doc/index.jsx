import styles from './index.module.less'

export default function Doc() {
    return <div className={styles.main}>
        <div className={styles.content}>
            <div className="label2">
                系统简介
            </div>
            <div className="doc-content">
                Light2f 是中后台类纯前端的可视化低代码平台，能够在线开发完整的项目 
                系统主要分为两部分：设计器与 Freedomen，设计器是可视化开发工具，功能包括创建变量useState、函数useCallback、引用useRef、影响useEffect， 模块功能
                而 Freedomen 中是开发工具转为代码的依赖
            </div>
        </div>
    </div>
}