import { message, Modal, Spin } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from './index.module.less';
import { getNextStep } from "./qas";

export default function Igpt(props) {
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)
    const stepRef = useRef(0)
    const divRef = useRef()
    const masteplateRef = useRef()
    const pageRef = useRef()

    const onNext = useCallback((next, current, loading) => {
        if (stepRef.current >= current) {
            message.info("你已经回答过了~")
        } else {
            //完成
            if (current === 10000) {
                message.success("创建完成，本次会话结束~")
                initalAi()
                props.onFinish?.()
                props.onChange?.(false)
            } else {
                if (loading !== undefined) {
                    setLoading(loading)
                }

                stepRef.current = current
                setList(list => [...list, ...next])
                return true
            }
        }
    }, [])

    const initalAi = useCallback(() => {
        setLoading(false)
        stepRef.current = 0

        setList(getNextStep(onNext, { masteplateRef, pageRef, stepRef }))
    }, [onNext])

    useEffect(() => {
        if (divRef.current) {
            divRef.current.scrollTo({ top: divRef.current.scrollHeight, behavior: "smooth" })
        }
    }, [list])

    useEffect(() => {
        initalAi()
    }, [onNext])

    return <Modal
        title="AI 智能创建项目（与小呆对话中）"
        afterClose={initalAi}
        open={props.open}
        width={1024}
        maskClosable={false}
        footer={null}
        onCancel={() => {
            props.onChange?.(false)
        }}>
        <Spin spinning={loading}>
            <div className={styles.content} ref={divRef}>
                {
                    list.map((el, index) => {
                        return el.type === 'ai' ? <div key={index} className={styles.ai}>
                            <div className={styles.line}>
                                <div className={styles.name}>小呆</div>
                                <div className={styles.text}>
                                    {el.text}
                                </div>
                            </div>
                            <div className={styles.dom}>
                                {el.dom}
                            </div>
                        </div> : <div key={index} className={styles.me}>
                            <div className={styles.line}>
                                <div className={styles.name}>我</div>
                                <div className={styles.text}>
                                    {el.text}
                                </div>
                            </div>
                            {el.dom && <div className={styles.dom}>
                                {el.dom}
                            </div>}
                        </div>
                    })
                }
            </div>
        </Spin>
    </Modal>
}