import styles from './index.module.less';
import { useSelector } from 'react-redux';
import { Spin } from 'antd';

export default function MainLayout(props) {
    const { light } = useSelector(selector => selector.loading)
    
    return <div className={styles.main}>
        <div className={styles.content}> 
            <Spin spinning={light}>
                {props.children}
            </Spin>
        </div>
    </div>
}