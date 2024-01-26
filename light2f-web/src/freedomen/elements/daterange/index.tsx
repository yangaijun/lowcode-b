import React, { useMemo } from "react";
import { getOriginalType } from "../../utils/base";
import { DatePicker } from "antd";
import dayjs from 'dayjs'
import { IDateRangeProps } from "../../config/type";
import { useStyle, useClassName, useDisabled, useChange, useConfig } from "../../hooks/useBase";

const { RangePicker } = DatePicker;
//and rangedate-datetime todo
const types: any = {
    'daterange-year': 'year',
    'daterange-month': 'month',
    'daterange-week': 'week',
    'daterange-quarter': 'quarter'
}

function parseValue(value: null | any[]) {
    if (value) {
        const [start, end] = value
        return [start?.valueOf(), end?.valueOf()]
    }
    return value
}

function stringfiyValue(value: null | any[]) {
    if (value) {
        return [value[0] ? dayjs(value[0]) : null, value[1] ? dayjs(value[1]) : null];
    }
    return value
}

function FDateRange(props: IDateRangeProps) {
    const { item } = props
    const onChange = useChange(props)
    const style = useStyle(props)
    const className = useClassName(props)
    const disabled = useDisabled(props)
    const config = useConfig(props)

    let type = getOriginalType(item)
    const dType = types[type]

    const innerValue = useMemo(() => {
        return stringfiyValue(item.value)
    }, [item.value])

    return useMemo(() => {
        return <RangePicker
            picker={dType}
            showTime={type === 'rangedate-datetime'}
            style={style}
            value={innerValue}
            placeholder={item.placeholder}
            className={className}
            disabled={disabled}
            {...config}
            onChange={value => {
                onChange(parseValue(value));
            }}
        />
    }, [onChange, item.placeholder, style, className, disabled, config, type, dType, innerValue])
}

export default FDateRange