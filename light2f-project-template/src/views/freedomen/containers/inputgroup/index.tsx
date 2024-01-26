import React, { useMemo } from "react";
import { Space } from "antd";
import { getOriginalType } from "../../utils/base";
import { useStyle, useClassName, useConfig, useChildren } from "../../hooks/useBase";

const types: any = {
    'inputgroup': 'horizontal',
    'inputgroup-vertical': 'vertical'
}
export interface spaceProps {
    children: React.ReactElement,
    item: any
}

export default function FInputGroup(props: spaceProps) {
    const {  item } = props

    const style = useStyle(props)
    const className = useClassName(props)
    const config = useConfig(props)
    const children = useChildren(props)
    
    const type = getOriginalType(item)
    const sType = types[type] || types.inputgroup

    return useMemo(() => { 
        return <Space.Compact
            style={style}
            direction={sType}
            className={className}
            {...config}
        >
            {children}
        </Space.Compact>
    }, [style, sType, className, config, children])

}