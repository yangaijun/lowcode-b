import React, { useMemo } from "react";
import { TimePicker } from "antd";
import dayjs from 'dayjs'
import { ITimePickerProps } from "../../config/type";
import { useStyle, useClassName, useDisabled, useChange, useConfig } from "../../hooks/useBase";

function FTimePicker(props: ITimePickerProps) {
    const { item } = props
    const onChange = useChange(props)
    const style = useStyle(props)
    const className = useClassName(props)
    const disabled = useDisabled(props)
    const config = useConfig(props)

    const innerValue = useMemo(() => {
        return item.value ?
            dayjs(item.value)
            : null
    }, [item.value])

    return useMemo(() => {
        return <TimePicker
            style={style}
            className={className}
            placeholder={item.placeholder}
            value={innerValue}
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
    }, [onChange, innerValue, item.placeholder, style, className, disabled, config])

}

export default FTimePicker
