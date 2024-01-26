import { Modal, ModalProps } from "antd";
import Form from "../form";
import React, { useRef, useCallback, useEffect, useState } from "react";
import { IDialogProps } from "../config/type";

const dialogStack: any = {}

const FDialog = (props: IDialogProps) => {
    const { name, children, onOk, onCancel, noForm, config, ...restProps } = props

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

    const [modalProps, setModalProps] = useState<ModalProps>()
    const [modalContent, setModalContent] = useState<any>()

    const setProps = useCallback((props: ModalProps) => {
        setModalProps((mps: any) => {
            return { ...mps, ...props }
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
            dialogStack[name] = { setContent, setProps }

            return () => {
                delete dialogStack[name]
            }
        }
    }, [name, setContent, setProps])

    useEffect(() => {
        if (!modalProps?.open) {
            setProps({ okButtonProps: { loading: false } })
        }
    }, [modalProps?.open, setProps])

    return (
        <Modal
            destroyOnClose
            {...restProps}
            {...config}
            {...modalProps}
            onCancel={handerOnCancel}
            onOk={handerOnOk}
        >
            {modalContent}
        </Modal>
    );
}

FDialog.open = (name: string, props?: string | IDialogProps) => {
    if (dialogStack[name]) {
        const modal = dialogStack[name]
        const { setContent, setProps } = modal
        const newProps = ((typeof props === 'string') ? { title: props } : props)
        setProps({ open: true, ...newProps })

        return Promise.resolve(setContent)
    }
}

FDialog.close = (name: string) => {
    if (dialogStack[name]) {
        const modal = dialogStack[name]
        const { setProps } = modal

        setProps({ open: false })
    }
}

FDialog.loading = (name: string, loading = true) => {
    if (dialogStack[name]) {
        const modal = dialogStack[name]
        const { setProps } = modal

        setProps({ okButtonProps: { loading } })
    }
}

export default FDialog