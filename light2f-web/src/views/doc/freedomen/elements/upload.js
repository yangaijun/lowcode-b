import { Region, Table, Form } from 'freedomen'
import { render, renderCode } from 'components/codeText'
import { Popover } from 'antd';
import ToAntdDoc from '../components/toAntdDoc';

const f1 =
    `//上传的接口，此处使用了代理，所以非全路径， 将以 /lightApi 开头代理到对应服务器
const action = \`/lightApi/User/upload\` 

return <Form
    data={{
        upload1: [{uuid: 'img.png', name: '20211115172825.png'}], 
        upload2: 'img.png', 
        upload3: [
            'img.png', 
            'img2.png'
        ] 
    }}
    onSubmit={data => {
        console.log(data)
    }}
    columns={[
        { type: 'upload-primary', prop: 'upload0', config: {
                action,
                //返回的是个object，没有相应接口，假设res : {uuid: '', name: 'pic.png'}/[res, res, res]
                onSuccess(res) {
                    return res
                },
                text: '主色按钮',
                //那么这里可以直接读取value的uuid, 当前value可能为 undefined
                filter: ({ value }) => \`https://flightdoc-1256372626.cos.ap-nanjing.myqcloud.com/$\{value?.uuid}\`
        }},
        { type: 'upload', prop: 'upload1', config: {
            action,
            //返回的可以是any/any[]，没有相应接口，假设res : {uuid: '', name: 'pic.png'}/[res, res, res], 这个示例用object描述图片信息
            onSuccess(res) {
                return res
            },
            //那么这里可以直接读取value的uuid, 当前value可能为 undefined
            filter:({value}) => \`https://flightdoc-1256372626.cos.ap-nanjing.myqcloud.com/$\{value?.uuid}\`
        }},
        //一张图片
        { type: 'upload-img', prop: 'upload2', config: {
            action,
            //返回的数据是个uuid key， 这个示例用uuid表示图片
            onSuccess: (res) => res,
            filter: ({ value }) => \`https://flightdoc-1256372626.cos.ap-nanjing.myqcloud.com/$\{value}\`
        }},
        //图片列表
        { type: 'upload-imgs', prop: 'upload3', config: {
            action,
            //返回的数据是个uuid key， 如果是如张上传，也可以返回的是数组, res/[res,res,res]
            onSuccess: (res) => res, //或者[res], 防止多张一起上传，返回的是数组
            filter: ({ value }) =>\`https://flightdoc-1256372626.cos.ap-nanjing.myqcloud.com/$\{value}\`
        }},
        //拖拽上传
        { type: 'upload-dragger', prop: 'upload4', config: {
            action,
            onSuccess: (res) => res,
            //那么这里可以直接读取value
            filter:({value}) => \`https://flightdoc-1256372626.cos.ap-nanjing.myqcloud.com/$\{value}\`
        }},
        { type: 'button-primary', value: '打开console，点击提交可以看当前域数据', prop: '$submit' }
    ]}
/>`

