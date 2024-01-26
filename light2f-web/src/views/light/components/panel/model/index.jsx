import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, message, Modal, notification, Popover, Space, Tooltip } from 'antd'
import { canPutIn, dataListToDesignList } from 'views/light/utils/util'
import ApiComponent from 'services/component'
import { useDispatch, useSelector } from 'react-redux'
import Bus, { BUS_KEYS } from 'views/light/bus'
import { openPage } from 'slices/temporarySlice'
import { customModelLabel } from '../component/doc'
import ILink from 'components/ILink'
import { setInitCodeInfo, setServiceInfo } from 'slices/pageSlice'
import { Dialog, Form } from 'freedomen'
import { FdGlobalDataEditor } from 'components/Editors'
import { flatten, cloneDeep } from 'lodash'
import { InitCodeType } from 'views/light/types'
import { ReactSortable } from 'react-sortablejs';
import { replaceInstructStr, toInitCodeStates } from 'views/light/utils/icode'
import { getComponentForm } from '../../center/design/CreateComponentInfo'
import classNames from 'classnames'
import Collapse from '../../components/collapse'
import EmptyList from '../../components/emptyList'
import { getDialogNames, getDrawerNames } from '../component/renders'
import { setLight } from 'slices/loadingSlice'
import config from 'config'
import styles from './index.module.less'

const modifyDialogName = "modifyDialog"

