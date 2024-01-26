import React, { useMemo } from "react";
import { Checkbox } from "antd";
import { ICheckboxsProps } from "../../config/type";
import MarginLoadingOutlined from "../MarginLoadingOutlined";
import { useClassName, useOptions, useStyle, useChange, useDisabled, useConfig, useItemStyle, useOptionNames, useRidkeyConfig } from "../../hooks/useBase";
import { names } from "../../config/props";

const ridKeys = [names.valuename, names.labelname]

function FCheckBoxs(props: ICheckboxsProps) {
    const { item } = props

    const style = useStyle(props)
    const onChange = useChange(props)
    const disabled = useDisabled(props)
    const className = useClassName(props)
    const config = useConfig(props)
    const { options, loading } = useOptions(props)
    const itemStyles = useItemStyle(props, options)
    const ridKeysConfig = useRidkeyConfig(config, ridKeys)

    const { labelname, valuename } = useOptionNames(config)

    return useMemo(() => {
        return loading ? <MarginLoadingOutlined /> :
            <Checkbox.Group
                style={style}
                className={className}
                disabled={disabled}
                value={item.value}
                onChange={onChange}
                {...ridKeysConfig}
            >
                {options.map((option, index) => (
                    <Checkbox
                        disabled={option.disabled}
                        style={itemStyles[index]}
                        key={option[valuename]}
                        value={option[valuename]}
                    >
                        {option.option || option[labelname]}
                    </Checkbox>
                ))}
            </Checkbox.Group>
    }, [style, item.value, labelname, valuename, itemStyles, onChange, disabled, className, options, loading, ridKeysConfig])

}

export default FCheckBoxs