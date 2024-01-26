import React, { useMemo } from 'react';
import { InputNumber } from 'antd';
import { useChange, useClassName, useConfig, useDisabled, useStyle } from '../../hooks/useBase'; 
import { IInputNumberProps } from '../../config/type';
 
function FInputNumber(props: IInputNumberProps) {
    const { item } = props
    const disabled = useDisabled(props)
    const className = useClassName(props)
    const style = useStyle(props)
    const onChange = useChange(props)
    const config = useConfig(props)
    
    return useMemo(() => { 
        return <InputNumber
            disabled={disabled}
            className={className}
            style={style}
            value={item.value}
            onChange={onChange}
            {...config}
        />
    }, [disabled, className, style, item.value, onChange, config])

}

export default FInputNumber