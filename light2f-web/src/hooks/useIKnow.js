import { Modal } from "antd"
import user from "libs/user"
import { useMemo } from "react"

export default function useIKnow(key, content = '我已知晓，当前浏览器中不再提示？') {
    const iKnow = user.getIknow(key)

    return useMemo(() => {
        return {
            iKnow,
            confirm() {
                Modal.confirm({
                    title: '提示',
                    content: content,
                    onOk() { user.setIknow(key) }
                })
            }
        }
    }, [iKnow, content])
}