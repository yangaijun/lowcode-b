import React, { useMemo } from "react";
import { Col } from "antd";
import { useStyle, useClassName, useConfig, useChildren } from "../../hooks/useBase";

export interface colProps {
    children: React.ReactElement,
    item: any
}

export default function FCol(props: colProps) {
    const { item } = props

    const style = useStyle(props)
    const className = useClassName(props)
    const config = useConfig(props)
    const children = useChildren(props)

    return useMemo(() => {
        return <Col
            span={item.value}
            style={style}
            className={className}
            {...config}
        >
            {children}
        </Col>
    }, [style, item.value, className, config, children])

}