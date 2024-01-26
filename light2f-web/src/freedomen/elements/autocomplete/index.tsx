import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useClassName, useOptions, useStyle, useChange, useDisabled, useConfig, useRidkeyConfig } from "../../hooks/useBase";
import { AutoComplete } from "antd";
import { EChangeEventType, IAutoCompleteProps } from "../../config/type";
import MarginLoadingOutlined from "../MarginLoadingOutlined";

const ridKeys = ['changeEventType']
 
function FAutoComplete(props: IAutoCompleteProps) {
    const { item } = props

    const [value, setValue] = useState<string>()
    const innerRef = useRef<any>({ value: null, pre: null })

    const style = useStyle(props)
    const onChange = useChange(props)
    const disabled = useDisabled(props)
    const className = useClassName(props)
   
    const config = useConfig(props)
    const ridKeysConfig = useRidkeyConfig(config, ridKeys)
    const { changeEventType = EChangeEventType.INPUT } = config
 
    const { options, loading } = useOptions(props, value)

    const dropdownRender = useCallback((menu: React.ReactNode) => {
        return loading ? <MarginLoadingOutlined /> : menu
    }, [loading])

    useEffect(() => {
        if (innerRef.current.value !== item.value) {
            setValue(item.value)
        }
    }, [item.value])

    return useMemo(() => {
        return <AutoComplete
            value={value}
            style={style}
            options={options}
            className={className}
            dropdownRender={dropdownRender}
            onBlur={() => {
                if (changeEventType === EChangeEventType.BLUR && innerRef.current.value !== null) {
                    onChange(value)
                }
            }}
            placeholder={item.placeholder}
            disabled={disabled}
            onChange={value => {
                innerRef.current.pre = innerRef.current.value

                innerRef.current.value = value
                setValue(value)

                if (changeEventType === EChangeEventType.INPUT) {
                    onChange(value)
                }
            }}
            {...ridKeysConfig}
        />
    }, [style, value, item.placeholder, disabled, onChange, className, options, dropdownRender, changeEventType, ridKeysConfig])
}

export default FAutoComplete