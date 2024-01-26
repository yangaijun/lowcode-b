import Freedomen, { Region, Form } from 'freedomen'
import { render } from 'components/codeText'
import './gconfig.less'
const f =
    `//根据字段名动态控制元素的加载（权限）
import Freedomen from 'freedomen';
Freedomen.setPermission( 
    ({column, data, value}) => {
        //如，当前用户为normal时候没有编辑权限， 将要控制的编辑按钮的prop统一为 edit, 那么
        if (user.role === 'normal' && column.prop === 'edit') {
            return false
        }
        return true
    }
)

//局部性的可以用 context
import { PermissionContext } from 'freedomen'; 
<PermissionContext.Provider value={{ hasPermission({column, data, value}) => {
    //如，当前用户为normal时候没有编辑权限， 将要控制的编辑按钮的prop统一为 edit, 那么
    if (user.role === 'normal' && column.prop === 'edit') {
        return false
    }
    return true
}}} >
    <div>...</div>
</PermissionContext.Provider>
`
const ff =
    `//根据字段名动态控制元素的加载（权限）
import Freedomen from 'freedomen';
Freedomen.setDisabled( 
    ({column, data, value}) => {
        //如，当前用户不是admin，那么prop值为edit的都将失效
        return user.role !== 'admin' && column.prop === 'edit'
    }
) 

//局部性的可以用 context
import { PermissionContext } from 'freedomen'; 
<PermissionContext.Provider value={{ isDisabled({column, data, value}) => {
    //如，当前用户不是admin，那么prop值为edit的都将失效
    return user.role !== 'admin' && column.prop === 'edit'
}}} >
    <div>...</div>
</PermissionContext.Provider>
`
const f1 =
    `import Freedomen from 'freedomen';
//Freedomen.setDefaultStyles({} | () => {}) 对象或函数返回对象
Freedomen.setDefaultStyles({
    'text@red': {color: 'red'},
    'text-div@label': {
        padding: '1px 10px', backgroundColor: '#eef2ff', borderRadius: 2, borderLeft: '4px solid #5774FF'
    },
    //-g global, 全局
    '-g@t': {width: 220},
    'text-h3*': {fontWeight: 700, color: 'blue'} 
}) 
<Form  
    columns={[ 
        {type: 'text@red', value: 'text red'},
        {type: 'text-div@label', value: 'formLabel'},
        {type: 'text@red', value: 'text red', style: {fontWeight: 500}},
        {type: 'input@t', prop: 'i'},
        {type: 'date@t', prop: 'd'},
        {type: 'button@t', prop: 'b', value:'button'},
        {type: 'text-h3', prop: 'h', value: 'html h3 tag'}
    ]}
/>`
const f2 =
    `import Freedomen from 'freedomen';
//Freedomen.setDefaultClasses({} | () => {}) 对象或函数返回对象
Freedomen.setDefaultClasses({
    //import style from './index.module.less'
    //style.blueText
    'text@classblue': 'blueText'
})
<Form  
    columns={[ 
        {type: 'text@classblue', value: 'from class config'} 
    ]}
/>`
const f3 =
    `import Freedomen from 'freedomen';
//Freedomen.setDefaultConfigs({} | () => {}) 对象或函数返回对象，此处使用函数是因为user.getToken()未登录时是null，返回要使用函数返回实时取最新的
Freedomen.setDefaultConfigs(() => {
    return {
        //将type为button的添加 shape="round" 属性（这里key同对应antd组件的属性）
        'button@round': {
            shape: 'round'
        },
        //将所有以@small结尾的添加 size="small" 属性
        '-g@small': {
            size: 'small'
        },
        //所以以 upload 开头的类型（上传）组件添加对应属性
        'upload*': {
            action: \`http://127.0.0.1/upload\`,
            headers: {
                token: 'your token', //user.getToken()
            },
            onSuccess(res) => res,
            filter({value}) => \`preUrl/$\{value}\`
        }
    }
})
<Form  
    columns={[ 
        {type: 'button@round', prop: 'b', value: 'button'},
        {type: 'button-primary@small', prop: 'b2', value: 'button2'},
        {type: 'input@small', prop: 'i'},
        {type: 'upload', prop: 'u1'},
        {type: 'upload-avatar', prop: 'u2'}
    ]}
/>`
Freedomen.setDefaultStyles({
    'text@red': { color: 'red' },
    'text-div@label': {
        padding: '1px 10px', backgroundColor: '#eef2ff', borderRadius: 2, borderLeft: '4px solid #5774FF'
    },
    //-g global, 全局
    '-g@t': { width: 220 },
    'text-h3*': { fontWeight: 700, color: 'blue' }
})
Freedomen.setDefaultClasses({
    //import style from './index.module.less'
    //style.blueText
    'text@classblue': 'blueText'
})
Freedomen.setDefaultConfigs({
    'button@round': {
        shape: 'round'
    },
    '-g@small': {
        size: 'small'
    },
    'upload*': {
        action: `https://www.mocky.io/v2/5cc8019d300000980a055e76`,
        headers: {
            token: 'your token',
        }
    }
})

