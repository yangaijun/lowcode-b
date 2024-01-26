import { Button, Typography, Space, message, Modal, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Dialog, Form, Table } from "freedomen";
import ApiProject from "services/project";
import ApiService from "services/service";
import ApiMasterplatePage from "services/masterplate_page";
import { TypeType } from "views/light/types";
import { FdGlobalDataEditor } from "components/Editors";
import { uniqueId } from 'lodash'
import { HttpErrorData } from "libs/axios";
import { isPlainObject } from "libs/utils";

const { Text } = Typography;

const formStyle = { width: 438, border: '1px solid #dedede', background: 'white', borderRadius: 5, padding: 12 }
const me = 'me', ai = 'ai';

function getErrorText(text) {
    return <div style={{ color: 'red' }}>
        {text}
    </div>
}

export const getNextStep = (onNext, { masteplateRef, stepRef, pageRef }) => {
    const aiInfo = {}
    let currentTmp = null

    let dbInfo = {}
    let tableNameOptions = []

    const getSearch = (val) => {
        const searchValue = []
        const map = new Map()
        if (val) {
            for (let tbName of val) {
                for (let item of dbInfo[tbName]) {
                    if (item.dataType === 'varchar') {
                        searchValue.push(item)
                    }
                }
            }
        }
        return searchValue.filter((item) => !map.has(item['columnNameWithCamelCase'].toString()) && map.set(item['columnNameWithCamelCase'].toString()))
    }

    const getInsertOrUpdate = (val) => {
        const iuValue = []
        const map = new Map()
        if (val) {
            for (let tbName of val) {
                for (let item of dbInfo[tbName]) {
                    if (item.columnKey !== "PRI"
                        && !item.columnName.includes("delete")
                        && !item.columnName.includes("create")
                        && !item.columnName.includes("update")
                    ) {
                        iuValue.push(item)
                    }
                }
            }
        }
        return iuValue.filter((item) => !map.has(item['columnNameWithCamelCase'].toString()) && map.set(item['columnNameWithCamelCase'].toString()))
    }

    const getShow = (val) => {
        const showValue = []
        const map = new Map()

        if (val) {
            for (let tbName of val) {
                for (let item of dbInfo[tbName]) {
                    if (item.columnKey !== "PRI"
                        && !item.columnName.includes("id")
                        && !item.columnName.includes("delete")
                        && !item.columnName.includes("update")
                    ) {
                        showValue.push(item)
                    }
                }
            }
        }
        return showValue.filter((item) => !map.has(item['columnNameWithCamelCase'].toString()) && map.set(item['columnNameWithCamelCase'].toString()))
    }

    const pagePropOptions = ({ data, resolve, shouldUpdate }) => {
        shouldUpdate(true)

        if (data.tables) {
            const options = []
            const map = new Map()
            for (let tbName of data.tables) {
                options.push(...dbInfo[tbName])
            }
            resolve(options.filter((item) => !map.has(item['columnNameWithCamelCase'].toString()) && map.set(item['columnNameWithCamelCase'].toString())))
        } else {
            resolve([])
        }
    }

    const config = {
        labelname: 'columnNameWithCamelCase',
        valuename: 'columnNameWithCamelCase',
        optionvalue: 1
    }

    const configPage = [
        {
            type: 'ai',
            text: '我觉得应该创建这些页面，你看看对吗？',
            dom: <Form
                key={uniqueId()}
                ref={pageRef}
                onEvent={params => {
                    if (params.prop === 'append') {
                        pageRef.current?.set("table", (c) => {
                            c.push({})
                            return c
                        })
                        message.success("已添加到表格最后一行，请填写下新页面信息吧~")
                    }
                }}
                onSubmit={data => {
                    let value = data.table
                    if (Array.isArray(value)) {
                        for (let item of value) {
                            if (!item.pageName) {
                                return message.error(`第${item.$index + 1}行，页面名称不可为空着哦~`)
                            } else if ((new RegExp("[`~%!@#^=''?~！@#￥……&——‘”“'？*()（），,。.、]")).test(item.pageName)) {
                                return message.error(`第${item.$index + 1}行，页面名称不要使用特殊字符哦~`)
                            }

                            if (!item.fileName) {
                                return message.error(`第${item.$index + 1}行，文件名称不要空着吧~`)
                            } else if (!/^[A-Za-z]+$/.test(item.fileName)) {
                                return message.error(`第${item.$index + 1}行，文件名称请使用全英文的会比较好~`)
                            }
                        }
                        Modal.confirm({
                            title: '提示',
                            content: '那我可要开始动脑了哦， 我将会创建' + value.length + "张页面，稍等片刻就好！",
                            onOk() {
                                onNext([{ type: ai, text: '努力中，请稍后...' }], 9999, true)
                                ApiProject.aiGenerate({
                                    masterplateProject: aiInfo.masterplateProject,
                                    masterplatePageId: aiInfo.masterplatePage.masterplatePageId,
                                    pageId: aiInfo.masterplatePage.pageId,
                                    genInfoList: value
                                }).then(res => {
                                    onNext([], 10000, false)
                                })
                            }
                        })
                    } else {
                        message.error("没有可以生成的页面信息~")
                    }
                }}
                columns={[
                    {
                        prop: 'table',
                        render() {
                            return <Table
                                pagination={false}
                                config={{ scroll: { x: 600, y: 420 }, bordered: true }}
                                onEvent={params => {
                                    if (params.prop === 'tables') {
                                        return {
                                            ...params.row,
                                            search: getSearch(params.value),
                                            insertOrUpdate: getInsertOrUpdate(params.value),
                                            show: getShow(params.value)
                                        }
                                    }
                                }}
                                columns={[
                                    { label: '行', filter: ({ data }) => data.$index + 1, width: 50, config: { fixed: "left" } },
                                    { type: 'input', label: '页面名称', prop: 'pageName', width: 150, config: { fixed: "left" } },
                                    { type: 'input@140', prop: 'fileName', label: '文件名', width: 150, config: { fixed: "left" } },
                                    { type: 'select-multiple@w180', prop: 'tables', label: '关联的表', options: tableNameOptions, width: 200, config: { fixed: "left" } },
                                    { type: 'select-multiple@w300', prop: 'search', label: '查询字段', options: pagePropOptions, width: 320, config },
                                    { type: 'select-multiple@w300', prop: 'insertOrUpdate', label: '添加或编辑字段', options: pagePropOptions, width: 320, config },
                                    { type: 'select-multiple@w300', prop: 'show', label: '要显示在表格的字段', options: pagePropOptions, width: 320, config },
                                    { type: 'text-a', label: '操作', prop: '$delete-confirm', value: '删除', width: 70, config: { fixed: "right" } }
                                ]}
                            />
                        }
                    },
                    [
                        { type: 'button', prop: 'append', value: '再添加个新页面' },
                        { type: 'button-primary', prop: '$submit', value: '可以了，开始吧！' },
                        { type: 'space', style: { marginTop: 12 } }
                    ]
                ]}
            />
        },
    ]

    const templateYes = [
        { type: me, text: '我配置好了，可以开始你的表演了' },
        { type: ai, text: '好的，请稍等，分析数据库结构中~' }
    ]

    const templateFormDom = <Form
        key={uniqueId()}
        onSubmit={data => {
            //校验
            try {
                const pre = (new Function("return " + currentTmp))()
                const temp = (new Function("return " + data.masterplatePageTmp))()

                if (isPlainObject(pre) && isPlainObject(temp)) {
                    if (!Object.keys(pre).every(k => Object.keys(temp).includes(k))) {
                        Modal.confirm({
                            width: 680,
                            title: "提示",
                            content: <>
                                <div>请不要修改 key 名，模板取不到对应 key 字段名会出错</div>
                                <div>正确：你的需要的当前页参数名为：pageNum，那么修改为 pageNo: 'pageNum'</div>
                                <div style={{ color: 'red' }}>错误：将 key (pageNo)也修改 pageNum: 'pageNum'</div>
                            </>
                        })
                        return
                    }
                }
            } catch (error) {
                Modal.confirm({
                    title: "错误",
                    content: "数据结构无法解析为对象，请检查"
                })
                return
            }

            if (onNext(templateYes, 8, true)) {
                Promise.all([
                    ApiService.insertOrUpdates(data.services),
                    ApiMasterplatePage.insertOrUpdate({
                        "masterplatePageTmp": data.masterplatePageTmp,
                        "masterplatePageId": data.masterplatePageId,
                    })
                ])
                const callApi = aiInfo.uid
                    ? ApiProject.aiGetDbInfoByUid(aiInfo.uid)
                    : ApiProject.aiGetDbInfo(aiInfo.db)

                callApi.then(res => {
                    dbInfo = res
                    tableNameOptions = Object.keys(res).map(n => {
                        return { label: n, value: n }
                    })
                    onNext(configPage, 9, false)
                    setTimeout(() => {
                        const tableData = []
                        const pattern = new RegExp("[`~%!@#^=''?~！@#￥……&——‘”“'？*()（），,。.、]")
                        for (let key in res) {
                            const value = res[key]
                            tableData.push({
                                pageName: (value[0].tableComment || key).replace(pattern, ""),
                                tables: [key],
                                search: getSearch([key]),
                                insertOrUpdate: getInsertOrUpdate([key]),
                                fileName: value[0].tableNameWithoutUnderline,
                                show: getShow([key])
                            })
                        }
                        pageRef.current?.set('table', tableData)
                    });
                })
            }
        }}
        config={{ layout: 'vertical' }}
        ref={masteplateRef}
        style={{ ...formStyle, width: 700, paddingBottom: 0 }}
        columns={[
            {
                prop: 'services',
                label: "接口访问路径",
                render() {
                    return <Table
                        pagination={false}
                        columns={[
                            { type: 'input@w180', label: '注释', width: 200, prop: 'serviceComment', placeholder: '注释' },
                            { type: 'select@w100', label: 'Method', width: 120, value: 'post', prop: 'serviceMethod', options: 'get,post,put,delete' },
                            { type: 'input@w280', label: '路径', prop: 'serviceUrl', placeholder: '如 page/select' },
                        ]}
                    />
                },
                config: {
                    help: <>和我预想的不一样，<Button size="small" type="link" onClick={() => {
                        Dialog.open("useServiceDialog")
                    }}>我该如何配置？</Button></>
                }
            },
            { label: '参数变量', render: FdGlobalDataEditor, prop: 'masterplatePageTmp', config: { help: <span style={{ color: 'red' }}>*注意不要修改 key 名、修改值即可，模板取不到对应key字段名会出错</span> } },
            { type: 'button-primary', prop: '$submit', value: '行，这样可以了' },
        ]}
    />

    const setTemplate = [
        {
            type: ai,
            text: '创建成功啦~'
        },
        {
            type: ai,
            text: '你看一下这里的服务端参数与返回数据的参数名是否要重新配置一下',
            dom: templateFormDom
        }
    ]

    const setChooseTemplate = [
        {
            type: me,
            text: "我选择好了~"
        },
        {
            type: ai,
            text: '好的，你看一下这里的服务端的接口路径、接口参数与接口返回数据的参数名是否要重新配置一下。',
            dom: templateFormDom
        }
    ]

    const autoCreateYes = [
        { type: me, text: '行' },
        { type: ai, text: '好的，请稍等~' }
    ]

    const editPromise = (masterplatePage) => {
        Promise.all([
            ApiMasterplatePage.selectById(masterplatePage.masterplatePageId),
            ApiService.select({ pageId: masterplatePage.pageId })
        ]).then(([r1, r2]) => {
            //保存一下参数变量模板，以校验并防止有人修改 key
            currentTmp = r1.masterplatePageTmp

            masteplateRef.current?.set({
                "masterplatePageTmp": r1.masterplatePageTmp,
                "masterplatePageId": r1.masterplatePageId,
                services: r2
            })

            onNext([], 7, false)
        })
    }

    const autoCreatePagePlate = [
        {
            type: ai,
            text: '没有发现有可用的页面母版，是否自动创建并使用呢？',
            dom: <Space>
                <Button danger onClick={() => {
                    message.error("那你无情的把对话框关了吧！")
                }}>不，我自己去创建，结束此次会话吧</Button>
                <Button type="primary" onClick={() => {
                    if (onNext(autoCreateYes, 5, true)) {
                        //创建完成了
                        ApiMasterplatePage.aiCopy().then(res => {
                            aiInfo.masterplatePage = res
                            onNext(setTemplate, 6)
                            editPromise(res)
                        })
                    }

                }}>我觉得可以，就这么办</Button>
            </Space>
        }
    ]

    const selectPagePlate = [
        {
            type: ai,
            text: '找到了可用的页面母版，请选择一个来用于页面生成。',
            dom: <Form
                key={uniqueId()}
                onSubmit={data => {
                    if (onNext(setChooseTemplate, 5, true)) {
                        aiInfo.masterplatePage = data.masterplatePage
                        editPromise(data.masterplatePage)
                    }
                }}
                style={formStyle}
                columns={[
                    {
                        type: 'select',
                        placeholder: '请选择',
                        prop: 'masterplatePage',
                        options({ resolve }) {
                            ApiMasterplatePage.selectSelf().then(res => {
                                resolve(res?.filter(el => el.masterplatePageType !== TypeType.system))
                            })
                        },
                        rule: 'must',
                        config: { labelname: 'masterplatePageName', valuename: 'masterplatePageId', optionvalue: 1 }
                    },
                    { type: 'button-primary', prop: '$submit', value: '确定' },
                ]}
            />
        }
    ]
    //查询页面母版
    const searchPagePlate = [
        {
            type: me,
            text: '好了'
        },
        {
            type: ai,
            text: '好的，请稍等，现在正在查询当前可用的页面母版~',
        }
    ]
    //拒绝接入接口
    const no2 = [
        {
            type: me,
            text: '暂时没有接口，请继续',
        }, {
            type: ai,
            text: "好的，随后你可以编辑项目母版的配置来添加~"
        }
    ]
    //接口对接
    const api = [
        { type: ai, text: '正确的，没有发现问题~' },
        {
            type: ai,
            text: '请问是否需要对接接口呢 ? 请输入一下接口的基本路径吧!',
            dom: <Form
                key={uniqueId()}
                onEvent={params => {
                    if (params.prop === 'no') {
                        if (onNext(no2, 3, true)) {
                            ApiMasterplatePage.selectSelf().then(res => {
                                if (res?.filter(el => el.masterplatePageType !== TypeType.system)?.length) {
                                    onNext(selectPagePlate, 4, false)
                                } else {
                                    onNext(autoCreatePagePlate, 4, false)
                                }
                            })
                        }
                    }
                }}
                onSubmit={data => {
                    if (onNext(searchPagePlate, 3, true)) {
                        aiInfo.masterplateProject = data
                        //查找项目母版，
                        ApiMasterplatePage.selectSelf().then(res => {
                            if (res?.filter(el => el.masterplatePageType !== TypeType.system)?.length) {
                                onNext(selectPagePlate, 4, false)
                            } else {
                                onNext(autoCreatePagePlate, 4, false)
                            }
                        })
                    }
                }}
                style={formStyle}
                columns={[
                    { type: 'input', placeholder: '输入基地址，如：http://localhost:8080/serviceName', prop: 'masterplateProjectBaseUrl', rule: 'must' },
                    [
                        { type: 'button', prop: 'no', value: '暂时不用，谢谢', config: { danger: true } },
                        { type: 'button-primary', prop: '$submit', value: '确定' },
                        { type: 'space' }
                    ]
                ]}
            />
        }
    ]
    const connectScheme = {
        type: ai,
        text: <> 当然，请先确保您的数据库是允许我访问的，可以先登录数据库做如下配置，结束此次会话可以再将权限收回去，示例:
            <div style={{ background: '#fafafa', padding: 8 }}>
                1. 设用户 root 任意主机能访问<br />
                <Text code>mysql{">"} update mysql.user set host = '%' where user = 'root';</Text><br />
                2. 应用更改<br />
                <Text code>mysql{">"} flush privileges;</Text> <br />
            </div>
            或者也可以导出数据库结构，选择 <b>数据库结构导入</b> 选项上传给我也可以哦，不过请注意一下创建表语句的格式:
            <Typography.Paragraph>
                <pre>以 CREATE TABLE 开头 + [表达式，可忽略] + `表名`（``必要） + ( + \n + `字段名`（``必要）...</pre>
            </Typography.Paragraph>
        </>,
        dom: <Form
            key={uniqueId()}
            onEvent={params => {
                if (params.prop === 'no') {
                    onNext(no1, 1)
                } else if (params.prop === 'upload' && onNext(sqlYes, 1, true)) {
                    ApiProject.aiUploadSql(params.row.sql[0]).then(res => {
                        if (res === HttpErrorData) {
                            onNext(sqlError, 2, false)
                            stepRef.current = 0
                        } else {
                            aiInfo.uid = res
                            onNext(api, 2, false)
                        }
                    })
                }
            }}
            onSubmit={data => {
                if (onNext(schemeYes, 1, true)) {
                    ApiProject.aiTestDBConnect(data).then(res => {
                        if (res) {
                            //保存信息
                            aiInfo.db = data

                            onNext(api, 2, false)
                        } else {
                            onNext(schemeError, 2, false)
                            stepRef.current = 0
                        }
                    })
                }
            }}
            // data={{ databaseUrl: '101.34.63.4:3306/l2ftest', databaseUsername: 'l2ftest', databasePassword: 'fZGFH6saDGyYtbt4' }}
            style={formStyle}
            columns={[
                { type: 'radios-button', prop: '_type', options: { db: '数据库连接', 'struct': '数据库结构导入' }, value: 'db', config: { buttonStyle: "solid" } },
                [
                    { type: 'input', placeholder: '如：111.111.111.111:3306/name', prop: 'databaseUrl', rule: 'must' },
                    { type: 'input', placeholder: '输入登录用户名', prop: 'databaseUsername', rule: 'must' },
                    { type: 'input-password', placeholder: '输入登录密码', prop: 'databasePassword', rule: 'must' },
                    [
                        { type: 'button', prop: 'no', value: '不，我没有，我不需要', config: { danger: true } },
                        { type: 'button-primary', prop: '$submit', value: '确定' },
                        { type: 'space' }
                    ],
                    { type: 'fragment', load: ({ data }) => data._type !== 'struct' }
                ],
                [
                    {
                        prop: 'sql',
                        label: "",
                        render({ value = [], $base: { onChange } }) {
                            return <Upload
                                type="drag"
                                accept=".sql"
                                fileList={value}
                                onRemove={() => { onChange(null) }}
                                beforeUpload={(file) => {
                                    if (file.size > 5 * 1000 * 1000) {
                                        message.error("请不要上传超过 5M 的文件")
                                        return false
                                    }
                                    onChange([file])
                                    return false
                                }}>
                                <UploadOutlined />
                                <div style={{ color: 'rgba(0,0,0,.45)', marginTop: 5 }}>
                                    点击或者将小于 5M 的 .sql 文件拖拽到此区域进行上传
                                </div>
                            </Upload>
                        },
                        config: {
                            help: <>点击下载：
                                <a href="https://flightmodel-1256372626.cos.ap-shanghai.myqcloud.com/%E7%A4%BA%E4%BE%8B%E6%96%87%E4%BB%B6.sql" target="_blank" download>示例文件.sql</a>
                            </>
                        }
                    },
                    { type: 'button-primary', prop: 'upload', value: '上传并解析', disabled: ({ data }) => !data.sql },
                    { type: 'fragment', load: ({ data }) => data._type === 'struct' },
                ],

            ]}
        />
    }

    const schemeError = [
        { type: ai, text: getErrorText('连接失败了，请检查输入是否输入错误，再重试一次吧~') },
        connectScheme
    ]
    //数据库连接成功
    const schemeYes = [
        { type: me, text: '我已经输入完成了' },
        { type: ai, text: '好的，请稍等，我需要测试一下联通性~' }
    ]

    const sqlError = [
        { type: ai, text: getErrorText("解析失败或未解析到创建表语句，请检查一下sql文件再试试吧~") },
        connectScheme
    ]
    const sqlYes = [
        { type: me, text: '开始解析吧' },
        { type: ai, text: '好的，请稍等，马上就好' }
    ]
    //拒绝连接数据库
    const no1 = [
        {
            type: me,
            text: '我就不给你！',
        }, {
            type: ai,
            text: 'emm，我还在学习分析自然言语智能创建中，所以现在还帮助不了你哦，还请过些时日再与我交流吧~'
        }
    ]

    return [
        {
            type: ai,
            text: '你好，我是小呆，欢迎使用小呆智能交互式创建项目~'

        }, {
            type: ai,
            text: '是否可以给我需要的数据库地址，方便我来分析其中的字段与类型呢，你的数据库信息只在当前会话使用，我并不会去收藏，还请放心。还有我现在只能认识 mysql 哦！'
        },
        connectScheme
    ]
}