import { Affix } from "antd";
import React, { useMemo } from "react";
import { useStyle, useClassName, useConfig, useChildren } from "../../hooks/useBase";

export interface AffixProps {
    children: React.ReactElement,
    item: any
}

export default function FAffix(props: AffixProps) {

    const style = useStyle(props)
    const className = useClassName(props)
    const config = useConfig(props)
    const children = useChildren(props)
    
    return useMemo(() => {
        return <Affix
            style={style}
            className={className}
            {...config}
        >
            {children}
        </Affix>
    }, [style, className, config, children])

}