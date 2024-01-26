import { useEffect, useState } from 'react'
import { RightOutlined, DownOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import styles from './index.module.less'
//item: { title, children }
export default function Collapse({ items, openIndex, onChange }) {
    const [openKey, setOpenKey] = useState(openIndex)

    useEffect(() => {
        setOpenKey(openIndex)
    }, [openIndex])

    return items.map((item, key) => {
        return <div key={key} className={styles.item}>
            <div className={classNames(styles.title, {
                [styles.titleMore0]: key > 0,
                [styles.title0Open]: key > 0 && openKey === 0
            })}>
                <div> {item.title} </div>
                <div className={styles.right} onClick={() => {
                    onChange(k => k === key ? null : key)
                }}>
                    {openKey === key ? <DownOutlined /> : <RightOutlined />}
                </div>
            </div>
            <div
                className={styles.list}
                style={{ height: openKey === key ? 'auto' : 0, padding: openKey === key ? '4px 4px 0 0' : 0 }}
            >
                {item.children}
            </div>
        </div>
    })
}