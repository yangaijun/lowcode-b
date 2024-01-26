import { filterNode, getOriginalType } from "../../utils/base";
import { message, Select } from "antd";
import React, { useCallback, useMemo } from "react";
import { ISelectProps } from "../../config/type";
import { useClassName, useOptions, useStyle, useChange, useDisabled, useConfig, useRidkeyConfig, useItemStyle, useOptionNames, useOptionIOValue } from "../../hooks/useBase";
import MarginLoadingOutlined from "../MarginLoadingOutlined";
import { names } from "../../config/props";

const ridKeys = ['maxcount', 'filterable', names.labelname, names.valuename, names.optionvalue];

const types: any = {
    'select-multiple': 'select-multiple'
}

function FSelect(props: ISelectProps) {
    const { item } = props

    const style = useStyle(props)
    const onChange = useChange(props)
    const disabled = useDisabled(props)
    const className = useClassName(props)
    const { options, loading } = useOptions(props)
    const itemStyles = useItemStyle(props, options)

    const config = useConfig(props)
    const ridKeysConfig = useRidkeyConfig(config, ridKeys)
    const { innerValue, outerValue } = useOptionIOValue(config, options, item.value)

    const { labelname, valuename } = useOptionNames(config)

    const type = getOriginalType(item)

    const dropdownRender = useCallback((menu: React.ReactNode) => {
        return loading ? <MarginLoadingOutlined /> : menu
    }, [loading])

    const innerChange = useCallback((value: any) => {
        if (config.maxcount && (config.mode === 'multiple' || type === types["select-multiple"])) {
            if (value && value.length > config.maxcount) {
                message.info(`最多选择${config.maxcount}项`);
                return;
            }
        }
        onChange(outerValue(value))
    }, [config, type, outerValue, onChange])

    const filterableProps = useMemo(() => {
        if (config.filterable) {
            return {
                showSearch: true,
                filterOption: (input = '', option: any) => {
                    return filterNode(input, option)
                }
            }
        }
    }, [config.filterable])

    return useMemo(() => {
        return <Select
            style={style}
            optionLabelProp="label"
            mode={type === types["select-multiple"] && 'multiple'}
            value={innerValue}
            onChange={innerChange}
            className={className}
            disabled={disabled}
            placeholder={item.placeholder}
            dropdownRender={dropdownRender}
            {...filterableProps}
            {...ridKeysConfig}
        >
            {options.map((option, index) => (
                <Select.Option
                    key={option[valuename]}
                    style={itemStyles[index]}
                    disabled={option.disabled}
                    label={option[labelname]}
                    value={option[valuename]}
                >
                    {option.option || option[labelname]}
                </Select.Option>
            ))}
        </Select>
    }, [style, type, labelname, valuename, filterableProps, itemStyles, innerChange, className, disabled, innerValue, item.placeholder, dropdownRender, ridKeysConfig, options])

}

export default FSelect