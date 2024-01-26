import React from 'react';
import { Slider } from "antd";
import { getOriginalType } from "../../utils/base";
import { useMemo } from "react";
import { ISliderProps } from "../../config/type";
import { useClassName, useStyle, useFilter, useChange, useDisabled, useConfig } from "../../hooks/useBase";

const types: any = {
    'slider': false,
    'slider-range': true
}
 
function FSlider(props: ISliderProps) {
    const { item } = props

    const style = useStyle(props)
    const className = useClassName(props)
    const onChange = useChange(props)
    const filter = useFilter(props)
    const disabled = useDisabled(props)

    const config = useConfig(props)
    const type = getOriginalType(item)
    const rType = types[type];

    return useMemo(() => {
        return <Slider
            range={rType}
            value={filter}
            style={style}
            className={className}
            disabled={disabled}
            onChange={onChange}
            {...config}
        />
    }, [rType, filter, style, className, disabled, onChange, config])

}

export default FSlider