import { SearchOutlined, RedoOutlined, PlusOutlined } from "@ant-design/icons"
import { Search, Region, Table, Dialog, Form } from "freedomen"
import { useState, useCallback, useEffect } from "react"
import { message } from "antd"
import hotelRoomService from "services/HotelRoom"
import styles from "./index.module.less"

export default function HotelRoom() {
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
        hotelRoomService.search(searchParams).then((res) => {
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
        } else if (params.prop === "pdel" && params.type === "confirm") {
            hotelRoomService.delete(params.row).then((res) => {
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
                    hotelRoomService
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
                data={formData}
                columns={[
                    { type: "input", prop: "roomNo", label: "房号", rule: "required" },
                    {
                        type: "select@w200",
                        prop: "typeId",
                        label: "房间类型",
                        options: ({ resolve, data, value }) => {
                            hotelRoomService
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
                    { type: "input", prop: "roomNo", label: "房号" },
                    {
                        type: "select@w200",
                        prop: "typeId",
                        label: "房间类型",
                        options: ({ resolve, data, value }) => {
                            hotelRoomService
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
                        config: { labelname: "typeName", valuename: "typeId" },
                    },
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
                    { type: "text", prop: "roomNo", label: "房号", value: "text" },
                    { type: "text", prop: "typeName", label: "房间类型", value: "text" },
                    { type: "text", prop: "typePrice", label: "单价", value: "text" },
                    { type: "text", prop: "typeArea", label: "面积", value: "text" },
                    { type: "text", prop: "typeUserCount", label: "容纳人数", value: "text" },
                    { type: "tag", prop: "roomStatus", label: "状态", filter: { ing: "正在使用", empty: "空闲", $default: "其它" } },
                    { type: "text", prop: "createdAt", label: "创建日期", value: "text", filter: "yyyy-MM-dd" },
                    {
                        label: "操作",
                        width: 200,
                        render() {
                            return [
                                { type: "button-link", prop: "edit", value: "编辑", className: styles["edit"] },
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
        </div>
    )
}
