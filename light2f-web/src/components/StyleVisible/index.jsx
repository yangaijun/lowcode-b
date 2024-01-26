import { Form } from 'freedomen'
import styles from './index.module.less'

export default function StyleVisible() {
    return <div className={styles.main}>
        <Form 
            config={{size: "small"}}
            columns={[
                {type: ""}
              
            ]}
        />
    </div>
}