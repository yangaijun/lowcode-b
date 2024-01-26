import React, { useMemo } from "react";
import { useStyle, useClassName, useConfig, useChildren } from "../../hooks/useBase";

export interface divProps {
    children: React.ReactElement,
    item: any
}
export default function FDiv(props: divProps) {

    const style = useStyle(props)
    const className = useClassName(props)
    const config = useConfig(props)
    const children = useChildren(props)

    return useMemo(() => {
        return <div
            className={className}
            style={style}
            {...config}
        >
            {children}
        </div>
    }, [className, style, config, children])

}