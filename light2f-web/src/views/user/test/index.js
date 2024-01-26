import { Form, Table, FormList, Region, Search, Dialog } from "freedomen"
import { useRef, useState } from "react"
import { message, Modal } from "antd"
import styles from "./index.module.less"

export default function FenBu() {
    const regionRef = useRef()
    const [regionData, setRegionData] = useState({
        step: 3,
        form2: {
            jttable: [{}],
            mjtable: [{}],
        },
        form3: {
            list: [{}],
        },
    })
    const [tableData, setTableData] = useState([
        {
            id: 1,
            name: "小蛴",
            age: 14,
            sex: "男",
        },
        {
            id: 2,
            name: "小妇",
            age: 17,
            sex: "女",
        },
        {
            id: 3,
            name: "小五",
            age: 18,
            sex: "女",
        },
    ])
    const [selection, setSelection] = useState([])
    const tableEvent = (params) => {
        if (params.prop === "$selection") {
            setSelection(params.value)
        }
    }
    return (
        <div className={"freedomen-page"}>
            <Region
                data={regionData}
                ref={regionRef}
                columns={[
                    { type: "steps", prop: "step", options: { 1: "表单1", 2: "表单2", 3: "表单3" }, disabled: true, className: styles["step"] },
                    {
                        prop: "form1",
                        load: ({ value, data }) => {
                            return data.step === 1
                        },
                        render() {
                            return (
                                <Form
                                    columns={[
                                        { type: "input", prop: "input", label: "请输入", rule: "required" },
                                        { type: "select", prop: "select", label: "请选择", options: "选项一,选项二" },
                                        { type: "button", prop: "choose", label: "数据列表", value: "请选择" },
                                        {
                                            prop: "table",
                                            rule: { "len2:": "至少选择两条数据" },
                                            config: { wrapperCol: { offset: 4 } },
                                            render() {
                                                return (
                                                    <Table
                                                        pagination={false}
                                                        columns={[
                                                            { type: "text", prop: "name", label: "名称", value: "text" },
                                                            { type: "text", prop: "sex", label: "性别", value: "text" },
                                                            { type: "text", prop: "age", label: "年龄", value: "text" },
                                                        ]}
                                                    />
                                                )
                                            },
                                        },
                                        [
                                            [
                                                { type: "button", prop: "$reset", value: "重置" },
                                                { type: "button-primary", prop: "$submit", value: "下一步" },
                                                { type: "space" },
                                            ],
                                            { type: "div", className: styles["div"] },
                                        ],
                                    ]}
                                    onEvent={(params) => {
                                        if (params.prop === "choose" && params.type === "click") {
                                            setSelection([])
                                            Dialog.open("cdialog", "请选择数据")
                                        } else if (params.prop === "$submit" && params.type === "click") {
                                        }
                                    }}
                                    onSubmit={(data) => {
                                        regionRef.current.set("step", 2)
                                    }}
                                />
                            )
                        },
                    },
                    {
                        prop: "form2",
                        load: ({ value, data }) => {
                            return data.step === 2
                        },
                        render() {
                            return (
                                <Form
                                    columns={[
                                        { type: "input", prop: "title", label: "标题" },
                                        [
                                            [
                                                { type: "text", value: " 新品" },
                                                { type: "switch", prop: "isnew" },
                                                { type: "text", value: "推荐" },
                                                { type: "switch", prop: "isgood" },
                                                { type: "space" },
                                            ],
                                            { type: "formitem", label: "商品推荐" },
                                        ],
                                        {
                                            type: "radios-button",
                                            prop: "type",
                                            label: "优惠方式",
                                            value: 1,
                                            options: { 1: "无特惠", 2: "特惠促销", 3: "会员价格", 4: "阶梯价格", 5: "满减价格" },
                                            config: { buttonStyle: "solid" },
                                        },
                                        [
                                            { type: "date@w200", prop: "cx.startTime", label: "开始时间", rule: "required" },
                                            { type: "date@w200", prop: "cx.endTime", label: "结束时间", rule: "required" },
                                            { type: "input@w200", prop: "cx.price", label: "促销价格", rule: "required" },
                                            {
                                                type: "fragment",
                                                load: ({ value, data }) => {
                                                    return data.type === 2
                                                },
                                            },
                                        ],
                                        [
                                            { type: "input@w200", prop: "hy.hjPrice", label: "黄金会员", rule: "required" },
                                            { type: "input@w200", prop: "hy.zsPrice", label: "钻石会员", rule: "required" },
                                            {
                                                type: "fragment",
                                                load: ({ value, data }) => {
                                                    return data.type === 3
                                                },
                                            },
                                        ],
                                        {
                                            prop: "jttable",
                                            load: ({ value, data }) => {
                                                return data.type === 4
                                            },
                                            config: { wrapperCol: { offset: 4 } },
                                            render() {
                                                return (
                                                    <Table
                                                        pagination={false}
                                                        columns={[
                                                            { type: "input", prop: "sl", label: "数量" },
                                                            { type: "input", prop: "zk", label: "折扣" },
                                                            {
                                                                label: "操作",
                                                                render() {
                                                                    return [
                                                                        { type: "text-a", prop: "del", value: "删除" },
                                                                        { type: "text-a", prop: "add", value: "添加" },
                                                                        { type: "space" },
                                                                    ]
                                                                },
                                                            },
                                                        ]}
                                                        onEvent={(params) => {
                                                            if (params.prop === "del" && params.type === "click") {
                                                                if (regionRef.current.get("form2.jttable").length <= 1) {
                                                                    message.error("留条命吧大侠！")
                                                                    return
                                                                }

                                                                regionRef.current.set("form2.jttable", (current) => {
                                                                    current.splice(params.row.$index, 1)
                                                                    return current
                                                                })
                                                            } else if (params.prop === "add" && params.type === "click") {
                                                                regionRef.current.set("form2.jttable", (current) => {
                                                                    current.push({})
                                                                    return current
                                                                })
                                                            }
                                                        }}
                                                    />
                                                )
                                            },
                                        },
                                        {
                                            prop: "mjtable",
                                            load: ({ value, data }) => {
                                                return data.type === 5
                                            },
                                            config: { wrapperCol: { offset: 4 } },
                                            render() {
                                                return (
                                                    <Table
                                                        pagination={false}
                                                        columns={[
                                                            { type: "input", prop: "m", label: "满" },
                                                            { type: "input", prop: "lj", label: "立减" },
                                                            {
                                                                label: "操作",
                                                                render() {
                                                                    return [
                                                                        {
                                                                            type: "text-a",
                                                                            prop: "del",
                                                                            value: "删除",
                                                                            filter: ({ value, data }) => {
                                                                                return value
                                                                            },
                                                                        },
                                                                        { type: "text-a", prop: "add", value: "添加" },
                                                                        { type: "space" },
                                                                    ]
                                                                },
                                                            },
                                                        ]}
                                                        onEvent={(params) => {
                                                            if (params.prop === "del" && params.type === "click") {
                                                                if (regionRef.current.get("form2.mjtable").length <= 1) {
                                                                    message.error("留条命吧大侠！")
                                                                    return
                                                                }

                                                                regionRef.current.set("form2.mjtable", (current) => {
                                                                    current.splice(params.row.$index, 1)
                                                                    return current
                                                                })
                                                            } else if (params.prop === "add" && params.type === "click") {
                                                                regionRef.current.set("form2.mjtable", (current) => {
                                                                    current.push({})
                                                                    return current
                                                                })
                                                            }
                                                        }}
                                                    />
                                                )
                                            },
                                        },
                                        [
                                            [
                                                { type: "button", prop: "$reset", value: "重置" },
                                                { type: "button", prop: "pre", value: "上一步" },
                                                { type: "button-primary", prop: "$submit", value: "下一步" },
                                                { type: "space" },
                                            ],
                                            { type: "div", className: styles["div1"] },
                                        ],
                                    ]}
                                    onEvent={(params) => {
                                        if (params.prop === "pre" && params.type === "click") {
                                            regionRef.current.set("step", 1)
                                        } else if (params.prop === "$submit" && params.type === "click") {
                                        }
                                    }}
                                    onSubmit={(data) => {
                                        regionRef.current.set("step", 3)
                                    }}
                                />
                            )
                        },
                    },
                    {
                        prop: "form3",
                        load: ({ value, data }) => {
                            return data.step === 3
                        },
                        render() {
                            return (
                                <Form
                                    columns={[
                                        { type: "input", prop: "name", label: "名称" },
                                        {
                                            prop: "list",
                                            label: "属性列表",
                                            rule: "len2:",
                                            render() {
                                                return (
                                                    <FormList
                                                        columns={[
                                                            [
                                                                [
                                                                    { type: "input", prop: "name", rule: { must: "至少要输入名称吧" } },
                                                                    { type: "select@w200", prop: "select", options: "选项一,选项二" },
                                                                    { type: "button", prop: "del", value: "删除", config: { danger: true } },
                                                                    { type: "space" },
                                                                ],
                                                                { type: "formitem" },
                                                            ],
                                                        ]}
                                                        onEvent={(params) => {
                                                            if (params.prop === "del" && params.type === "click") {
                                                                if (regionRef.current.get("form3.list").length <= 1) {
                                                                    message.error("至少要留一条吧！")
                                                                } else {
                                                                    Modal.confirm({
                                                                        content: "确定要删除此条？",
                                                                        onOk() {
                                                                            regionRef.current.set("form3.list", (current) => {
                                                                                current.splice(params.row.$index, 1)
                                                                                return current
                                                                            })
                                                                        },
                                                                    })
                                                                }
                                                            }
                                                        }}
                                                    />
                                                )
                                            },
                                        },
                                        { type: "button-primary", prop: "add", value: "添加一条", config: { wrapperCol: { offset: 4 } } },
                                        [
                                            [
                                                { type: "button", prop: "$reset", value: "重置" },
                                                { type: "button", prop: "pre", value: "上一步" },
                                                { type: "button-primary", prop: "$submit", value: "提交" },
                                                { type: "space" },
                                            ],
                                            { type: "div", className: styles["div2"] },
                                        ],
                                    ]}
                                    onEvent={(params) => {
                                        if (params.prop === "add" && params.type === "click") {
                                            regionRef.current.set("form3.list", (current) => {
                                                current.push({})
                                                return current
                                            })
                                        } else if (params.prop === "pre" && params.type === "click") {
                                            regionRef.current.set("step", 2)
                                        }
                                    }}
                                    onSubmit={(data) => {
                                        alert("打开控制台查看数据！")
                                        console.log(regionRef.current.get())
                                    }}
                                />
                            )
                        },
                    },
                ]}
            />
            <Dialog
                onOk={() => {
                    regionRef.current.set("form1.table", (current) => {
                        return selection
                    })
                }}
                width={880}
                noForm
                name={"cdialog"}
            >
                <Search
                    className={styles["search"]}
                    columns={[
                        { type: "input", prop: "name", label: "请输入", placeholder: "名称" },
                        { type: "button-primary", prop: "search", value: "查询" },
                    ]}
                />
                <Table
                    data={tableData}
                    onEvent={tableEvent}
                    pagination={false}
                    config={{ selection: true }}
                    columns={[
                        { type: "text", prop: "name", label: "名称", value: "text" },
                        { type: "text", prop: "sex", label: "性别", value: "text" },
                        { type: "text", prop: "age", label: "年龄", value: "text" },
                    ]}
                />
            </Dialog>
        </div>
    )
}