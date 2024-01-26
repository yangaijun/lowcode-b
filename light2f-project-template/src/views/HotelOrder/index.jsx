import { SearchOutlined, RedoOutlined, PlusOutlined } from "@ant-design/icons"
import { Search, Region, Table, Dialog, Form } from "freedomen"
import { useRef, useState, useCallback, useEffect } from "react"
import { message, Modal } from "antd"
import util from "libs/util"
import hotelOrderService from "services/HotelOrder"
import styles from "./index.module.less"

export default function HotelOrder() {
    const formRef = useRef()
    const [searchParams, setSearchParams] = useState({
        pageNo: 1,
        pageSize: 10,
    })
    const [tableData, setTableData] = useState([])
    const [selection, setSelection] = useState([])
    const [loading, setLoading] = useState()
    const [pagination, setPagination] = useState({ total: 0 })
    const loadData = useCallback(() => {
        setLoading(true)
        hotelOrderService.search(searchParams).then((res) => {
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
        } else if (params.prop === "checkOut" && params.type === "click") {
            Modal.confirm({
                title: "确认",
                content: "退房？",
                onOk() {
                    hotelOrderService.checkOut(params.row).then((res) => {
                        message.success("成功！")
                        loadData()
                    })
                },
            })
        } else if (params.prop === "pdel" && params.type === "confirm") {
            hotelOrderService.delete(params.row).then((res) => {
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
                    hotelOrderService
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
                ref={formRef}
                onEvent={(params) => {
                    if (params.prop === "typeId" && params.type === "change") {
                        formRef.current.set("roomId", null)
                    }
                }}
                data={formData}
                columns={[
                    {
                        type: "select",
                        prop: "vipId",
                        label: "会员名",
                        options: ({ resolve, data, value }) => {
                            hotelOrderService
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
                            hotelOrderService.roomTypeOptions({ pageNo: 1, pageSize: 9999 }).then((res) => {
                                if (res.data?.records) {
                                    resolve(res.data?.records)
                                }
                            })
                        },
                        rule: "required",
                        config: { labelname: "typeName", valuename: "typeId" },
                    },
                    {
                        type: "select",
                        prop: "roomId",
                        label: "房号",
                        options: ({ resolve, data, value, shouldUpdate }) => {
                            //当上次的parentId和这次的parentId一样，就停止继续请求
                            shouldUpdate((preData, currentData) => preData.typeId !== currentData.typeId)
                            hotelOrderService
                                .roomSearch({
                                    pageNo: 1,
                                    pageSize: 9999,
                                    typeId: data.typeId,
                                    orderId: data.orderId,
                                })
                                .then((res) => {
                                    if (res.data?.records) {
                                        resolve(res.data?.records)
                                    }
                                })
                        },
                        rule: "required",
                        config: { labelname: "roomNo", valuename: "roomId" },
                    },
                    {
                        type: "date",
                        prop: "orderStartedAt",
                        label: "开始日期",
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
                        prop: "orderEndedAt",
                        label: "结束日期",
                        rule: ({ data, value }) => {
                            if (!value) {
                                return Promise.reject("请选择！")
                            } else if (util.dayjs(data.orderStartedAt) > util.dayjs(value)) {
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
    useEffect(() => {
        loadData()
    }, [loadData])
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
                    { type: "text", prop: "orderPrice", label: "总价", value: "text" },
                    { type: "text", prop: "orderStartedAt", label: "开始日期", value: "text", filter: "yyyy-MM-dd" },
                    { type: "text", prop: "orderEndedAt", label: "结束日期", value: "text", filter: "yyyy-MM-dd" },
                    { type: "text", prop: "orderDayCount", label: "总天数", value: "text" },
                    {
                        type: "tag",
                        prop: "orderStatus",
                        label: "状态",
                        filter: {
                            ing: "进行中",
                            finish: "已完成",
                        },
                    },
                    {
                        label: "操作",
                        width: 180,
                        render() {
                            return [
                                [
                                    { type: "button-link", prop: "edit", value: "编辑", className: styles["edit"] },
                                    { type: "button-link", prop: "checkOut", value: "退房", className: styles["checkOut"] },
                                    {
                                        type: "fragment",
                                        load: ({ value, data }) => {
                                            return data.orderStatus === "ing"
                                        },
                                    },
                                ],
                                [
                                    { type: "button-link", prop: "del", value: "删除", config: { danger: true }, className: styles["del"] },
                                    {
                                        type: "popconfirm",
                                        prop: "pdel",
                                        value: "确定要删除选中数据？",
                                        load: ({ value, data }) => {
                                            return data.orderStatus === "finish"
                                        },
                                    },
                                ],
                                { type: "space" },
                            ]
                        },
                    },
                ]}
            />
            <Dialog name={"fdialog"} ref={formRef} />
        </div>
    )
}
