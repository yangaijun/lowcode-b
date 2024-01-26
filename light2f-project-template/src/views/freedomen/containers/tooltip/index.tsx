import React, { useMemo } from "react";
import { Tooltip } from "antd";
import { useStyle, useClassName, useConfig, useFilter, useChildren } from "../../hooks/useBase";

export interface tooltipProps {
    children: React.ReactElement,
    item: any
}

export default function FToolTip(props: tooltipProps) { 

    const style = useStyle(props)
    const className = useClassName(props)
    const config = useConfig(props)
    const filter = useFilter(props)

    const children = useChildren(props)

    return useMemo(() => {
        return <Tooltip
            style={style}
            title={filter}
            className={className}
            {...config}
        >
            {children}
        </Tooltip>
    }, [style, className, config, filter, children])

}