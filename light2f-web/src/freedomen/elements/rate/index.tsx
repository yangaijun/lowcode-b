import React from 'react';
import { Rate } from "antd";
import { useMemo } from "react";
import { IRateProps } from "../../config/type";
import { useClassName, useStyle, useFilter, useDisabled, useChange, useConfig } from "../../hooks/useBase";
 
function FRate(props: IRateProps) { 
    const style = useStyle(props)
    const onChange = useChange(props)
    const className = useClassName(props)
    const filter = useFilter(props)
    const disabled = useDisabled(props)
    const config = useConfig(props)

    return useMemo(() => {
        return <Rate
            disabled={disabled}
            style={style}
            value={filter}
            className={className}
            onChange={onChange}
            {...config}
        />
    }, [disabled, style, filter, className, onChange, config])

}
export default FRate

