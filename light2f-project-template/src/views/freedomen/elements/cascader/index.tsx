import React, { useCallback, useMemo } from "react";
import { useClassName, useOptions, useStyle, useChange, useDisabled, useConfig, useOptionNames, useRidkeyConfig } from "../../hooks/useBase";
import { Cascader } from "antd";
import { ICascaderProps } from "../../config/type";
import MarginLoadingOutlined from "../MarginLoadingOutlined";
import { names } from "../../config/props";

const ridKeys = [names.labelname, names.valuename, names.childrenname];

function FCascader(props: ICascaderProps) {
    const { item } = props

    const style = useStyle(props)
    const onChange = useChange(props)
    const disabled = useDisabled(props)
    const className = useClassName(props)
    const { options, loading } = useOptions(props)
    const config = useConfig(props)
    const ridKeysConfig = useRidkeyConfig(config, ridKeys)

    const { labelname, valuename, childrenname } = useOptionNames(config)

    const fieldNames = useMemo(() => {
        if (ridKeysConfig.fieldNames) {
            return ridKeysConfig.fieldNames
        }
        return {
            label: labelname,
            value: valuename,
            children: childrenname
        }
    }, [labelname, valuename, childrenname, ridKeysConfig.fieldNames])

    const dropdownRender = useCallback((menu: React.ReactNode) => {
        return loading ? <MarginLoadingOutlined /> : menu
    }, [loading])


    return useMemo(() => {
        return <Cascader
            style={style}
            className={className}
            options={options}
            disabled={disabled}
            value={item.value}
            onChange={onChange}
            placeholder={item.placeholder}
            dropdownRender={dropdownRender}
            {...ridKeysConfig}
            fieldNames={fieldNames}
        />
    }, [style, item.value, item.placeholder, onChange, disabled, className, options, fieldNames, ridKeysConfig, dropdownRender])
}

export default FCascader