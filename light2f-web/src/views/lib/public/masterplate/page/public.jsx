import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Dialog, Form, Region } from 'freedomen';
import ApiMasterplatePage from 'services/masterplate_page'
import { setLight } from 'slices/loadingSlice';
import styles from '../index.module.less'
import { TypeType } from 'views/light/types';
import classNames from 'classnames'
import user from 'libs/user';
import { openDialog } from './components';
import { message } from 'antd';

export default function PublicPage() {

    const [list, setList] = useState([])
    const dispatch = useDispatch()

    const loadData = useCallback(() => {
        dispatch(setLight(true))
        ApiMasterplatePage.select({ masterplatePageType: TypeType.public }).then(res => {
            setList(res)
            dispatch(setLight(false))
        })
    }, [])

    useEffect(() => {
        loadData()
    }, [])

    const getForm = useCallback((formData) => {
        return <Form
            data={formData}
            onSubmit={data => {
                Dialog.loading('masterplatePage')
                ApiMasterplatePage.insertOrUpdate(data).then(res => {
                    Dialog.close('masterplatePage') 
                    message.success("复制成功，到 我的 中查看")
                })
            }}
            columns={[
                { type: 'input', label: '母版名称', prop: 'masterplatePageName', rule: 'must', config: { maxLength: 12 } },
                { type: 'input-area', label: '描述', prop: 'masterplatePageDes', config: { maxLength: 255, rows: 5 } },
                { type: 'switch', prop: 'masterplatePageType', value: TypeType.private, label: '保密性', config: { help: '关闭后，其他人也可以使用', uncheckedValue: TypeType.public, checkedValue: TypeType.private, checkedChildren: '私有的', unCheckedChildren: '公共的' } },
                { type: 'switch', label: '设为缺省', prop: 'masterplatePageMaster', config: { checkedValue: 1, uncheckedValue: 0, help: "设为缺省后创建页面是默认选中" } },
            ]}
        />
    }, [])

    return <div className={styles.main}>
        <div className={styles.create} />
        <div className={styles.cards}>
            {
                list.map(el => <Region
                    key={el.masterplatePageId}
                    className={styles.card}
                    onEvent={params => {
                        if (params.prop === 'editStruct') {
                            openDialog(el)
                        } else if (params.prop === 'copy') {
                            Dialog.open('masterplatePage', { title: '复制母版', okText: '确定' })
                                .then(s => s(getForm({
                                    masterplatePageId: el.masterplatePageId,
                                    masterplatePageName: el.masterplatePageName + '复制',
                                    masterplatePageDes: el.masterplatePageDes,
                                    masterplatePageTmp: el.masterplatePageTmp,
                                    insertType: "copy"
                                })))
                        }
                    }}
                    data={el}
                    columns={[
                        {
                            type: 'text', prop: 'masterplatePageName', filter({ value, data }) {
                                if (data.userId === user.getUserId()) {
                                    return <><div className={classNames(styles.name, 'text-ellipsis')}>{value} </div><div className={styles.df}>self</div></>
                                } 

                                return value
                            }, className: styles.title
                        },
                        { type: 'text', prop: 'masterplatePageDes', className: styles.des },
                        { type: 'text', prop: 'createdAt', filter: "yyyy-MM-dd hh:mm", className: styles.date },
                        [
                            { type: 'button-link@small', prop: 'copy', value: '复制', className: styles.edit },
                            { type: 'button-link@small', prop: 'editStruct', value: '查看设计' },
                            { type: 'div', className: styles.bottom }
                        ]
                    ]}
                />)
            }
        </div>
    </div>
}