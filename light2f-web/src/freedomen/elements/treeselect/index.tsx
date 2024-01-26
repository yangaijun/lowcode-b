import React, { useCallback, useMemo } from "react";
import { TreeSelect } from "antd";
import { filterNode, getOriginalType } from "../../utils/base";
import { ITreeSelectProps } from "../../config/type";
import { useClassName, useOptions, useStyle, useChange, useDisabled, useConfig, useRidkeyConfig, useOptionNames } from "../../hooks/useBase";
import MarginLoadingOutlined from "../MarginLoadingOutlined";
import { names } from "../../config/props";

const ridKeys = ['filterable', names.labelname, names.valuename, names.optionvalue, names.childrenname];

const types: any = {
    select: 'treeselect-multiple'
};

function FTreeSelect(props: ITreeSelectProps) {
    const { item } = props

    const onChange = useChange(props)
    const style = useStyle(props)
    const disabled = useDisabled(props)
    const className = useClassName(props)
    const { options, loading } = useOptions(props)

    const config = useConfig(props)
    const ridKeysConfig = useRidkeyConfig(config, ridKeys)
    const type = getOriginalType(item)

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

    const filterableProps = useMemo(() => {
        if (config.filterable) {
            return {
                showSearch: true,
                filterTreeNode: (input = '', option: any) => { 
                    return filterNode(input, option)
                }
            }
        }
    }, [config.filterable])

    return useMemo(() => {
        return <TreeSelect
            style={style}
            value={item.value}
            disabled={disabled}
            className={className}
            onChange={onChange}
            treeData={options}
            placeholder={item.placeholder}
            dropdownRender={dropdownRender}
            treeCheckable={type === types.select}
            {...filterableProps}
            {...ridKeysConfig}
            fieldNames={fieldNames}
        />
    }, [style, item.placeholder, filterableProps, dropdownRender, className, disabled, type, item.value, onChange, options, ridKeysConfig, fieldNames])

}

export default FTreeSelect