import { Tree } from "antd";
import { getOriginalType } from "../../utils/base";
import React, { useCallback, useMemo } from "react";
import { ITreeProps } from "../../config/type";
import { useClassName, useOptions, useStyle, useChange, useDisabled, useConfig, useRidkeyConfig, useOptionNames } from "../../hooks/useBase";
import MarginLoadingOutlined from "../MarginLoadingOutlined";
import { names } from "../../config/props";

const ridKeys = [names.labelname, names.valuename, names.childrenname];

const types: any = {
    select: 'tree-select'
};

function FTree(props: ITreeProps) {
    const { item } = props

    const onChange = useChange(props)
    const style = useStyle(props)
    const disabled = useDisabled(props)
    const className = useClassName(props)
    const { options, loading } = useOptions(props)

    const type = getOriginalType(item)
    const config = useConfig(props)
    const ridKeysConfig = useRidkeyConfig(config, ridKeys)

    const { labelname, valuename, childrenname } = useOptionNames(config)

    const fieldNames = useMemo(() => {
        if (ridKeysConfig.fieldNames) {
            return ridKeysConfig.fieldNames
        }
        return {
            title: labelname,
            key: valuename,
            children: childrenname
        }
    }, [labelname, valuename, childrenname, ridKeysConfig.fieldNames])

    const dropdownRender = useCallback((menu: React.ReactNode) => {
        return loading ? <MarginLoadingOutlined /> : menu
    }, [loading])

    const rst = useMemo(() => {
        if (type === types.select) {
            return {
                checkable: true,
                checkedKeys: item.value,
                onCheck: onChange
            }
        } else {
            return {
                selectedKeys: item.value,
                onSelect: onChange
            }
        }
    }, [type, item.value, onChange])

    return useMemo(() => {
        return <Tree
            style={style}
            className={className}
            dropdownRender={dropdownRender}
            disabled={disabled}
            treeData={options}
            {...rst}
            {...ridKeysConfig}
            fieldNames={fieldNames}
        />
    }, [style, dropdownRender, className, disabled, options, rst, ridKeysConfig])


}
export default FTree