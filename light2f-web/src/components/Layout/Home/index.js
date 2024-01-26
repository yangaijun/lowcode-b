import { useEffect } from 'react';
import styles from './index.module.less';
import Header from '../../Header'
import { useMemo } from 'react';

const homePath = '/home'

export default function HomeLayout(props) {
    const { location: { pathname } } = props.history
    
    useEffect(() => {
        if (pathname === '/') {
            props.history.push(homePath)
        }
    }, [pathname, props.history])

    const isHome = useMemo(() => pathname === homePath, [pathname])

    return (
        <div className={styles.main}>
            <Header history={props.history} isHome={isHome} />
            <div className={styles.center}>
                {props.children}
            </div>
        </div>
    )
}