import { Region } from 'freedomen'
import { Divider } from 'antd'
import { useCallback } from 'react'
import { hotkeyLabel } from '../component/doc'
import ILink from 'components/ILink'
import styles from './index.module.less'

export default function Index() {
    // const [lis, setLis] = useState(allLis)

    const onEvent = useCallback((params) => {
        if (params.type === 'pressEnter' || params.type === 'search') {
            // if (params.value === '') {
            //     setLis(allLis)
            // } else {
            //     const newLis = allLis.filter(el => el.title.includes(params.value))
            //     setLis(newLis)
            // }
        }
    }, [])

    return (
        <div className={styles["document-body"]}>
            <Region
                onEvent={onEvent}
                columns={[
                    { type: 'input-search@small', prop: 'search', placeholder: '请输入相关名称', config: { allowClear: true } }
                ]}
            />
            <Divider className={styles["doc-line"]} />
            <div className={styles["document-body-apis"]}>
                {hotkeyLabel}
                <ILink url={'/doc/light/fapi'} style={{ marginLeft: 6 }} fontSize={12}>内置API</ILink>
            </div>
        </div>
    )
}