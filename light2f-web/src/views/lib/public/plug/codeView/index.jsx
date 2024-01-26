import { useEffect, useMemo, useRef, useState } from 'react';
import ApiPlug from 'services/plug';
import cn from 'classnames';
import { Spin } from 'antd';
import { getCode, parseURLParams } from 'libs/utils';
import { renderCode, renderLess } from 'components/codeText';
import styles from './index.module.less'

export default function CodeView() {
    const {
        id: plugUid
    } = parseURLParams()

    const [codeNames, setCodeNames] = useState([])
    const [loading, setLoading] = useState(false)
    const [active, setActive] = useState(null)
    const [code, setCode] = useState()
    const codeCache = useRef({})

    useEffect(() => {
        setLoading(true)
        plugUid && ApiPlug.codeNames(plugUid).then(res => {

            let active = res.find(item => {
                return item.endsWith("index.js")
                    || item.endsWith("index.jsx")
                    || item.endsWith("index.ts")
                    || item.endsWith("index.tsx")
            })
            if (active) {
                setActive(active)
            }
            setCodeNames(res)
        })
    }, [plugUid])

    useEffect(() => {
        if (codeNames.length) {
            if (codeCache.current[active] !== void 0) {
                setCode(codeCache.current[active])
            } else {
                setLoading(true)
                getCode(active).then(res => {
                    setLoading(false)
                    codeCache.current[active] = res.data
                    setCode(res.data)
                })
            }
        }
    }, [active, codeNames])

    const codeRender = useMemo(() => {
        if (!code) return null

        if (active?.endsWith("less")) {
            return renderLess({ value: code })
        } else {
            return renderCode({ value: code })
        }
    }, [code, active])

    return <div className={styles.main}>
        <div className={styles.header}>代码预览</div>
        <div className={styles.body}>
            <div className={styles.left}>
                {codeNames.map((el, index) => {
                    return <div key={index} onClick={() => setActive(el)} className={cn(styles.item, {
                        [styles.activeItem]: active === el
                    })} >
                        {el.substring(plugUid.length + 1)}
                    </div>
                })}
            </div>
            <div className={styles.center}>
                <Spin spinning={loading}>
                    {codeRender}
                </Spin>
            </div>
        </div>
    </div>
}