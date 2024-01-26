import React, { useMemo } from "react";
import { Button, Dropdown } from "antd";
import { getOriginalType } from "../../utils/base";
import { clickType, names } from "../../config/props";
import { useStyle, useClassName, useDisabled, useEvent, useOptions, useConfig, useRidkeyConfig, useOptionNames } from "../../hooks/useBase";
import { DownOutlined } from "@ant-design/icons";
import { IDropdownProps } from "../../config/type";
import MarginLoadingOutlined from "../MarginLoadingOutlined";

const ridKeys = ['content', names.labelname, names.valuename]
const types: any = {
    'dropdown': 1,
    'dropdown-a': 2,
    'dropdown-primary': 3
}

const DEFAULT_TEXT = "请选择"

function FDropdown(props: IDropdownProps) {
    const { item } = props
    const onEvent = useEvent(props)
    const style = useStyle(props)
    const className = useClassName(props)
    const disabled = useDisabled(props)
    const { options, loading } = useOptions(props)

    const config = useConfig(props)
    const ridKeysConfig = useRidkeyConfig(config, ridKeys)

    const { labelname, valuename } = useOptionNames(config)

    let type = getOriginalType(item)
    const dType = types[type]

    const menu = useMemo(() => {
        return loading ? {
            items: [{ key: 'loading', label: <MarginLoadingOutlined /> }]
        } : {
            items: options.map((option, key) => {
                return {
                    key,
                    label: option[labelname],
                    ...option
                }
            }),
            onClick({ key }: any) {
                onEvent(clickType, options[Number(key)][valuename]);
            }
        }
    }, [options, loading, labelname, valuename])

    const children = useMemo(() => {
        const itemText = <span>{item.text || DEFAULT_TEXT} <DownOutlined /></span>
        const { content, size } = config

        if (content) return content

        const bType: any = dType === types['dropdown-a'] ? 'link' : dType === types['dropdown-primary'] ? 'primary' : undefined

        return <Button size={size} type={bType} > {itemText} </Button>
    }, [dType, item.text, config])

    return useMemo(() => {
        return <Dropdown
            menu={menu}
            style={style}
            className={className}
            disabled={disabled}
            {...ridKeysConfig}
        >
            {children}
        </Dropdown>
    }, [menu, style, className, disabled, options, onEvent, ridKeysConfig, valuename, children])
}

export default FDropdown