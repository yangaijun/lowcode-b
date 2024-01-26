import { useEffect, useState, useCallback } from 'react'
import { Form } from 'freedomen'
import ApiUser from 'services/user'
import styles from './index.module.less'
import { message } from 'antd'
import user from 'libs/user'
import { useDispatch } from 'react-redux'
import { setUserInfo as setUInfo } from 'slices/temporarySlice'

export default function Info() {
    const [userInfo, setUserInfo] = useState({})
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const loadInfo = useCallback(() => {
        ApiUser.info().then(res => {
            setUserInfo(res)
        })
    }, [])

    const onSubmit = useCallback((data) => {
        //不处理密码
        delete data.userPassword
        setLoading(true)
        ApiUser.update(data).then(res => {
            message.success('更新成功！')
            user.setUserName(res.userName)
            user.setUserAvatar(res.userAvatar)

            dispatch(setUInfo({
                userName: res.userName,
                userAvatar: res.userAvatar
            }))

            setLoading(false)
        })
    }, [loadInfo])

    useEffect(() => {
        loadInfo()
    }, [loadInfo])

    return (<div className={styles.main}>
        <div className={styles.title}>个人信息</div>
        <Form
            data={userInfo}
            onSubmit={onSubmit}
            config={{ layout: 'vertical' }}
            className={styles.form}
            columns={[
                { type: 'upload-img', label: '头像', prop: 'userAvatar', config: { accept: 'image/*', filesize: .5 } },
                { type: 'input', label: '帐号（邮箱）', prop: 'userEmail', placeholder: '请输入邮箱', disabled: true, rule: 'empty,email' },
                { type: 'input', label: '昵称', prop: 'userName', placeholder: '请输入昵称', rule: { name: '请正确输入昵称' }, config: { maxLength: 12 } },
                { type: 'input', label: '手机号码', prop: 'userPhone', placeholder: '请输入手机号码', rule: 'empty,phone', config: { maxLength: 11 } },
                { type: 'select', label: '职业', prop: 'userMajor', placeholder: '请选择工作类型', options: "前端工程师,后端工程师,设计师,产品经理,运营,测试,其它" },
                { type: 'button-primary', prop: '$submit', value: '保存', config: { loading } }
            ]}
        />
    </div>)
}