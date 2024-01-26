import React, { useMemo } from "react";
import { TimePicker } from "antd";
import dayjs from 'dayjs'
import { ITimeRangeProps } from "../../config/type";
import { useStyle, useClassName, useDisabled, useChange, useConfig } from "../../hooks/useBase";

const { RangePicker } = TimePicker;

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

function FTimeRange(props: ITimeRangeProps) {
    const { item } = props
    const onChange = useChange(props)
    const style = useStyle(props)
    const className = useClassName(props)
    const disabled = useDisabled(props)
    const config = useConfig(props)

    const innerValue = useMemo(() => {
        return stringfiyValue(item.value)
    }, [item.value])

    return useMemo(() => {
        return <RangePicker
            style={style}
            value={innerValue}
            className={className}
            placeholder={item.placeholder}
            disabled={disabled}
            {...config}
            onChange={value => {
                onChange(parseValue(value));
            }}
        />
    }, [onChange, item.placeholder, style, className, disabled, config, innerValue])
}

export default FTimeRange