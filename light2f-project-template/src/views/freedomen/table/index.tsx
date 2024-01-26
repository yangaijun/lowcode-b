import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Table } from 'antd';
import Region from "../region";
import { hasPermission } from "../config/permission"
import { useListComponent } from "../hooks/useBase";
import { getArrayLastItem, getClass, getOrderKey, getStyle, objectMerge, splitConfig } from "../utils/util"
import { FData, ITableProps } from "../config/type";
import { getDefaultConfigs } from "../config/config";
import { changeType, clickType, defaultPage, isRenderComponent, tableColumnProps, tablePageChangeProp, tableSelectionProp, tableSorterType } from "../config/props";
import { tableColumnGroupType } from "../containers";

const { Column, ColumnGroup } = Table;

const keyName = 'Table'

function FTable(props: ITableProps) {
    const { style, className, columns, data, pagination, onEvent, onChange, config } = props

    const innerRef = useRef<{ onEvent?: Function, onChange?: Function }>(
        { onEvent, onChange }
    )

    const [selecteds, setSelecteds] = useState<FData[]>([])
    const [page, setPage] = useState(defaultPage)

    const { innerData, innerChange, innerEvent } = useListComponent(innerRef.current.onChange, innerRef.current.onEvent, data)

    useEffect(() => {
        innerRef.current.onChange = onChange
    }, [onChange])

    useEffect(() => {
        innerRef.current.onEvent = onEvent
    }, [onEvent])

    const pageEvent = useCallback((pageNo: number, pageSize: number) => {
        const row = { pageNo, pageSize }
        setPage({ ...row })
        innerRef.current.onEvent?.({ prop: tablePageChangeProp, type: changeType, value: row, row });
    }, [])

    const tableChange = useCallback((p: any, f: any, sorter: any, extra: any) => {
        if (extra.action === 'sort') {
            innerRef.current.onEvent?.({ prop: sorter.field, type: tableSorterType, value: sorter.order, row: sorter })
        }
    }, [innerChange])

    const getColumnDom = useCallback((columns: any, data: any, key: number) => {
        return (
            <Region
                key={key}
                data={data}
                columns={columns}
                onEvent={innerEvent}
                onChange={innerChange}
            />
        );
    }, [innerEvent, innerChange])

    const selectChange = useCallback((selectedRowKeys: any[], selectedRows: any[]) => {
        setSelecteds(selectedRowKeys)
        innerRef.current.onEvent?.({
            type: clickType,
            prop: tableSelectionProp,
            value: selectedRows,
            row: { selectedRows }
        })
    }, [])

    const innerConfig = useMemo(() => {
        const defaultConfig: any = {}
        const [DefaultConfigs] = getDefaultConfigs()
        const paginationConfig: any = {}

        if (config?.selection) {
            defaultConfig.rowSelection = {
                getCheckboxProps(record: any) {
                    const cdisabled = config?.disabled
                    if (cdisabled) {
                        const disabled = typeof cdisabled === 'boolean' ? cdisabled : cdisabled(record)
                        return { disabled }
                    }
                },
                type: config.selectionType,
                ...defaultConfig.rowSelection,
                selectedRowKeys: selecteds,
                onChange: selectChange
            }
        }

        if (pagination) {
            paginationConfig.pagination = {
                size: 'small',
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: (total: number) => `共 ${total} 条`,
                current: page.pageNo,
                ...config?.pagination,
                ...pagination,
                onChange: pageEvent
            }
            if (pagination.pageNo) {
                paginationConfig.pagination.current = pagination.pageNo
            }
        } else if (pagination === false) {
            paginationConfig.pagination = false
        }

        return objectMerge(
            defaultConfig,
            null,
            DefaultConfigs.Table,
            config,
            paginationConfig
        )
    }, [config, selecteds, pagination, pageEvent, page.pageNo, selectChange])

    const getColumns = useCallback((column: any, index: number, level?: string) => {
        const loadColumn = (c: any) => {
            const params = { column: c, value: c.value, data: c.data }
            if (c.load) {
                return c.load(params) && hasPermission(params) 
            }
            return hasPermission(params);
        }

        const key = getOrderKey(level, index)

        if (Array.isArray(column)) {
            const lastItem = getArrayLastItem(column)

            if (lastItem?.type === tableColumnGroupType) {
                if (!loadColumn(loadColumn)) return

                const columns: any = column.splice(0, column.length - 1) 

                return (
                    <ColumnGroup key={key} title={lastItem.label}>
                        {columns.map((c: any, index: any) => {
                            return getColumns(c, index, key);
                        })}
                    </ColumnGroup>
                );

            } else {
                console.error("分组表头数组最后一个元素类型必须是：" + tableColumnGroupType)
                return
            }
        }

        if (!loadColumn(column)) return

        const tempColumn = {
            ...column,
            config: {
                align: innerConfig?.align,
                ...column.config
            }
        }
        const tableColumnConfig = splitConfig(tempColumn.config, tableColumnProps)

        return (
            <Column
                key={key}
                title={tempColumn.label}
                dataIndex={tempColumn.prop}
                width={tempColumn.width}
                {...tableColumnConfig}
                render={(value: any, data: any, index: number) => {
                    if (tempColumn.render) {
                        let render;
                        if (Array.isArray(tempColumn.render)) {
                            render = tempColumn.render;
                        } else if (typeof tempColumn.render === 'function') {
                            render = tempColumn.render({ value, data });
                        }

                        if (Array.isArray(render)) {
                            return getColumnDom(render, data, index);
                        } else {
                            return render;
                        }
                    } else {
                        if (!tempColumn.type) tempColumn.type = 'text';
                        if (tableColumnConfig.ellipsis) {
                            tempColumn.config = {
                                ...tempColumn.config,
                                title: data[tempColumn.prop]
                            }
                        }
                        return getColumnDom([tempColumn], data, index);
                    }
                }}
            />
        );
    }, [getColumnDom, innerConfig?.align])

    const tableColumns = useMemo(() => (
        columns?.map((column: any, index: number) => {
            return getColumns(column, index)
        })), [columns, getColumns])

    const _style = useMemo(() => getStyle(keyName, style), [style])
    const _className = useMemo(() => getClass(keyName, className), [className])

    return (
        <Table
            style={_style}
            className={_className}
            dataSource={innerData}
            onChange={tableChange}
            {...innerConfig}
        >
            {tableColumns}
        </Table >
    )
}

FTable[isRenderComponent] = true

export default FTable