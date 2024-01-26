import { useState, useEffect, useCallback } from 'react'
import Preview from 'views/light/components/center/preview';
import ApiPage from 'services/page'
import { addParamsKeyPrefix, dataListToDesignList } from 'views/light/utils/util';
import { useDispatch } from 'react-redux';
import { setPageInfo } from 'slices/pageSlice';
import { Spin } from 'antd';
import { replaceOrAddQuery } from 'libs/utils';
import history from 'libs/history';
import { menus } from '.';

export default function PreviewLogin({ routerState, project: { projectId } }) {
    const [designList, setDesignList] = useState([])
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()

    const loadPage = useCallback(async (page) => {
        await dispatch(setPageInfo({ pageId: page.pageId }))
        if (page.pageDataList) {
            setDesignList(dataListToDesignList(JSON.parse(page.pageDataList)))
        } else {
            setDesignList([])
        }
        setLoading(false)
    }, [dispatch])

    useEffect(() => {
        setLoading(true)
        ApiPage.selectLogin({ projectId }).then(res => {
            res && loadPage(res)
        })
    }, [projectId, loadPage])

    if (loading) {
        return <Spin>
            <div style={{ height: '100vh', width: '100vh' }}></div>
        </Spin>
    }

    return <Preview designList={designList} historyPush={(path, params) => {
        const state = { ...params }
        history.replace(
            replaceOrAddQuery({ ...routerState, c: menus.base, active: path, ...addParamsKeyPrefix(state) },true)
        )
    }} />
}