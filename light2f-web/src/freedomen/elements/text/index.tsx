import React from "react";
import { Tooltip } from "antd";
import { getOriginalType } from "../../utils/base";
import { useMemo } from "react";
import { getStringLen, getSubString } from "../../utils/util";
import { ITextProps } from "../../config/type";
import { useClassName, useStyle, useFilter, useEvent, useConfig, useRidkeyConfig } from "../../hooks/useBase";
import { clickType } from "../../config/props";

const defaultDomName = 'span'
const ridKeys = ['tooltip', 'maxlength'];

function FText(props: ITextProps) {
    const { item } = props

    const onEvent = useEvent(props)
    const style = useStyle(props)
    const className = useClassName(props)
    const filter = useFilter(props)

    const config = useConfig(props)
    const ridKeysConfig = useRidkeyConfig(config, ridKeys)
    const type = getOriginalType(item)

    const { maxlength, tooltip } = config

    const domName = useMemo(() => {
        const tempType = type.split('-')
        if (tempType.length >= 2) return tempType[1]
        return defaultDomName
    }, [type])

    const subText = useMemo(() => { 
        let filterLen = getStringLen(filter)

        if (maxlength && filterLen && maxlength < filterLen) {
            return getSubString(filter, maxlength)
        }
    }, [filter, maxlength])

    return useMemo(() => {
        const Element = React.createElement(
            domName,
            {
                style,
                className,
                onClick: () => {
                    onEvent(clickType, item.value)
                },
                ...ridKeysConfig
            },
            subText || filter
        );

        if (subText && tooltip !== false) {
            return <Tooltip title={filter}>
                {Element}
            </Tooltip>
        } else {
            return Element
        }

    }, [domName, style, item.value, className, onEvent, subText, filter, tooltip, ridKeysConfig])
}

export default FText

