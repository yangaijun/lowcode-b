import React, { useMemo } from "react";
import { getOriginalType } from "../../utils/base";
import { DatePicker } from "antd";
import dayjs from 'dayjs'
import { IDateProps } from "../../config/type";
import { useStyle, useClassName, useDisabled, useChange, useConfig } from "../../hooks/useBase";

const types: any = {
    'date-year': 'year',
    'date-month': 'month',
    'date-week': 'week',
    'date-quarter': 'quarter'
}

function FDate(props: IDateProps) {
    const { item } = props
    const onChange = useChange(props)
    const style = useStyle(props)
    const className = useClassName(props)
    const disabled = useDisabled(props)
    const config = useConfig(props)

    let type = getOriginalType(item)
    const dType = types[type]

    const innerValue = useMemo(() => {
        return item.value ? dayjs(item.value) : null
    }, [item.value])

    return useMemo(() => {
        return <DatePicker
            picker={dType}
            value={innerValue}
            showTime={type === 'date-datetime'}
            placeholder={item.placeholder}
            className={className}
            style={style}
            disabled={disabled}
            onChange={value => {
                if (value === null) {
                    onChange(null)
                } else {
                    onChange(value?.valueOf())
                }
            }}
            {...config}
        />
    }, [onChange, innerValue, item.placeholder, style, className, disabled, config, type, dType])

}

export default FDate
