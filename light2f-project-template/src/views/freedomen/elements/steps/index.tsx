import React, { useMemo } from "react"
import { Steps } from "antd";
import { IStpesProps } from "../../config/type";
import { getOriginalType } from "../../utils/base";
import { useChange, useClassName, useConfig, useDisabled, useOptions, useOptionNames, useRidkeyConfig, useStyle } from "../../hooks/useBase"
import MarginLoadingOutlined from "../MarginLoadingOutlined";
import { names } from "../../config/props";

const ridKeys = [names.labelname, names.valuename]

const types: any = {
    'steps': 'horizontal',
    'steps-vertical': 'vertical'
}

export default function FSteps(props: IStpesProps) {
    const { item } = props

    const style = useStyle(props)
    const onChange = useChange(props)
    const disabled = useDisabled(props)
    const className = useClassName(props)
    const { options, loading } = useOptions(props)

    const config = useConfig(props)
    const ridKeysConfig = useRidkeyConfig(config, ridKeys)
    const type = types[getOriginalType(item)] || types.steps

    const { labelname, valuename } = useOptionNames(config)

    const menu = useMemo(() => {
        const index = options.findIndex(option => {
            return option[valuename] === item.value
        })
        const current = index === -1 ? 0 : index

        return {
            current,
            items: options.map(option => {
                return {
                    disabled,
                    value: option[valuename],
                    title: option[labelname],
                    ...option
                }
            }),
            onChange(c: any) {
                onChange(options[c][valuename])
            }
        }
    }, [options, disabled, item.value, onChange])

    return useMemo(() => {
        return loading ? <MarginLoadingOutlined /> :
            <Steps
                className={className}
                direction={type}
                style={style}
                {...menu}
                {...ridKeysConfig}
            />
    }, [menu, type, style, className, loading, ridKeysConfig])
}