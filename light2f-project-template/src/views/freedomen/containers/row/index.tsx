import React, { useMemo } from "react";
import { Row } from "antd";
import { useStyle, useClassName, useConfig, useChildren } from "../../hooks/useBase";

export interface rowProps {
    children: React.ReactElement,
    item: any
}

export default function FRow(props: rowProps) { 

    const style = useStyle(props)
    const className = useClassName(props)
    const config = useConfig(props)
    const children = useChildren(props)

    return useMemo(() => {
        return <Row
            style={style}
            className={className}
            {...config}
        >
            {children}
        </Row>
    }, [style, className, config, children])

}