import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, Tag } from 'antd'
import { getOriginalType } from '../../utils/base';
import { PlusOutlined } from '@ant-design/icons';
import util from '../../utils/util';
import { useChange, useClassName, useConfig, useItemStyle, useRidkeyConfig, useStyle } from '../../hooks/useBase';

const ridKeys = ['maxcount', 'maxlength'];

const types: any = {
    'tags-close': 'tags-close',
    'tags-create': 'tags-create'
}

export default function FTags(props: any) {
    const { item, item: { value, text = "新建" } } = props

    const [inputVisible, setInputVisible] = useState(false)
    const [inputValue, setInputValue] = useState("")

    const inputRef = useRef<any>()
    const onChange = useChange(props)

    const className = useClassName(props)
    const style = useStyle(props)
    const type = getOriginalType(item)
    const config = useConfig(props)
    const ridKeysConfig = useRidkeyConfig(config, ridKeys)
    const { maxcount = 999, maxlength } = config

    const innerValue = useMemo(() => {
        return value || []
    }, [value])

    const itemStyles = useItemStyle(props, innerValue)

    const onInputChange = useCallback(({ target: { value } }: any) => {
        setInputValue(value);
    }, [])

    const onEditInputConfirm = useCallback(() => {
        if (inputValue !== '') {
            onChange([
                ...innerValue,
                inputValue
            ])
        }
        setInputValue("")
        setInputVisible(false)

    }, [inputValue, innerValue, onChange])

    const showInput = useCallback(() => {
        setInputVisible(true)
    }, [])

    const closable = useMemo(() => {
        return type === types['tags-close'] || type === types['tags-create']
    }, [type])

    const isCreate = useMemo(() => {
        return type === types['tags-create'] && innerValue.length < maxcount
    }, [type, innerValue, maxcount])

    useEffect(() => {
        if (inputVisible) {
            inputRef.current.focus()
        }
    }, [inputVisible])

    return useMemo(() => {
        return <div className={className} style={{ display: 'flex', ...style }}>
            {innerValue.map((option: any, index: number) => (
                <Tag
                    key={util.getUUID()}
                    closable={closable}
                    {...ridKeysConfig}
                    className={className}
                    style={itemStyles[index]}
                    onClose={_ => {
                        const nextValue = [...innerValue]
                        nextValue.splice(index, 1);
                        onChange(nextValue);
                    }}
                >
                    {option}
                </Tag>
            ))}
            {
                isCreate ? <>
                    {
                        inputVisible ? <Input
                            type="text"
                            size="small"
                            value={inputValue}
                            style={{ width: 80, verticalAlign: 'top' }}
                            ref={inputRef}
                            onChange={onInputChange}
                            maxLength={maxlength}
                            onBlur={onEditInputConfirm}
                            onPressEnter={onEditInputConfirm}
                        /> : <Tag style={{ backgroundColor: 'white', borderStyle: 'dashed' }} onClick={showInput} >
                            <PlusOutlined /> {text}
                        </Tag>
                    }
                </> : null
            }
        </div>
    }, [innerValue, className, style, itemStyles, isCreate, ridKeysConfig, closable, maxlength, inputVisible, inputValue, onInputChange, onEditInputConfirm, showInput, text, onChange])
}