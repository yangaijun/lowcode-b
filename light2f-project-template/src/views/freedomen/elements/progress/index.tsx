import React, { useMemo } from "react";
import { getOriginalType } from "../../utils/base";
import { useClassName, useStyle, useFilter, useConfig } from "../../hooks/useBase"; 
import { Progress } from 'antd';
import { IProgressProps } from "../../config/type";

const types: any = {
    'progress-line': 'line',
    'progress-circle': 'circle',
    'progress-dashboard': 'dashboard'
}
 
function FProgress(props: IProgressProps) {
    const { item } = props

    const style = useStyle(props)
    const className = useClassName(props)
    const filter = useFilter(props)
    const config = useConfig(props)

    let type = getOriginalType(item)
    const pType = types[type];

    return useMemo(() => {
        return <Progress
            type={pType}
            percent={filter}
            style={style}
            className={className}
            {...config}
        />
    }, [pType, config, filter, style, className])

}

export default FProgress