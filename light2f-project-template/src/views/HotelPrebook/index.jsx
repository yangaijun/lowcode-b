import { SearchOutlined, RedoOutlined, PlusOutlined } from "@ant-design/icons"
import { Search, Region, Table, Dialog, Form } from "freedomen"
import { useState, useCallback, useEffect } from "react"
import { message, Modal } from "antd"
import util from "libs/util"
import hotelPrebookService from "services/HotelPrebook"
import styles from "./index.module.less"

export default function HotelPrebook() {
    const [searchParams, setSearchParams] = useState({
        pageNo: 1,
        pageSize: 10,
    })
    const [tableData, setTableData] = useState([])
    const [searchParams2, setSearchParams2] = useState({
        pageNo: 1,
        pageSize: 999,
    })
    const [tableData2, setTableData2] = useState([])
    const [selection, setSelection] = useState([])
    const [loading, setLoading] = useState()
    const [pagination, setPagination] = useState({ total: 0 })
    const [selection2, setSelection2] = useState([])
    const loadData = useCallback(() => {
        setLoading(true)
        hotelPrebookService.search(searchParams).then((res) => {
            setLoading(false)
            if (res.code === 0) {
                //此处的数据结构可能不同，需要修改
                setPagination({
                    total: res.data.total,
                    pageNo: res.data.current,
                    pageSize: res.data.size,
                })
                setTableData(res.data.records)
            }
        })
    }, [searchParams])
    const setReSearch = useCallback((row) => {
        setSearchParams({ ...row, pageNo: 1 })
    }, [])
    const loadData2 = useCallback(() => {
        hotelPrebookService.roomSearch(searchParams2).then((res) => {
            if (res.data) {
                setTableData2(res.data.records)
            }
        })
    }, [searchParams2])
    const searchEvent = (params) => {
        if (params.prop === "search" && params.type === "click") {
            setReSearch(params.row)
        } else if (params.prop === "$reset" && params.type === "click") {
            setReSearch(params.row)
        }
    }
    const regionEvent = (params) => {
        if (params.prop === "add" && params.type === "click") {
            Dialog.open("fdialog", "添加").then((set) => set(getDialogForm()))
        }
    }
    const tableEvent = (params) => {
        if (params.prop === "edit" && params.type === "click") {
            Dialog.open("fdialog", "编辑").then((set) => set(getDialogForm(params.row)))
        } else if (params.prop === "cancel" && params.type === "click") {
            Modal.confirm({
                title: "提示",
                content: "确认取消预约？",
                onOk() {
                    hotelPrebookService.cancel(params.row).then((res) => {
                        message.success("取消成功")
                        loadData()
                    })
                },
            })
        } else if (params.prop === "toOrder" && params.type === "click") {
            setSearchParams2({
                ...searchParams2,
                ...params.row,
            })
            Dialog.open("chooseDialog")
        } else if (params.prop === "pdel" && params.type === "confirm") {
            hotelPrebookService.delete(params.row).then((res) => {
                message.success("删除成功！")
                loadData()
            })
        } else if (params.prop === "$page") {
            setSearchParams({
                ...searchParams,
                ...params.value,
            })
        } else if (params.prop === "$selection") {
            setSelection(params.value)
        }
    }
    const getDialogForm = (formData) => {
        return (
            <Form
                onSubmit={(data) => {
                    Dialog.loading("fdialog")
                    hotelPrebookService
                        .insertOrUpdate(data)
                        .then((res) => {
                            //也可以根据是否有 id 不同提示
                            message.success("操作成功！")
                            loadData()
                            Dialog.close("fdialog")
                        })
                        .catch((e) => {
                            Dialog.loading("fdialog", false)
                        })
                }}
                config={{ labelCol: { span: 6 } }}
                data={formData}
                columns={[
                    {
                        type: "select",
                        prop: "vipId",
                        label: "会员名",
                        options: ({ resolve, data, value }) => {
                            hotelPrebookService
                                .vipOptions({
                                    pageNo: 1,
                                    pageSize: 9999,
                                })
                                .then((res) => {
                                    if (res.data?.records) {
                                        resolve(res.data?.records)
                                    }
                                })
                        },
                        rule: "required",
                        config: { labelname: "vipName", valuename: "vipId" },
                    },
                    {
                        type: "select",
                        prop: "typeId",
                        label: "房间类型",
                        options: ({ resolve, data, value }) => {
                            hotelPrebookService
                                .roomTypeOptions({
                                    pageNo: 1,
                                    pageSize: 9999,
                                })
                                .then((res) => {
                                    if (res.data?.records) {
                                        resolve(res.data?.records)
                                    }
                                })
                        },
                        rule: "required",
                        config: { labelname: "typeName", valuename: "typeId" },
                    },
                    {
                        type: "date",
                        prop: "prebookStartedAt",
                        label: "开始入住日期",
                        rule: ({ data, value }) => {
                            if (!value) {
                                return Promise.reject("请选择！")
                            } else if (util.dayjs().isAfter(value, "day")) {
                                return Promise.reject("请不要选择历史时间！")
                            } else {
                                return Promise.resolve()
                            }
                        },
                    },
                    {
                        type: "date",
                        prop: "prebookEndedAt",
                        label: "结束日期",
                        rule: ({ data, value }) => {
                            if (!value) {
                                return Promise.reject("请选择！")
                            } else if (util.dayjs(data.prebookStartedAt) > util.dayjs(value)) {
                                return Promise.reject("结束时间不能小于开始时间！")
                            } else {
                                return Promise.resolve()
                            }
                        },
                    },
                ]}
            />
        )
    }
    const searchEvent1 = (params) => {
        if (params.prop === "search" && params.type === "click") {
            setSearchParams2({
                ...searchParams2,
                ...params.row,
            })
        }
    }
    const tableEvent1 = (params) => {
        if (params.prop === "$selection") {
            setSelection2(params.value)
        }
    }
    useEffect(() => {
        loadData()
    }, [loadData])
    useEffect(() => {
        loadData2()
    }, [loadData2])
    return (
        <div className={"freedomen-page"}>
            <Search
                className={"f-search"}
                data={searchParams}
                onEvent={searchEvent}
                columns={[
                    { type: "input", prop: "vipName" },
                    { type: "input", prop: "vipPhone" },
                    { type: "button-primary", prop: "search", value: "查询", config: { icon: <SearchOutlined />, loading: loading } },
                    { type: "button", prop: "$reset", value: "重置", config: { icon: <RedoOutlined /> } },
                ]}
            />
            <Region
                className={"f-fns"}
                onEvent={regionEvent}
                columns={[[{ type: "button-primary", prop: "add", value: "添加", config: { icon: <PlusOutlined /> } }, { type: "space" }]]}
            />
            <Table
                className={"f-table"}
                data={tableData}
                onEvent={tableEvent}
                pagination={pagination}
                config={{ selection: false, loading: loading }}
                columns={[
                    { type: "text", prop: "vipName", label: "会员名", value: "text" },
                    { type: "text", prop: "vipPhone", label: "手机号", value: "text" },
                    { type: "text", prop: "typeName", label: "房间类型", value: "text" },
                    { type: "text", prop: "typePrice", label: "单价", value: "text" },
                    { type: "text", prop: "typeArea", label: "面积", value: "text" },
                    { type: "text", prop: "prebookPrice", label: "总价", value: "text" },
                    { type: "text", prop: "prebookStartedAt", label: "开始日期", value: "text", filter: "yyyy-MM-dd" },
                    { type: "text", prop: "prebookEndedAt", label: "结束日期", value: "text", filter: "yyyy-MM-dd" },
                    { type: "text", prop: "prebookDayCount", label: "总天数", value: "text" },
                    {
                        type: "tag",
                        prop: "prebookStatus",
                        label: "状态",
                        filter: {
                            book: "已预定",
                            finish: "已转订单",
                            cancel: "已取消",
                        },
                    },
                    {
                        label: "操作",
                        width: 280,
                        render() {
                            return [
                                [
                                    { type: "button-link", prop: "edit", value: "编辑", className: styles["edit"] },
                                    { type: "button-link", prop: "cancel", value: "取消", className: styles["cancel"] },
                                    { type: "button-link", prop: "toOrder", value: "转为订单", className: styles["toOrder"] },
                                    {
                                        type: "fragment",
                                        load: ({ value, data }) => {
                                            return data.prebookStatus === "book"
                                        },
                                    },
                                ],
                                [
                                    { type: "button-link", prop: "del", value: "删除", config: { danger: true }, className: styles["del"] },
                                    { type: "popconfirm", prop: "pdel", value: "确定要删除选中数据？" },
                                ],
                                { type: "space" },
                            ]
                        },
                    },
                ]}
            />
            <Dialog name={"fdialog"} />
            <Dialog
                onOk={() => {
                    if (selection2.length) {
                        hotelPrebookService
                            .toOrder({
                                ...searchParams2,
                                roomId: selection2[0].roomId,
                            })
                            .then((res) => {
                                message.success("已转订单！")
                                loadData()
                            })
                    } else {
                        message.info("请选择房间！")
                        return false
                    }
                }}
                width={820}
                noForm
                name={"chooseDialog"}
                title={"选择房间"}
            >
                <Search
                    className={styles["search"]}
                    data={searchParams2}
                    onEvent={searchEvent1}
                    columns={[
                        { type: "input", prop: "roomNo", label: "房间号" },
                        { type: "button-primary", prop: "search", value: "查询" },
                    ]}
                />
                <Table
                    data={tableData2}
                    onEvent={tableEvent1}
                    pagination={false}
                    config={{
                        selection: true,
                        selectionType: "radio",
                        disabled: (row) => {
                            return false
                        },
                    }}
                    columns={[
                        { type: "text", prop: "roomNo", label: "房间号", value: "text" },
                        { type: "text", prop: "typeName", label: "房间类型", value: "text" },
                        { type: "text", prop: "typePrice", label: "单价", value: "text" },
                        { type: "text", prop: "typeArea", label: "面积", value: "text" },
                    ]}
                />
            </Dialog>
        </div>
    )
}