export default function Model({ activityColumn }) {
    const [openIndex, setOpenIndex] = useState(0)
    const [customList, setCustomList] = useState([])
    const [systemList, setSystemList] = useState([])
    //添加模块表单的 relation 对象数据
    const componentRelationRef = useRef()
    const { pageId, initCodes, services, model: { customs, systems } } = useSelector(state => state.page)
    const { projectId } = useSelector(state => state.project)
    const { hasPermission } = useSelector(state => state.temporary)
    const dispatch = useDispatch()

    useEffect(() => {
        setCustomList(cloneDeep(customs))
        setSystemList(cloneDeep(systems))

        if (customs.length) {
            setOpenIndex(0)
        } else if (systems.length) {
            setOpenIndex(1)
        }
    }, [customs, systems])

    //模块是不是有使用到 api
    const setUseApi = useCallback((children, apiNames) => {
        const setApiNames = (str, names) => {
            let start = str.indexOf("$api.")
            if (start !== -1) {
                start += 5
                let sub = str.substring(start)
                let end = sub.indexOf("(")
                if (end !== -1) {
                    let name = sub.substring(0, end)
                    names.push(name)

                    setApiNames(sub.substring(end), names)
                }
            }
        }

        for (let item of children) {
            for (let key in item.data) {
                const value = item.data[key]
                if (typeof value === 'string' && value.includes("$api.")) {
                    setApiNames(value, apiNames)
                }
            }
            if (Array.isArray(item.children)) {
                setUseApi(item.children, apiNames)
            }
        }
    }, [])

    const replaceUseApi = useCallback((children, originAndNew) => {
        for (let item of children) {
            for (let key in item.data) {
                let value = item.data[key]
                if (typeof value === 'string') {
                    for (let origin in originAndNew) {
                        value = value.replaceAll("\$api." + origin, "\$api." + originAndNew[origin])
                    }
                    item.data[key] = value
                }
            }
            if (Array.isArray(item.children)) {
                replaceUseApi(item.children, originAndNew)
            }
        }
    }, [])

    const onUseSubmit = useCallback((data, dataList, relations) => {
        try {
            const temps = (new Function('return (' + data.temps + ')'))()
            function getOriginName(name) {
                return (new Function('$temp', 'return ' + name))(temps)
            }

            const instructs = []
            for (let key in temps) {
                instructs.push(["$temp." + key, temps[key]])
            }
            function replaceAllInstructs(str) {
                if (!str)
                    return str
                return replaceInstructStr(str, instructs)
            }

            const { $vars = [], $fns = [], $effects = [], $refs = [], $apis = [], $dialogs = [], $drawers = [] } = relations

            const names = initCodes.concat(toInitCodeStates(Bus.get(BUS_KEYS.designDataList)))
                .map(c => c.initCodeName)

            const listInitCodes = [], count = { var: 0, fn: 0, effect: 0, ref: 0 }

            function pushInitCodes(item) {
                listInitCodes.push({
                    ...item,
                    initCodeEffect: item.initCodeEffect ? JSON.stringify(item.initCodeEffect) : undefined
                })
            }
            for (let item of $vars) {
                const originName = getOriginName(item.name)
                if (item.isCreate) {
                    if (names.includes(originName))
                        return message.error(`当前页面已经存在变量：${originName}`)
                    else if (!item.isAutoCreate) {
                        count.var++
                        pushInitCodes({
                            pageId,
                            initCodeType: InitCodeType.VAR,
                            initCodeName: originName,
                            initCodeValue: replaceAllInstructs(item.initCodeValue)
                        })
                    }
                }
            }
            for (let item of $fns) {
                const originName = getOriginName(item.name)
                if (item.isCreate) {
                    if (names.includes(originName))
                        return message.error(`当前页面已经存在函数名：${originName}`)
                    count.fn++
                    pushInitCodes({
                        pageId,
                        initCodeType: InitCodeType.FN,
                        initCodeName: originName,
                        initCodeEffect: item.initCodeEffect.map(e => replaceAllInstructs(e)),
                        initCodeValue: replaceAllInstructs(item.initCodeValue)
                    })
                }
            }
            for (let item of $effects) {
                if (item.isCreate) {
                    count.effect++
                    pushInitCodes({
                        pageId,
                        initCodeType: InitCodeType.EFFECT,
                        initCodeEffect: item.initCodeEffect.map(e => replaceAllInstructs(e)),
                        initCodeValue: replaceAllInstructs(item.initCodeValue)
                    })
                }
            }
            for (let item of $refs) {
                const originName = getOriginName(item.name)
                if (item.isCreate) {
                    count.ref++
                    pushInitCodes({
                        pageId,
                        initCodeName: originName,
                        initCodeType: InitCodeType.REF,
                        initCodeValue: replaceAllInstructs(item.initCodeValue)
                    })
                }
            }
            for (let item of $dialogs) {
                const originName = getOriginName(item.name)
                if (item.isCreate) {
                    const dialogNames = getDialogNames()
                    if (dialogNames.includes(originName))
                        return message.error(`当前页面已经存在对话框名：${originName}`)
                }
            }
            for (let item of $drawers) {
                const originName = getOriginName(item.name)
                if (item.isCreate) {
                    const dialogNames = getDrawerNames()
                    if (dialogNames.includes(originName))
                        return message.error(`当前页面已经存在侧滑抽屉名：${originName}`)
                }
            }

            const serviceNames = services.map(el => el.serviceName)
            const listServices = []
            for (let item of $apis) {
                const originName = getOriginName(item.name)

                if (item.isCreate) {
                    if (serviceNames.includes(originName))
                        return message.error(`当前页面已经存在接口名：${originName}`)

                    const serviceUrl = getOriginName(item.name + "_url")

                    listServices.push({
                        pageId,
                        serviceMethod: item.serviceMethod,
                        serviceUrl,
                        serviceComment: item.serviceComment,
                        serviceResponseType: item.serviceResponseType,
                        serviceName: originName
                    })
                }
            }

            const [designItem] = dataListToDesignList([JSON.parse(replaceAllInstructs(dataList))])
            const pushToDesignList = () => {
                Bus.emit(BUS_KEYS.putEnd, designItem)
                Dialog.close('modalTemps')
            }

            if (listServices.length || listInitCodes.length) {
                Dialog.loading('modalTemps')
                ApiComponent.createInfo({ listServices, listInitCodes }).then(res => {
                    dispatch(setServiceInfo(pageId))
                    dispatch(setInitCodeInfo(pageId))

                    if (Object.values(count).concat(listServices.length).some(v => v !== 0)) {
                        notification.success({
                            message: "预定义或接口自动创建成功！",
                            description: <div>
                                {Boolean(count.var) && <div>变量（useState）数量：{count.var} 个</div>}
                                {Boolean(count.fn) && <div>函数（useCallback）数量：{count.fn} 个</div>}
                                {Boolean(count.ref) && <div>引用（useRef）数量：{count.ref} 个</div>}
                                {Boolean(count.effect) && <div>影响（useEffect）数量：{count.effect} 个</div>}
                                {Boolean(listServices.length) && <div>http 接口数量：{listServices.length} 个</div>}
                            </div>
                        })
                    }

                    pushToDesignList()
                })
            } else {
                pushToDesignList()
            }
        } catch (error) {
            console.log(error)
            message.error("配置数据语法错误！")
        }
    }, [pageId, initCodes, services])

    const getListDoms = useCallback((list, isCustom) => {
        const getItemCard = (item, key) => <div key={key} className={styles["model-item"]} >
            <div className={styles['model-item-left']}>
                <Popover trigger={item.componentImg ? "hover" : "click"} placement="rightTop" content={
                    item.componentImg ? <img src={config.imageBaseUrl + "/" + item.componentImg} /> : "未上传图片"
                } >
                    <div className={classNames(styles['model-item-title'], 'text-ellipsis')} title={item.componentName}>
                        {item.componentName}
                    </div>
                </Popover>
                <Tooltip title={item.componentDes} mouseEnterDelay={1.2}>
                    <div className={classNames(styles['model-item-des'], 'text-ellipsis', 'text-line3')}>
                        {item.componentDes}
                    </div>
                </Tooltip>
            </div>
            <div className={styles['model-item-right']}>
                <Space direction='vertical' size={0}>
                    <Button
                        type="link"
                        size="small"
                        disabled={!hasPermission}
                        onClick={() => {
                            const [designItem] = dataListToDesignList([JSON.parse(item.componentDataList)])
                            let relations = {}
                            try {
                                relations = JSON.parse(item.componentRelations)
                            } catch (error) { }

                            const { $temps, $vars = [], $fns = [], $refs = [], $apis = [], $dialogs = [], $drawers = [] } = relations
                            const { parentTypes, type = '$page', isContainer } = activityColumn

                            if (!pageId) {
                                dispatch(openPage(true))
                            } else if (isContainer && item.componentRelations && $temps && canPutIn(designItem.type, parentTypes, type)) {
                                Dialog.open('modalTemps', { title: '应用模块到选中的变量模板配置' }).then(set => {
                                    try {
                                        const temps = (new Function('return (' + $temps + ')'))()
                                        function getTempKey(name) {
                                            return name.split('.')[1]
                                        }

                                        const allIn = [...$vars, ...$fns, ...$refs, ...$apis, ...$dialogs, ...$drawers]

                                        function getDataStr(suffix = "") {
                                            const tempCreates = {}, tempUses = {}, tempProps = {}
                                            allIn.forEach(v => {
                                                const $tempKey = getTempKey(v.name)
                                                const t = v.isCreate ? tempCreates : tempUses

                                                t[$tempKey] = temps[$tempKey]
                                                if (v.isCreate) {
                                                    t[$tempKey] += suffix
                                                }
                                                // api 关联的 url 处理
                                                if (v.isCreate && $tempKey.indexOf('$api') === 0) {
                                                    const apiUrlKey = $tempKey + "_url"
                                                    t[apiUrlKey] = temps[apiUrlKey]
                                                }
                                            })
                                            for (let key in temps) {
                                                if (key.indexOf('$prop_') === 0) {
                                                    tempProps[key] = temps[key]
                                                }
                                            }

                                            let tempStr = "{"
                                            const objContentToString = (obj) => {

                                                for (let key in obj) {
                                                    tempStr += `\n    ${key}: "${obj[key]}",`
                                                }
                                            }
                                            if (Object.keys(tempCreates).length) {
                                                tempStr += "\n    //会自动创建的相关模板，不可以与页面以存在重复"
                                                objContentToString(tempCreates)
                                            }
                                            if (Object.keys(tempUses).length) {
                                                tempStr += "\n    //只使用到，但不创建的相关模板，建议修改为对应会创建变量名"
                                                objContentToString(tempUses)
                                            }
                                            if (Object.keys(tempProps).length) {
                                                tempStr += "\n    //prop 的相关模板"
                                                objContentToString(tempProps)
                                            }
                                            tempStr += "\n}"
                                            return tempStr
                                        }

                                        set(<Form
                                            data={{ temps: getDataStr("1") }}
                                            className={'dialog-content'}
                                            onSubmit={(data) => { onUseSubmit(data, item.componentDataList, relations) }}
                                            onEvent={params => {
                                                if (params.prop === 'suffix') {
                                                    return {
                                                        ...params.row,
                                                        temps: getDataStr(params.value)
                                                    }
                                                }
                                            }}
                                            columns={[
                                                { type: 'image', value: config.imageBaseUrl + "/" + item.componentImg, load: () => item.componentImg, style: { height: 108 } },
                                                [
                                                    [
                                                        { type: 'input@w280', prop: 'suffix', placeholder: '防重复后缀', value: '1', config: { maxLength: 8 } },
                                                        { type: 'text', value: '自动创建变量、接口时名称，添加后缀防名称重复' },
                                                        { type: 'space' }
                                                    ],
                                                    { type: 'formitem' }
                                                ],
                                                { render: FdGlobalDataEditor, prop: 'temps', placeholder: "const $temp = {}" },
                                                { type: 'text', value: item.componentUseTip }
                                            ]}
                                        />)
                                    } catch (error) {
                                        console.log('error', error)
                                    }
                                })
                            } else {
                                Bus.emit(BUS_KEYS.putEnd, designItem)
                            }
                        }}>
                        使用
                    </Button>
                    {isCustom && <>
                        <Button
                            type="link"
                            size="small"
                            disabled={!hasPermission}
                            onClick={_ => {
                                Bus.emit(BUS_KEYS.updatePriviewState, false)
                                Dialog.open(modifyDialogName, { title: '修改模块' }).then(s => s(
                                    getComponentForm(componentRelationRef, modifyDialogName, projectId, null, null, { ...item }, JSON.parse(item.componentRelations))
                                ))
                            }}>
                            编辑
                        </Button>
                        <Button
                            danger
                            type="link"
                            size="small"
                            disabled={!hasPermission}
                            onClick={_ => {
                                Modal.confirm({
                                    title: '提示',
                                    content: `确定要删除 "${item.componentName}" 模块？`,
                                    onOk() {
                                        ApiComponent.delete({
                                            componentId: item.componentId
                                        }).then(_ => {
                                            Bus.emit(BUS_KEYS.addOrUpdateModelOk, true)
                                            message.info('删除成功！')
                                        })
                                    }
                                })
                            }}>
                            删除
                        </Button>
                    </>}
                </Space>
            </div>
        </div>

        const updateList = (newList, index) => {
            let nextList = newList
            const toIdArray = (list) => {
                const ids = []
                for (let item of list) {
                    if (Array.isArray(item)) {
                        ids.push(toIdArray(item))
                    } else {
                        ids.push(item.componentId)
                    }
                }
                return ids
            }

            if (index !== undefined) {
                const tempList = [...list]
                tempList[index] = newList
                nextList = tempList
            }
            const newIds = toIdArray(nextList)
            if (newIds.toString() !== toIdArray(list).toString()) {
                setCustomList(nextList)
                dispatch(setLight(true))
                ApiComponent.updateSorts(flatten(newIds)).then(res => {
                    Bus.emit(BUS_KEYS.addOrUpdateModelOk, true)
                })
            }
        }

        const sort = hasPermission && isCustom

        return <ReactSortable
            list={list}
            sort={sort}
            animation={280}
            setList={(newList) => { hasPermission && isCustom && updateList(newList) }}
        >
            {
                list.map((el, key) => {
                    if (Array.isArray(el)) {
                        return <div key={key} className={styles["model-card"]}>
                            <div className={classNames(styles['group-name'], 'text-ellipsis')} title={el[0].componentGroup}>
                                {el[0].componentGroup}
                            </div>
                            <ReactSortable list={el} sort={sort} animation={280} className={styles['card-content']} setList={(newList) => {
                                updateList(newList, key)
                            }} >
                                {el.map(getItemCard)}
                            </ReactSortable>
                        </div>
                    } else {
                        return getItemCard(el, key)
                    }
                })
            }
        </ReactSortable>
    }, [pageId, onUseSubmit, activityColumn, hasPermission])

    return <div className={styles.main}>
        <Dialog name='modalTemps' width={708} />
        <Dialog name={modifyDialogName} width={1024} config={{
            afterClose() {
                Bus.emit(BUS_KEYS.updatePriviewState, true)
            }
        }} />

        <Collapse openIndex={openIndex} onChange={setOpenIndex} items={[
            {
                title: <div>
                    {customModelLabel}
                    <ILink url={'/doc/light/model'} fontSize={12}>更多文档</ILink>
                </div>,
                children: customList.length ? getListDoms(customList, true) : <EmptyList />
            },
            {
                title: "系统预创建模块",
                children: systemList.length ? getListDoms(systemList) : <EmptyList />
            }
        ]} />
    </div>
}