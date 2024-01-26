import React, { useMemo } from "react";
import { useClassName, useOptions, useStyle, useChange, useDisabled, useConfig, useOptionNames, useRidkeyConfig } from "../../hooks/useBase";
import { Segmented } from "antd";
import { ISegmentedProps } from "../../config/type";
import MarginLoadingOutlined from "../MarginLoadingOutlined";
import { names } from "../../config/props";

const ridKeys = [names.labelname, names.valuename]

function FSegmented(props: ISegmentedProps) {
    const { item } = props

    const style = useStyle(props)
    const onChange = useChange(props)
    const disabled = useDisabled(props)
    const className = useClassName(props)
    const { options, loading } = useOptions(props)
    const config = useConfig(props)
    const ridKeysConfig = useRidkeyConfig(config, ridKeys)

    const { labelname, valuename } = useOptionNames(config)

    const innerOptions = useMemo(() => {
        return options.map((option, key) => {
            return {
                key,
                label: option[labelname],
                value: option[valuename],
                ...option
            }
        })
    }, [options, labelname, valuename])

    return useMemo(() => {
        return loading ? <MarginLoadingOutlined /> :
            <Segmented
                className={className}
                style={style}
                value={item.value}
                disabled={disabled}
                options={innerOptions}
                onChange={onChange}
                {...ridKeysConfig}
            />
    }, [loading, className, style, disabled, item.value, onChange, ridKeysConfig, innerOptions])
}

export default FSegmented