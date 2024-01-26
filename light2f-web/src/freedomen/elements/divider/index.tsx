import React from 'react';
import { Divider } from "antd";
import { useClassName, useStyle, useFilter, useConfig } from "../../hooks/useBase";
import { useMemo } from "react";
import { IDividerProps } from "../../config/type";
import { getOriginalType } from "../../utils/base";

const types: any = {
    'divider': 'horizontal',
    'divider-vertical': 'vertical'
}

function FDivider(props: IDividerProps) {
    const { item } = props

    const style = useStyle(props)
    const className = useClassName(props)
    const filter = useFilter(props)
    const config = useConfig(props)

    const type = types[getOriginalType(item)] || types.divider
    return useMemo(() => <Divider
        style={style}
        type={type}
        className={className}
        {...config}
    >
        {filter}
    </Divider>, [style, type, className, filter, config])

}

export default FDivider