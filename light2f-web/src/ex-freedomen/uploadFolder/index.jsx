import { useCallback, useEffect, useState } from 'react'
import styles from './index.module.less'
import user from 'services/user'
import { message } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import cns from 'classnames'

function UploadFolder(props) {
    const [folderName, setFolderName] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        props.value && setFolderName("文件上传成功， 点击修改")
    }, [props.value])

    const onChange = useCallback((files = []) => {
        if (files?.length) {
            const [homePath] = files[0].webkitRelativePath?.split("/")
            const paths = []
            let size = 0

            if (homePath) {
                const formData = new FormData()
                for (let file of files) {
                    size += file.size
                    paths.push(file.webkitRelativePath)
                    formData.append('files', file, file.webkitRelativePath?.replace(homePath, ""))
                }

                if (size > 50 * 1000 * 1024) {
                    message.error("文件过大，请小于50MB")
                    return
                }

                formData.append("homePath", homePath)

                if ((paths.includes(homePath + "/index.js") || paths.includes(homePath + "/index.jsx"))
                    && paths.includes(homePath + "/dist/index.js")
                ) {
                    setLoading(true)
                    user.upload(formData).then(res => {
                        setLoading(false)
                        // setFolderName(homePath)
                        props.onChange?.(res)
                    })

                    return
                }
            }
        }

        message.error("非合法组件，请确保当前目录至少包括index.js/jsx文件，以及dist/index.js文件")
    }, [props.onChange])

    return <div className={cns(styles.main, {
        [styles.hborder]: !props.disabled
    }
    )}>
        <label className={cns(styles.label, {
            [styles.disabled]: props.disabled
        })}>
            {loading
                ? <>努力上传中&nbsp; <LoadingOutlined /></>
                : (folderName ?
                    <div>
                        {folderName}
                    </div> :
                    <div className={cns(styles.info, {
                        [styles.disabled]: props.disabled
                    })}>
                        <div className={styles.title}>请选择文件夹</div>
                        <div className={styles.tip}>仅支持 Chrome 和 FireFox 浏览器，选择单个文件夹 </div >
                    </div>)
            }
            <input
                type="file"
                className={styles.fileInput}
                disabled={props.disabled}
                webkitdirectory=""
                directory=""
                multiple=""
                onChange={(e) => {
                    onChange(e.target.files)
                }}
            />
        </label>
    </div>
}


export const Upload = ({ value, $base: { onChange, disabled } }) => {
    return <UploadFolder value={value} onChange={onChange} disabled={disabled} />
}
