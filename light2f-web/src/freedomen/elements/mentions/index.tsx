import React, { useMemo } from "react";
import { Mentions } from "antd";
import { IMentionsProps } from "../../config/type";
import { useClassName, useOptions, useStyle, useChange, useDisabled, useConfig, useItemStyle, useOptionNames, useRidkeyConfig } from "../../hooks/useBase";
import { names } from "../../config/props";

const ridKeys = [names.labelname, names.valuename]

function FMentions(props: IMentionsProps) {
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

    const mentionOptions = useMemo(() => {
        return options.map((option: any, i: number) => {
            return { 
                value: option[valuename],
                label: option.option || option[labelname],
                style: itemStyles[i],
                ...option
            }
        })
    }, [options, itemStyles, valuename, labelname])

    return useMemo(() => {
        return <Mentions
            style={style}
            options={mentionOptions}
            className={className}
            loading={loading}
            placeholder={item.placeholder}
            disabled={disabled}
            value={item.value}
            onChange={onChange}
            {...ridKeysConfig}
        />
    }, [style, item.value, mentionOptions, item.placeholder, onChange, disabled, className, ridKeysConfig])
}

export default FMentions