import React, { useCallback, useMemo } from "react";
import { Switch } from "antd";
import { ISwitchProps } from "../../config/type";
import { useClassName, useStyle, useChange, useDisabled, useConfig, useRidkeyConfig } from "../../hooks/useBase";

const ridKeys = ['checkedValue', 'uncheckedValue']


function FSwitch(props: ISwitchProps) {
    const { item } = props

    const style = useStyle(props)
    const className = useClassName(props)
    const onChange = useChange(props)
    const disabled = useDisabled(props)

    const config = useConfig(props)
    const ridKeysConfig = useRidkeyConfig(config, ridKeys)

    const resetValue = useCallback((value: any, isReset = false) => {
        const { checkedValue, uncheckedValue } = config
        if (checkedValue !== undefined || uncheckedValue !== undefined) {
            if (isReset) {
                return value ? checkedValue : uncheckedValue
            }
            return value === checkedValue
        }
        return value
    }, [config])

    return useMemo(() => <Switch
        style={style}
        className={className}
        disabled={disabled}
        checked={resetValue(item.value)}
        onChange={value => {
            onChange(resetValue(value, true));
        }}
        {...ridKeysConfig}
    />, [className, style, resetValue, disabled, item.value, onChange, ridKeysConfig])

}

export default FSwitch