export default function DGconfig() {
    return <div >
        <Region
            data={{
                f, ff, f1, f2, f3
            }}
            columns={[
                { type: 'text-div@title', value: '全局配置' },
                { type: 'text-b', value: "注意，全局配置的调用时机应该在对应使用到的页面渲染之前", style: { color: 'red' } },
                [
                    { type: 'text', value: '全局的元素级权限（显示）控制' },
                    { type: 'divider@form' },
                    { prop: 'f', render, config: { activeKey: "1" } },
                    { type: 'card@form', value: '权限控制配置' }
                ],
                [
                    { type: 'text', value: '全局的元素级失效（disabled）控制' },
                    { type: 'divider@form' },
                    { prop: 'ff', render, config: { activeKey: "1" } },
                    { type: 'card@form', value: '失效控制配置' }
                ],
                {
                    render: () => <div className="fdoc-tip">
                        全局可以配置元素,容器的 style, class, config三种属性，使用组件使用时，附带对应配置。 <br />
                        type + @ + 自定义名 : {"{ ...对应配置 }"}, 单个属性配置，比如text@title(标题), input@table(在表格中input的配置) <br />
                        -g + @ + 自定义名 : {"{ ...对应配置 }"}, 所有属性配置，单独'-g'表示所有 <br />
                        type + * : 同一类配置, 如：upload*， button*, 将原始标签名附带属性 <br />
                        多个可以用英文 , 分割："input,select,update*": {"{ ...对应配置 }"} <br />
                        优先级： 全局 &lt; [class(样式) &lt;] 局部 <br />
                        <strong>特别的：</strong> type + @w + number 可以直接用于控制宽度，如input@w220 === style: {"{width: 200}"}
                    </div>
                },
                [
                    {
                        render() {
                            return <Form
                                columns={[
                                    { type: 'text@red', value: 'text red' },
                                    { type: 'text-div@label', value: 'formLabel' },
                                    { type: 'text@red', value: 'text red', style: { fontWeight: 500 } },
                                    { type: 'input@t', prop: 'i' },
                                    { type: 'date@t', prop: 'd' },
                                    { type: 'button@t', prop: 'b', value: 'button' },
                                    { type: 'text-h3', prop: 'h', value: 'html h3 tag' }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f1', render, config: { activeKey: "1" } },
                    { type: 'card@form', value: '1. style 配置' }
                ], [
                    {
                        render() {
                            return <Form
                                columns={[
                                    { type: 'text@classblue', value: 'from class config' }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f2', render, config: { activeKey: "1" } },
                    { type: 'card@form', value: '2. class 配置' }
                ], [
                    {
                        render() {
                            return <Form
                                columns={[
                                    { type: 'button@round', prop: 'b', value: 'button' },
                                    { type: 'button-primary@small', prop: 'b2', value: 'button2' },
                                    { type: 'input@small', prop: 'i' },
                                    { type: 'upload', prop: 'u1' },
                                    { type: 'upload-avatar', prop: 'u2' }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f3', render, config: { activeKey: "1" } },
                    { type: 'card@form', value: '3. config 配置' }
                ]
            ]}
        />
        <div className="fdoc-tip" >
            <strong>提示：</strong>
            全局配置要引入在入口文件中，三种配置可以起同种名称clearPremission、clearDisabled、clearDefaultStyles、clearDefaultClasses、clearDefaultConfigs传入set时的原对象可以清除所定义
        </div>
    </div>
}