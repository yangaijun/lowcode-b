import { Region, Table, Form } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToOptions from '../components/toOptions';
import ToAntdDoc from '../components/toAntdDoc';
const f1 =
    `const options = [{value: 1, label: '选项1'}, {value: 2, label: '选项2'}, {value: 3, label: '选项3'}]
return <Form  
    columns={[ 
        {type: 'select', prop: 'select1', options: options},
        {type: 'select-multiple', prop: 'select2', options: options},
        {type: 'select-multiple', placeholder: '最多选两个', prop: 'select3', options: options, config: {maxcount: 2}}
    ]}
/>`
const f2 =
    `<Form 
    onEvent={params => {
        console.log(params)
    }} 
    columns={[ 
        {type: 'select', prop: 'select1', options: [
            {userName: '五一', id: 1, other: '其它信息'},
            {userName: '琴二', id: 2, other: 'message'}
        ], config: {labelname: 'userName', valuename: 'id'}},

        {type: 'select', prop: 'select2', options: [
            {userName: '五一', id: 1, other: '其它信息'},
            {userName: '琴二', id: 2, other: 'message'},
            {userName: '朋二', id: 3, other: 'see you'}
        ], config: {labelname: 'userName', valuename: 'id', optionvalue: true}},
        //异步
        {type: 'select', prop: 'select3', value: 1, options({resolve}) {
            const options = [
                {name: '五一', id: 1, departmentName: '信息部', phoneNumber: 18888886665}, 
                {name: '琴二', id: 2, phoneNumber: 18888886665, departmentName: '市场部'}
            ].map(el => {
                return {
                    label: el.name,
                    value: el.id,
                    option: <div style={{display: 'flex', alignItems: 'center'}}>
                        <span>ICON</span>
                        <div style={{marginLeft: 10}}>
                            <b>
                                {el.name}({el.departmentName})
                            </b>
                            <div>
                            {el.phoneNumber}
                            </div>
                        </div>
                    </div>
                }
            })
            resolve(options)
        }}     
    ]}
/>`
export default function DSelect() {
    return <div >
        <Region
            data={{
                use: `type: 'select'`, f1, f2
            }}
            columns={[
                { type: 'text-div@title', value: 'Select 下拉选择' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            const options = [{ value: 1, label: '选项1' }, { value: 2, label: '选项2' }, { value: 3, label: '选项3' }]
                            return <Form
                                columns={[
                                    { type: 'select', prop: 'select1', options: options },
                                    { type: 'select-multiple', prop: 'select2', options: options },
                                    { type: 'select-multiple', placeholder: '最多选两个', prop: 'select3', options: options, config: { maxcount: 2 } }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f1', render },
                    { type: 'card@form', value: '1. 基本使用' }
                ],
                [
                    {
                        render() {
                            return <Form
                                onEvent={params => {
                                    console.log(params)
                                }}
                                columns={[
                                    {
                                        type: 'select', prop: 'select1', options: [
                                            { userName: '五一', id: 1, other: '其它信息' },
                                            { userName: '琴二', id: 2, other: 'message' }
                                        ], config: { labelname: 'userName', valuename: 'id' }
                                    },

                                    {
                                        type: 'select', prop: 'select2', options: [
                                            { userName: '五一', id: 1, other: '其它信息' },
                                            { userName: '琴二', id: 2, other: 'message' },
                                            { userName: '朋二', id: 3, other: 'see you' }
                                        ], config: { labelname: 'userName', valuename: 'id', optionvalue: true }
                                    },

                                    {
                                        type: 'select', prop: 'select3', value: 1, options({ resolve }) {
                                            const options = [
                                                { name: '五一', id: 1, departmentName: '信息部', phoneNumber: 18888886665 },
                                                { name: '琴二', id: 2, phoneNumber: 18888886665, departmentName: '市场部' }
                                            ].map(el => {
                                                return {
                                                    label: el.name,
                                                    value: el.id,
                                                    option: <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <span>ICON</span>
                                                        <div style={{ marginLeft: 10 }}>
                                                            <b>
                                                                {el.name}({el.departmentName})
                                                            </b>
                                                            <div>
                                                                {el.phoneNumber}
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            })
                                            resolve(options)
                                        }
                                    }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f2', render },
                    { type: 'card@form', value: '2. 不一样的options' }
                ]
            ]}
        />
        <div className="fdoc-tip">
            <strong>提示：</strong> config中labelname 和 valuename, 可以改变对应label,value使用的名称哦, 而 optionvalue可以让选中的值直接为option对象哦
        </div>

        <Region
            columns={[
                { type: 'text-div@title', value: 'Select props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: select/-mutiple' },
                                { prop: 'value', des: '值', type: 'String/Number/Array(mutiple类型)', defaultValue: '' },
                                { prop: 'options', des: '选项', type: <ToOptions />, defaultValue: '[]' },
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
                                { prop: 'disabled', des: '是否禁用', type: 'Boolean / ({value, data}) => Boolean', defaultValue: 'false' },
                                { prop: 'config', des: 'antd 其他 Select 选项配置， key: value', type: 'Object' }
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
                },
                { type: 'text-div@title', value: 'Config 附加参数' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'labelname', des: '显示的label对应变量名, default: label', type: 'String' },
                                { prop: 'valuename', des: '值对应的变量名, default: value', type: 'String' },
                                { prop: 'optionvalue', des: '将选中的值设置为option对象', type: 'true/false' },
                                { prop: 'filterable', des: '是否可以打字搜索', type: 'true/false' },
                                { prop: 'debounceWait', des: 'options为函数时，防抖等待时间(default: 280ms)', type: 'number' },
                                { prop: 'maxcount', des: '当type为multiple时，设最多选择数量', type: 'Number' },
                                { prop: '...', des: <ToAntdDoc text={'antd 其他 Select 配置'} name="select" />, type: '...' },
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
                                }
                            ]}
                        />
                    }
                }
            ]}
        />
    </div>
}