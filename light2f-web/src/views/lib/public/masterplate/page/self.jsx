import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Dialog, Form, Region } from 'freedomen';
import { PlusCircleOutlined } from "@ant-design/icons";
import ApiMasterplatePage from 'services/masterplate_page'
import { setLight } from 'slices/loadingSlice';
import { Button, Modal } from "antd";
import classNames from 'classnames'
import styles from '../index.module.less'
import { openDialog } from './components';
import user from 'libs/user';
import { TypeType } from 'views/light/types';

export default function SelfPage() {
    const [list, setList] = useState([])
    const dispatch = useDispatch()

    const loadData = useCallback(() => {
        dispatch(setLight(true))
        ApiMasterplatePage.selectSelf().then(res => {
            setList(res)
            dispatch(setLight(false))
        })
    }, [])

    useEffect(() => {
        loadData()
    }, [])

    const load = ({ data }) => {
        return user.getUserId() === data.userId || data.masterplatePageType !== TypeType.system
    }

    const getForm = useCallback((formData) => {
        return <Form
            data={formData}
            onSubmit={data => {
                Dialog.loading('masterplatePage')
                ApiMasterplatePage.insertOrUpdate(data).then(res => {
                    Dialog.close('masterplatePage')
                    dispatch(setLight(true))
                    loadData()
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
        <div className={styles.create}>
            <div className={styles.tips}>
                提示：主要作用是将相似页面的结构与逻辑抽离到此，而快速应用于各个相似页面，是自定义风格并高效开发的重要方案
            </div>
            <Button type="primary" shape="round" icon={<PlusCircleOutlined />} onClick={() => {
                Dialog.open('masterplatePage', { title: '新增', okText: '确定' }).then(s => s(getForm()))
            }}>新建</Button>
        </div>
        <div className={styles.cards}>
            {
                list.map(el => <Region
                    key={el.masterplatePageId}
                    className={styles.card}
                    onEvent={params => {
                        if (params.prop === 'editStruct') {
                            openDialog(el)
                        } else if (params.prop === 'edit') {
                            Dialog.open('masterplatePage', { title: '编辑', okText: '确定' }).then(s => s(getForm(params.row)))
                        } else if (params.prop === 'copy') {
                            Dialog.open('masterplatePage', { title: '复制母版', okText: '确定' })
                                .then(s => s(getForm({
                                    masterplatePageId: params.row.masterplatePageId,
                                    masterplatePageName: params.row.masterplatePageName + '复制',
                                    masterplatePageDes: el.masterplatePageDes,
                                    masterplatePageTmp: el.masterplatePageTmp,
                                    insertType: "copy"
                                })))
                        } else if (params.prop === 'del') {
                            Modal.confirm({
                                content: '确定要删除此页面母版么？',
                                onOk() {
                                    ApiMasterplatePage.delete(params.row).then(res => {
                                        loadData()
                                    })
                                }
                            })
                        }
                    }}
                    data={el}
                    columns={[
                        {
                            type: 'text', prop: 'masterplatePageName', filter({ value, data }) {
                                let rightRender = null
                                if (data.masterplatePageMaster === 1) {
                                    rightRender = <div className={styles.df}>缺省</div>
                                } else if (data.masterplatePageType === TypeType.system) {
                                    rightRender = <div className={styles.sys}>系统预定义</div>
                                }
                                return <>
                                    <div className={classNames(styles.name, 'text-ellipsis')}>
                                        {value}
                                    </div>
                                    {rightRender}
                                </>
                            }, className: styles.title
                        },
                        { type: 'text', prop: 'masterplatePageDes', className: styles.des },
                        { type: 'text', prop: 'createdAt', filter: "yyyy-MM-dd hh:mm", className: styles.date },
                        [
                            { type: 'button-link@small', prop: 'copy', value: '复制', className: styles.edit },
                            { type: 'button-link@small', prop: 'edit', value: '编辑', load },
                            { type: 'button-link@small', prop: 'del', value: '删除', load, config: { danger: true } },
                            { type: 'button-link@small', prop: 'editStruct', filter: (params) => load(params) ? '结构设计' : '查看设计' },
                            { type: 'div', className: styles.bottom }
                        ]
                    ]}
                />)
            }
        </div>
    </div>
}