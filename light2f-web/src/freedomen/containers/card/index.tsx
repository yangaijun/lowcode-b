import React, { useMemo } from "react";
import { Card } from "antd";
import { useStyle, useClassName, useConfig, useChildren } from "../../hooks/useBase";

export interface cardProps {
    children: React.ReactElement,
    item: any
}
export default function FCard(props: cardProps) {
    const { item } = props

    const style = useStyle(props)
    const className = useClassName(props)
    const config = useConfig(props)
    const children = useChildren(props)

    return useMemo(() => {
        return <Card
            style={style}
            className={className}
            title={item.value}
            {...config}
        >
            {children}
        </Card>
    }, [style, className, item.value, config, children])
}