import React, { useMemo } from "react";
import { Spin } from "antd";
import { useStyle, useClassName, useConfig, useChildren } from "../../hooks/useBase";

export interface spinProps {
    children: React.ReactElement,
    item: any
}

export default function FSpin(props: spinProps) {
    const { item: { value } } = props

    const style = useStyle(props)
    const className = useClassName(props)
    const config = useConfig(props)

    const children = useChildren(props)

    return useMemo(() => {
        return <Spin
            style={style}
            spinning={value}
            className={className}
            {...config}
        >
            {children}
        </Spin>
    }, [style, className, config, value, children])

}