export default function DUpload() {
    return <div >
        <Region
            data={{
                use: `type: 'upload'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'Upload 上传' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            const action = `/lightApi/User/upload`

                            return <Form
                                data={{
                                    upload1: [{ uuid: 'img.png', name: '20211115172825.png' }],
                                    upload2: 'img.png',
                                    upload3: ['img.png', 'img2.png']
                                }}
                                onSubmit={data => {
                                    console.log(data)
                                }}
                                columns={[
                                    {
                                        type: 'upload-primary', prop: 'upload0', config: {
                                            action,
                                            //返回的是个object，没有相应接口，假设res : {uuid: '', name: 'pic.png'}/[res, res, res]
                                            onSuccess(res) {
                                                return res
                                            },
                                            text: '主色按钮',
                                            //那么这里可以直接读取value的uuid, 当前value可能为 undefined
                                            filter: ({ value }) => `https://flightdoc-1256372626.cos.ap-nanjing.myqcloud.com/${value?.uuid}`
                                        }
                                    },
                                    {
                                        type: 'upload', prop: 'upload1', config: {
                                            action,
                                            //返回的是个object，没有相应接口，假设res : {uuid: '', name: 'pic.png'}/[res, res, res]
                                            onSuccess(res) {
                                                return res
                                            },
                                            //那么这里可以直接读取value的uuid, 当前value可能为 undefined
                                            filter: ({ value }) => `https://flightdoc-1256372626.cos.ap-nanjing.myqcloud.com/${value?.uuid}`
                                        }
                                    },
                                    //一张图片
                                    {
                                        type: 'upload-img', prop: 'upload2', config: {
                                            action,
                                            //返回的数据是个uuid key
                                            onSuccess: (res) => res,
                                            filter: ({ value }) => `https://flightdoc-1256372626.cos.ap-nanjing.myqcloud.com/${value}`
                                        }
                                    },
                                    //图片列表
                                    {
                                        type: 'upload-imgs', prop: 'upload3', config: {
                                            action,
                                            //返回的数据是个uuid key， 如果是如张上传，也可以返回的是数组, res/[res,res,res]
                                            onSuccess: (res) => [res],
                                            filter: ({ value }) => `https://flightdoc-1256372626.cos.ap-nanjing.myqcloud.com/${value}`
                                        }
                                    },
                                    //拖拽上传
                                    {
                                        type: 'upload-dragger', prop: 'upload4', config: {
                                            action,
                                            onSuccess: (res) => res,
                                            filter: ({ value }) => `https://flightdoc-1256372626.cos.ap-nanjing.myqcloud.com/${value?.uuid}`
                                        }
                                    },
                                    { type: 'button-primary', value: '打开console, 点击提交可以看当前域数据', prop: '$submit' }
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f1', render },
                    { type: 'card@form', value: '1. 基本使用' }
                ]
            ]}
        />
        <div className="fdoc-tip">
            <strong>提示：</strong> onSuccess 结合 filter 使用，onSuccess:处理服务端返回的数据， filter：对显示的路径进行修改
        </div>
        <Region
            columns={[
                { type: 'text-div@title', value: 'Upload props' },
                {
                    render() {
                        return <Table
                            data={[
                                { prop: 'type', des: '类型', type: 'Enum: upload/-primary/-img/-imgs/-dragger' },
                                {
                                    prop: 'value', des: '值', type: 'img:any，其他：any[]', detail: <div>
                                        any: response返回的结构
                                    </div>
                                }, 
                                { prop: 'style', des: '样式', type: 'Object/({value, data}) => Object/void 0' },
                                { prop: 'className', des: 'react className', type: 'String / ({value, data}) => String' },
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
                                { prop: 'action', des: '上传的路径', type: 'String' },
                                { prop: 'filter', des: 'value 二次处理，返回可访问完全路径', type: 'string/({value, data}) => string' },
                                { prop: 'onSuccess', des: '对服务器返回数据处理', type: '(res) => res.value(返回需要的结果)' },
                                { prop: 'onError', des: '对服务器异常处理', type: '(res) => message.error(res.msg) 如异常提示' },
                                { prop: 'fileexts', des: '可以上传的文件后缀名[txt,png,jpg,mp4, ...]', type: 'String/Array' },
                                { prop: 'filetypes', des: '文件类型[image/png, video/mp4]', type: 'String/Array' },
                                { prop: 'filesize', des: '可以上传文件大小单位M', type: 'number' },
                                { prop: 'maxcount', des: '上传文件最大数量', type: 'number' },
                                { prop: 'text', des: 'type 为 upload/-primary 时按钮的提示文字', type: 'ReactNode' },
                                { prop: 'content', des: '更改触发上传内容, 如upload，是个button', type: 'ReactNode' },
                                { prop: '...', des: <ToAntdDoc text={'antd 其他 Upload 配置'} name="upload" />, type: '...' },
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