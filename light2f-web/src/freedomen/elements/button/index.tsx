import React, { useMemo } from "react";
import { Button } from "antd";
import { IButtonProps } from "../../config/type";
import { getOriginalType } from "../../utils/base";
import { useEvent, useStyle, useClassName, useDisabled, useFilter, useConfig } from "../../hooks/useBase";
import { clickType } from "../../config/props";

const types: any = {
    'button-primary': 'primary',
    'button-dashed': 'dashed',
    'button-text': 'text',
    'button-link': 'link'
}

function FButton(props: IButtonProps) {
    const { item } = props
    const onEvent = useEvent(props)
    const style = useStyle(props)
    const className = useClassName(props)
    const disabled = useDisabled(props)
    const filter = useFilter(props)
    const config = useConfig(props)

    const type = getOriginalType(item)
    const bType = types[type]
    
    return useMemo(() => { 
        return <Button
            type={bType}
            style={style}
            className={className}
            disabled={disabled}
            onClick={_ => onEvent(clickType, item.value)}
            {...config}
        >
            {filter}
        </Button>
    }, [onEvent, bType, style, className, item.value, disabled, filter, config]) 
}

export default FButton
