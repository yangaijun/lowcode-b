import React, { useMemo } from "react";
import { Popconfirm } from "antd";
import { useStyle, useClassName, useConfig, useFilter, useEvent, useChildren } from "../../hooks/useBase";

export interface popconfirmProps {
    children: React.ReactElement,
    item: any
}

export default function FPopconfirm(props: popconfirmProps) {
    const { item: { value } } = props

    const onEvent = useEvent(props)
    const style = useStyle(props)
    const className = useClassName(props)
    const config = useConfig(props)
    const filter = useFilter(props)
    const children = useChildren(props)

    return useMemo(() => {
        return <Popconfirm
            title={filter}
            style={style}
            className={className}
            onConfirm={_ => onEvent("confirm", value)}
            onCancel={_ => onEvent("cancel", value)}
            {...config}
        >
            {children}
        </Popconfirm>
    }, [value, style, filter, className, config, onEvent, children])

}