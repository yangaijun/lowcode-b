import React, { useMemo } from "react";
import { useClassName, useStyle, useConfig } from "../../hooks/useBase";
import { Alert } from "antd";
import { getOriginalType } from "../../utils/base";
import { IAlertProps } from "../../config/type";

const types: any = {
    'alert-success': 'success',
    'alert-info': 'info',
    'alert-warning': 'warning',
    'alert-error': 'error'
}

function FAlert(props: IAlertProps) {
    const { item } = props

    const style = useStyle(props)
    const className = useClassName(props)
    const config = useConfig(props)

    const type = getOriginalType(item)
    const aType = types[type]

    return useMemo(() => {
        return <Alert
            type={aType}
            className={className}
            message={item.value}
            style={style}
            {...config}
        />
    }, [className, style, aType, item.value, config])
}

export default FAlert