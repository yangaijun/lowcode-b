import React, { useMemo } from "react";
import { Form } from "antd";
import util from '../../utils/util'
import { useStyle, useClassName, useConfig, useChildren } from "../../hooks/useBase";
import { emptyKey } from "../../config/props";

export interface formitemProps {
    children: React.ReactElement,
    item: any
}

export default function FFormItem(props: formitemProps) {
    const { item, item: { label, prop, rules, noStyle } } = props

    const style = useStyle(props)
    const className = useClassName(props)
    const config = useConfig(props)
    const children = useChildren(props)

    const name = useMemo(() => {
        return prop || util.getUUID()
    }, [prop])

    const isRequired = item[emptyKey]

    const required = useMemo(() => {
        return isRequired !== true && rules
    }, [isRequired, rules])

    return useMemo(() => { 
        return (
            <Form.Item
                name={name}
                rules={rules}
                style={style}
                label={label}
                noStyle={noStyle}
                className={className}
                required={required}
                {...config}
            >
                {children}
            </Form.Item>
        );
    }, [style, className, label, name, required, config, noStyle, rules, children])

}