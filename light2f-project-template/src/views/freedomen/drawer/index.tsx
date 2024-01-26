import React, { useRef, useCallback, useEffect, useState } from "react";
import { Button, Drawer, Space } from "antd";
import Form from "../form";
import { IDrawerProps } from "../config/type";

const drawerStack: any = {}

const ridkeys = ['cancelButtonProps', 'okButtonProps', 'cancelText', 'okText']

function ridConfig(config = {}, ridkeys: string[]) {
    const newConfig: any = {
        ...config
    }
    ridkeys.forEach(key => {
        delete newConfig[key]
    })
    return newConfig
}
interface IFDrawerProps extends IDrawerProps {
    cancelText?: string;
    okText?: string;
}
const FDrawer = (props: IFDrawerProps) => {
    const { name, children, onOk, onCancel, noForm, cancelText, okText, config, ...restProps } = props

    const innerForm = useRef<any>()
    const findForm: any = useCallback((content: any) => {
        if (noForm === true) return content

        if (content) {
            return React.Children.map(content, (child) => {
                if (child?.type === Form) {
                    return React.cloneElement(child, {
                        ref: (r: any) => {
                            if (child.ref) {
                                if (typeof child.ref === 'function') {
                                    child.ref(r)
                                } else {
                                    child.ref.current = r
                                }
                            }
                            innerForm.current = r
                        }
                    })
                } else if (child?.props?.children) {
                    return React.cloneElement(
                        child,
                        undefined,
                        findForm(child.props?.children)
                    )
                } else {
                    return child
                }
            })
        } else {
            return null
        }
    }, [noForm])

    const [drawerProps, setDrawerProps] = useState<any>()
    const [drawerContent, setModalContent] = useState<any>()

    const setProps = useCallback((props: any) => {
        setDrawerProps((dps: any) => {
            return { ...dps, ...props }
        })
    }, [])

    const hander = useCallback((fn?: Function) => {
        const back = fn && fn();

        if (back === undefined) {
            setProps({ open: false })
        }
    }, [setProps])

    const handerOnCancel = useCallback(() => {
        hander(onCancel)
    }, [hander, onCancel])

    const handerOnOk = useCallback(() => {
        if (innerForm.current) {
            innerForm.current.submit()
            return;
        }
        hander(onOk)
    }, [hander, onOk])

    const setContent = useCallback((content: any) => {
        setModalContent(findForm(content))
    }, [findForm])

    useEffect(() => {
        setModalContent(findForm(children))
    }, [children, findForm])

    useEffect(() => {
        if (name) {
            drawerStack[name] = { setContent, setProps }

            return () => {
                delete drawerStack[name]
            }
        }
    }, [name, setContent, setProps])

    useEffect(() => {
        if (!drawerProps?.open) {
            setProps({ okButtonProps: { loading: false } })
        }
    }, [drawerProps?.open, setProps])

    const icancelText = cancelText || config?.cancelText || drawerProps?.cancelText || '取消'
    const iokText = okText || config?.okText || drawerProps?.okText || '确定'

    const ridKeysConfig = ridConfig(restProps, ridkeys)

    return (
        <Drawer
            destroyOnClose
            onClose={handerOnCancel}
            extra={
                <Space>
                    <Button
                        onClick={handerOnCancel}
                        {...config?.cancelButtonProps}
                        {...drawerProps?.cancelButtonProps}
                    >
                        {icancelText}
                    </Button>
                    <Button
                        type="primary"
                        onClick={handerOnOk}
                        {...config?.okButtonProps}
                        {...drawerProps?.okButtonProps}
                    >
                        {iokText}
                    </Button>
                </Space>
            }
            {...ridKeysConfig}
            {...drawerProps}
        >
            {drawerContent}
        </Drawer>
    );
}

FDrawer.open = (name: string, props?: string | IDrawerProps) => {
    if (drawerStack[name]) {
        const drawer = drawerStack[name]
        const { setContent, setProps } = drawer
        const newProps = typeof props === 'string' ? { title: props } : props
        setProps({ open: true, ...newProps })

        return Promise.resolve(setContent)
    }
}

FDrawer.close = (name: string) => {
    if (drawerStack[name]) {
        const drawer = drawerStack[name]
        const { setProps } = drawer

        setProps({ open: false })
    }
}

FDrawer.loading = (name: string, loading = true) => {
    if (drawerStack[name]) {
        const drawer = drawerStack[name]
        const { setProps } = drawer

        setProps({ okButtonProps: { loading } })
    }
}

export default FDrawer