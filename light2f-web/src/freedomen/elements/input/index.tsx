import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input } from 'antd';
import { useChange, useClassName, useConfig, useDisabled, useEvent, useRidkeyConfig, useStyle } from '../../hooks/useBase';
import { getOriginalType } from '../../utils/base';
import { EChangeEventType, IInputProps } from '../../config/type';

const ridKeys = ['changeEventType']

const types: any = {
    'input': Input,
    'input-search': Input.Search,
    'input-area': Input.TextArea,
    'input-password': Input.Password
}

function FInput(props: IInputProps) {
    const { item } = props

    const [value, setValue] = useState<string>()
    const [blurValue, setBlurValue] = useState<string | null>(null)
    const innerRef = useRef<any>({ value: null, isFocus: false })
    const disabled = useDisabled(props)
    const className = useClassName(props)
    const style = useStyle(props)

    const config = useConfig(props)
    const ridKeysConfig = useRidkeyConfig(config, ridKeys)

    const onChange = useChange(props)
    const onEvent = useEvent(props)

    const type = getOriginalType(item)
    const Element = types[type] || Input;

    const { changeEventType = EChangeEventType.INPUT } = config

    useEffect(() => {
        if (item.value !== innerRef.current.value) {
            setValue(item.value)
        }
    }, [item.value])

    useEffect(() => {
        if (blurValue !== null) {
            onEvent(type === 'input-search' ? 'search' : 'pressEnter', blurValue)
            setBlurValue(null)
        }
    }, [blurValue, onEvent])

    const events = useMemo(() => {
        const params: any = {
            onChange: ({ target: { value } }: any) => {
                innerRef.current.value = value

                setValue(value)
                if (changeEventType === EChangeEventType.INPUT || !innerRef.current.isFocus) {
                    onChange(value);
                }
            },
            onPressEnter: ({ target: { value } }: any) => {
                if (changeEventType === EChangeEventType.BLUR) {
                    onChange(value)
                    setBlurValue(value)
                } else {
                    onEvent(type === 'input-search' ? 'search' : 'pressEnter', value);
                }
            }
        }
        if (type === 'input-search') {
            params.onSearch = (value: string) => {
                params.onPressEnter({ target: { value } })
            };
        }
        return params
    }, [type, changeEventType, onEvent, onChange])

    const onBlur = useCallback(() => {
        innerRef.current.isFocus = false

        if (changeEventType === EChangeEventType.BLUR && innerRef.current.value !== null) {
            onChange(value)
        }
    }, [changeEventType, value, onChange])

    return useMemo(() => {
        return <Element
            style={style}
            value={value}
            onBlur={onBlur}
            onFocus={() => {
                innerRef.current.isFocus = true
            }}
            disabled={disabled}
            className={className}
            placeholder={item.placeholder}
            {...events}
            {...ridKeysConfig}
        />
    }, [Element, style, value, onBlur, disabled, item.placeholder, className, events, ridKeysConfig])

}

export default FInput