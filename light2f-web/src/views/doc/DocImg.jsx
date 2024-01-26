import { Image } from 'antd'
import styles from './docImg.module.less'

const defaultImgBaseUrl = 'https://flightdoc-1256372626.cos.ap-nanjing.myqcloud.com/'

export default function DocImg({ name, text, height }) {
    return <div className={styles.imgBox}>
        <Image
            className={styles.itemImg}
            height={height}
            src={defaultImgBaseUrl + name} 
        />
        <div className={styles.des}>
            {text}
        </div>
    </div>
}