import React, { useMemo } from "react";
import { getOriginalType } from "../../utils/base";
import { useClassName, useOptions, useStyle, useChange, useDisabled, useConfig, useItemStyle, useOptionNames, useRidkeyConfig } from "../../hooks/useBase";
import { Radio } from "antd";
import { IRadiosProps } from "../../config/type";
import MarginLoadingOutlined from "../MarginLoadingOutlined";
import { names } from "../../config/props";

const ridKeys = [names.labelname, names.valuename]

const types: any = {
    'radios': Radio,
    'radios-button': Radio.Button
}

function FRadios(props: IRadiosProps) {
    const { item } = props

    const style = useStyle(props)
    const onChange = useChange(props)
    const disabled = useDisabled(props)
    const className = useClassName(props)
    const { options, loading } = useOptions(props)
    const itemStyles = useItemStyle(props, options)
    const config = useConfig(props)
    const ridKeysConfig = useRidkeyConfig(config, ridKeys)

    const { labelname, valuename } = useOptionNames(config)
    const type = getOriginalType(item)
    const Element = types[type] || Radio;

    return useMemo(() => {
        return loading ? <MarginLoadingOutlined /> :
            <Radio.Group
                style={style}
                className={className}
                disabled={disabled}
                value={item.value}
                onChange={({ target: { value } }) => {
                    onChange(value)
                }}
                {...ridKeysConfig}
            >
                {options.map((option, index) => (
                    <Element
                        key={option[valuename]}
                        style={itemStyles[index]}
                        value={option[valuename]}
                        disabled={option.disabled}
                    >
                        {option.option || option[labelname]}
                    </Element>
                ))}
            </Radio.Group>
    }, [Element, loading, labelname, valuename, className, style, disabled, item.value, onChange, ridKeysConfig, itemStyles, options])
}

export default FRadios