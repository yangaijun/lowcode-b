import { Region, Form, Table, Dialog } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover, Button } from 'antd';
const f1 =
    `<Dialog name="dialog" title={'text'}>
    text
</Dialog>
<Button onClick={_ => Dialog.open('dialog')}>打开弹窗</Button>`
const f2 =
    `const getForm = (formData) => {
    return <Form 
        data={formData}
        onSubmit={data => {
            console.log(data)
            Dialog.close('dialog')
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

<Dialog name="dialog" footer={null}/> 
<Button type="primary" style={{marginRight: 10}} onClick={_ => {
    Dialog.open('dialog', {title: '添加用户'})
        .then(setBody => setBody(getForm()))
}}>新增用户</Button>
<Button onClick={_ => {
    Dialog.open('dialog', {title: '修改用户'})
    .then(setBody => setBody(getForm({username: 'modify', password: '123456'})))
}}>修改用户</Button>`
const f3 =
    `const getForm = (formData) => {
    return <Form  
        data={formData}
        onSubmit={data => {
            console.log(data)
            Dialog.loading('dialog2')
            setTimeout(() => {
                Dialog.close('dialog2')
            }, 1000);
        }} 
        columns={[
            {type: 'input', label: '用户名', prop: 'username', rule: {'must': '请输入用户名'}},
            {type: 'input-password', label: '密码', prop: 'password', rule: {'must': '请输入密码'}}
        ]}
    />
}
<Dialog name="dialog" title={"dialog footer 确定提交"} /> 
<Button type="primary" onClick={_ => {
    Dialog.open('dialog').then(s => s(getForm()))
}}>打开弹窗</Button>
`
export default function DDialog() {
    return <div>
        <Dialog name="dialog" />
        <Dialog name="dialog1" title={'text'}>
            text
        </Dialog>
        <Dialog name="dialog2" title={"dialog footer 确定提交"} />

        <Region
            data={{
                use: `imoprt { Dialog } from 'freedomen'`, f1, f2, f3
            }}
            columns={[
                { type: 'text-div@title', value: 'Dialog 弹窗' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Button onClick={_ => Dialog.open('dialog1')}>打开弹窗</Button>
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f1', render },
                    { type: 'card@form', value: '1. 基本弹窗' }
                ],
                [
                    {
                        render() {
                            const getForm = (formData) => {
                                return <Form
                                    data={formData}
                                    onSubmit={data => {
                                        console.log(data)
                                        Dialog.close('dialog')
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
                                    Dialog.open('dialog', { title: '添加用户', footer: null })
                                        .then(setBody => setBody(getForm()))
                                }}>新增用户</Button>
                                <Button onClick={_ => {
                                    Dialog.open('dialog', { title: '修改用户', footer: null })
                                        .then(setBody => setBody(getForm({ username: 'modify', password: '123456' })))
                                }}>修改用户</Button>
                            </>
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f2', render },
                    { type: 'card@form', value: '2. 结合表单' }
                ], [
                    {
                        render() {
                            const getForm = (formData) => {
                                return <Form
                                    data={formData}
                                    onSubmit={data => {
                                        console.log(data)
                                        Dialog.loading('dialog2')
                                        setTimeout(() => {
                                            Dialog.close('dialog2')
                                        }, 1000);
                                    }}
                                    columns={[
                                        { type: 'input', label: '用户名', prop: 'username', rule: { 'must': '请输入用户名' } },
                                        { type: 'input-password', label: '密码', prop: 'password', rule: { 'must': '请输入密码' } }
                                    ]}
                                />
                            }
                            return <Button type="primary" onClick={_ => {
                                Dialog.open('dialog2').then(s => s(getForm()))
                            }}>打开弹窗</Button>
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f3', render },
                    { type: 'card@form', value: '3. 弹窗提交表单' }
                ], [
                    {
                        render() {
                            const getForm = (formData) => {
                                return <Form
                                    data={formData}
                                    onSubmit={data => {
                                        console.log(data)
                                        Dialog.close('dialog2')
                                    }}
                                    key={(new Date()).valueOf()}
                                    columns={[
                                        { type: 'input', label: '用户名', prop: 'username', rule: { 'must': '请输入用户名' } },
                                        { type: 'input-password', label: '密码', prop: 'password', rule: { 'must': '请输入密码' } }
                                    ]}
                                />
                            }
                            return <Button type="primary" onClick={_ => {
                                Dialog.open('dialog2').then(s => s(getForm()))
                            }}>打开弹窗</Button>
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f3', render },
                    { type: 'card@form', value: '4. 弹窗提交表单' }
                ]
            ]}
        />
        <div className="fdoc-tip">
            <strong>提示：</strong>Dialog 方法可以直接打开或关闭对应name的dialog, Dialog.open('name', props?: string(title) | ModalProps ), Dialog.close('name') <br />
            Dialog.open('name', props: Object).then(setBody =&gt; setBody(ReactNode)) 打开后可以重新更新内容，适合更新小ReactNode, <br />
            Dialog.loading('name'[, true/false]), 可以直接使提交按钮loading或者取消loading，缺省为使loading, 如果Dialog的子元素(children)只有Form, 确定按键将会触发提交
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Dialog props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'name', des: '必须的，表单名, 用于打开关闭', type: 'String' },
                                { prop: 'noForm', des: '没有form,让弹窗不寻找表单', type: 'Boolean', defaultValue: 'false' },
                                { prop: 'title', des: '标题', type: 'String' },
                                { prop: 'width', des: '宽度', type: 'Number', defaultValue: '520' },
                                { prop: 'footer', des: '脚', type: 'ReactNode' },
                                { prop: 'okText', des: '确定文本', type: 'String' },
                                { prop: 'cancelText', des: '取消文本', type: 'String' },
                                {
                                    prop: 'onOk', des: '确定事件', type: '() => void || false',
                                    detail: <div>
                                        缺省的点击会关闭Dialog， return false 可以阻止关闭
                                    </div>
                                },
                                {
                                    prop: 'onCancel', des: '取消事件', type: '() => void || false',
                                    detail: <div>
                                        缺省的点击会关闭Dialog， return false 可以阻止关闭
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
            以及其它 antd Modal 属性
        </div>
    </div>
}