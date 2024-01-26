import { useState, useEffect } from 'react';
import { Divider, FloatButton } from "antd";
import classnames from 'classnames';
import './index.less';
const style = { margin: '4px 0 4px 0' }

export default function LightDocLayout(props) {
    const { location: { pathname = '' } } = props.history
    const [activity, setActivity] = useState(pathname.substring(1))

    useEffect(() => {
        setActivity(pathname)
    }, [pathname])

    const getLi = (name, text) => {
        const path = `/doc/light/${name}`

        return <li key={name} className={classnames({ 'light-doc-activity': activity === path })} onClick={_ => {
            if (activity !== path) {
                setActivity(name)
                props.history.push(`/doc/light/${name}`)
            }
        }}>{text}</li>
    }

    return <div style={{ display: 'flex' }} >
        <div className="light-doc-left" >
            <ul style={{ paddingTop: 12 }}>
                {getLi('introduce', '简介')}
                <div className="title">快速使用</div>
                <Divider style={style} />
                {
                    [
                        { name: 'project', text: '项目管理' },
                        { name: 'tool', text: '工作台' },
                        { name: 'masterplate-project', text: '项目母版' },
                        { name: 'masterplate-page', text: '页面母版' }
                    ].map((el) => getLi(el.name, el.text))
                }
                <Divider style={style} />
                {
                    [
                        { name: 'component', text: '组件' },
                        { name: 'code', text: '预定义' },
                        { name: 'api', text: '接口' },
                        { name: 'model', text: '模块' },
                        { name: 'fapi', text: '内置函数' }
                    ].map((el) => getLi(el.name, el.text))
                }
                <div className="title">组件</div>
                <Divider style={style} />
                {
                    [
                        { name: 'c/region', text: 'Region 域' },
                        { name: 'c/search', text: 'Search 查询' },
                        { name: 'c/form', text: 'Form 表单' },
                        { name: 'c/formlist', text: 'FormList 表单列表' },
                        { name: 'c/table', text: 'Table 表格' },
                        { name: 'c/list', text: 'List 列表' },
                        { name: 'c/dialog', text: 'Dialog 弹窗' },
                        { name: 'c/drawer', text: 'Drawer 侧滑窗' }
                    ].map((el) => getLi(el.name, el.text))
                }
                <div className="title">其它</div>
                <Divider style={style} />
                {
                    [
                        { name: 'permission', text: '权限' },
                        { name: 'page', text: '小试牛刀' }
                    ].map((el) => getLi(el.name, el.text))
                }
            </ul>
        </div>
        <div className='light-doc-center'>
            <FloatButton.BackTop />
            {props.children}
        </div>
    </div>
}
