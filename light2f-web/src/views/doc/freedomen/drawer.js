import { Region, Form, Table, Drawer } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover, Button } from 'antd';
const f1 =
    `<Drawer name="drawer1" title={'text'}>
    text
</Drawer> 
<Button onClick={_ => Drawer.open('drawer1')}>打开</Button>`
const f2 =
    `const getForm = (formData) => {
    return <Form 
        data={formData}
        onSubmit={data => {
            console.log(data)
            Drawer.close('dialog')
        }} 
        columns={[
            {type: 'input', label: '用户名', prop: 'username', rule: {'must': '请输入用户名'}},
            {type: 'input-password', label: '密码', prop: 'password', rule: {'must': '请输入密码'}},
            [
                {type: 'button-primary', value: formData ? '修改' : '添加', prop: '$submit', config: {shape: 'round'}, style: {width: 180}},
                {type: 'div', style: {display: 'flex', justifyContent: 'center'}}
            ]
        ]}
    />
}
<Drawer name="drawer" extra={null} width={500}/>
<Button type="primary" style={{ marginRight: 10 }} onClick={_ => {
    Drawer.open('drawer', { title: '添加用户' })
        .then(setBody => setBody(getForm()))
}}>新增用户</Button>
<Button onClick={_ => {
    Drawer.open('drawer', { title: '修改用户' })
        .then(setBody => setBody(getForm({ username: 'modify', password: '123456' })))
}}>修改用户</Button>`

export default function DDrawer() {
    return <div>
        <Drawer name="drawer" width={500} extra={null} />
        <Drawer name="drawer1" title={'text'}>
            text
        </Drawer>
        <Region
            data={{
                use: `imoprt { Drawer } from 'freedomen'`, f1, f2
            }}
            columns={[
                { type: 'text-div@title', value: 'Drawer 抽屉' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Button onClick={_ => Drawer.open('drawer1')}>打开</Button>
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f1', render },
                    { type: 'card@form', value: '1. 基本用法' }
                ],
                [
                    {
                        render() {
                            const getForm = (formData) => {
                                return <Form
                                    data={formData}
                                    onSubmit={data => {
                                        console.log(data)
                                        Drawer.close('drawer')
                                    }}
                                    columns={[
                                        { type: 'input', label: '用户名', prop: 'username', rule: { 'must': '请输入用户名' } },
                                        { type: 'input-password', label: '密码', prop: 'password', rule: { 'must': '请输入密码' } },
                                        [
                                            { type: 'button-primary', value: formData ? '修改' : '添加', prop: '$submit', config: { shape: 'round' }, style: { width: 180 } },
                                            { type: 'div', style: { display: 'flex', justifyContent: 'center' } }
                                        ]
                                    ]}
                                />
                            }
                            return <>
                                <Button type="primary" style={{ marginRight: 10 }} onClick={_ => {
                                    Drawer.open('drawer', { title: '添加用户' })
                                        .then(setBody => setBody(getForm()))
                                }}>新增用户</Button>
                                <Button onClick={_ => {
                                    Drawer.open('drawer', { title: '修改用户' })
                                        .then(setBody => setBody(getForm({ username: 'modify', password: '123456' })))
                                }}>修改用户</Button>
                            </>
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f2', render },
                    { type: 'card@form', value: '2. 结合表单' }
                ]
            ]}
        />
        <div className="fdoc-tip">
            <strong>提示：</strong>Drawer使用与Diglog相同
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Drawer props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'name', des: '必须的，表单名, 用于打开关闭', type: 'String' },
                                { prop: 'noForm', des: '没有form,让弹窗不寻找表单', type: 'Boolean', defaultValue: 'false'  },
                                { prop: 'title', des: '标题', type: 'String' },
                                { prop: 'width', des: '宽度', type: 'Number', defaultValue: '520'  },
                                { prop: 'footer', des: '脚', type: 'ReactNode' },
                                { prop: 'extra', des: '右头', type: 'ReactNode' },
                                { prop: 'okText', des: '确定文本', type: 'String' },
                                { prop: 'cancelText', des: '取消文本', type: 'String' },
                                {
                                    prop: 'onOk', des: '确定事件', type: '() => void || false',
                                    detail: <div>
                                        缺省的点击会关闭Drawer， return false 可以阻止关闭
                                    </div>
                                },
                                {
                                    prop: 'onCancel', des: '取消事件', type: '() => void || false',
                                    detail: <div>
                                        缺省的点击会关闭Drawer， return false 可以阻止关闭
                                    </div>
                                },
                            ]}
                            pagination={false}
                            columns={[
                                { label: '参数', prop: 'prop' },
                                { label: '说明', prop: 'des' },
                                {
                                    label: '类型', prop: 'type', render({ value, data }) {
                                        if (data.detail)
                                            return <Popover content={data.detail}>
                                                {value}
                                            </Popover>
                                        else return value
                                    }
                                },
                                { label: '默认值', prop: 'defaultValue' }
                            ]}
                        />
                    }
                }
            ]}
        />
        <div className="fdoc-tip">
            以及其它 antd Drawer 属性
        </div>
    </div>
}