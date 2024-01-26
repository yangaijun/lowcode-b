import React, { useState, useEffect } from 'react';
import { Divider, FloatButton } from "antd";
import classnames from 'classnames';
import './index.less';

export default function FreedomenDocLayout(props) {
    const { location: { pathname = '' } } = props.history
    const [activity, setActivity] = useState(pathname.substring(1))

    useEffect(() => {
        setActivity(pathname)
    }, [pathname])

    const getLi = (name, text) => {
        const path = `/doc/freedomen/${name}`
        return <li key={name} className={classnames({ 'freedomen-doc-activity': activity === path })} onClick={_ => {
            if (activity !== path) {
                setActivity(name)
                props.history.push(`/doc/freedomen/${name}`)
            }
        }}>{text}</li>
    }
    return <div style={{ display: 'flex', minWidth: 1240 }}>
        <div className="freedomen-doc-left" >
            <ul style={{ paddingTop: 12 }}>
                {getLi('introduce', '简介')}
                <div className="title">示例</div>
                <Divider style={{ margin: '12px 0 4px 0' }} />
                {
                    [
                        { name: 'curd', text: '通用页面' }
                    ].map((el) => getLi(el.name, el.text))
                }
                <div className="title">组件</div>
                <Divider style={{ margin: '12px 0 4px 0' }} />
                {
                    [
                        { name: 'region', text: 'Region 域' },
                        { name: 'list', text: 'List 列表' },
                        { name: 'form', text: 'Form 表单' },
                        { name: 'search', text: 'Search 查询' },
                        { name: 'table', text: 'Table 表格' },
                        { name: 'dialog', text: 'Dialog 弹窗' },
                        { name: 'drawer', text: 'Drawer 抽屉' }
                    ].map((el) => getLi(el.name, el.text))
                }
                <div className="title">元素</div>
                <Divider style={{ margin: '12px 0 4px 0' }} />
                {
                    [
                        { name: 'autocomplete', text: 'AutoComplete 自动完成' },
                        { name: 'text', text: 'Text 文本' },
                        { name: 'button', text: 'Button 按钮' },
                        { name: 'input', text: 'Input 输入框' },
                        { name: 'select', text: 'Select 下拉选择' },
                        { name: 'segmented', text: 'Segmented 分段控制器' },
                        { name: 'mentions', text: 'Mentions 提及' },
                        { name: 'dropdown', text: 'Dropdown 下拉菜单' },
                        { name: 'date', text: 'Date 日期' },
                        { name: 'daterange', text: 'DateRange 日期范围' },
                        { name: 'timepicker', text: 'TimePicker 时间' },
                        { name: 'timerange', text: 'TimeRange 时间范围' },
                        { name: 'counter', text: 'InputNumber 计数器' },
                        { name: 'checkboxs', text: 'Checkboxs 多选' },
                        { name: 'radios', text: 'Radios 单选组' },
                        { name: 'rate', text: 'Rate 评分' },
                        { name: 'slider', text: 'Slider  滑动条' },
                        { name: 'progress', text: 'Progress 进度条' },
                        { name: 'steps', text: 'Steps 步骤条' },
                        { name: 'switch', text: 'Switch 开关' },
                        { name: 'cascader', text: 'Cascader 级联' },
                        { name: 'divider', text: 'Divider分割线' },
                        { name: 'alert', text: 'Alert 警告提示' },
                        { name: 'avatar', text: 'Avatar 头像' },
                        { name: 'img', text: 'Img 图片' },
                        { name: 'image', text: 'Image 图片' },
                        { name: 'tag', text: 'Tag 标签' },
                        { name: 'tags', text: 'Tags 标签组' },
                        { name: 'tree', text: 'Tree 树' },
                        { name: 'treeselect', text: 'TreeSelect 下拉树' },
                        { name: 'upload', text: 'Upload 上传' }
                    ].map(el => getLi(el.name, el.text))
                }
                <div className="title">容器</div>
                <Divider style={{ margin: '12px 0 4px 0' }} />
                {
                    [
                        { name: 'affix', text: 'Affix 固定' },
                        { name: 'formitem', text: 'FormItem 表单行' },
                        { name: 'div', text: 'Div' },
                        { name: 'card', text: 'Card 卡片' },
                        { name: 'inputgroup', text: 'InputGroup 组合' },
                        { name: 'spin', text: 'Spin 加载中' },
                        { name: 'col', text: 'Col 列' },
                        { name: 'row', text: 'Row 行' },
                        { name: 'space', text: 'Space 分割' },
                        { name: 'tooltip', text: 'Tooltip 提示' },
                        { name: 'popconfirm', text: 'Popconfirm 起泡确认' },
                        { name: 'fragment', text: 'Fragment' }
                    ].map(el => getLi(el.name, el.text))
                }
                <div className="title">其他</div>
                <Divider style={{ margin: '12px 0 4px 0' }} />
                {
                    [
                        { name: 'exele', text: '自定义元素/容器(render)' },
                        { name: 'eregister', text: '注册事件/校验' },
                        { name: 'gconfig', text: '预配置' },
                        { name: 'types', text: '类型' }
                    ].map(el => getLi(el.name, el.text))
                }
            </ul>
        </div>
        <div className='freedomen-doc-center'>
            <FloatButton.BackTop />
            {props.children}
        </div>
    </div>
} 
