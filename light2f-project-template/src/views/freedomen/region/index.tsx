import React, { useCallback, useEffect, useImperativeHandle, forwardRef, useMemo, useRef, useState, useContext } from 'react';
import Render, { renderType, renderContainerType, customRenders } from '../render'
import { FData, IEventParams, IRegionColumnItemProps, IRegionProps } from '../config/type';
import { CONTAINER_NAMES, getContainerDom } from '../containers';
import { changeType, customTypeProp, isRenderComponent, resetProp } from '../config/props';
import util, { getChainValueByString, getClass, getOrderKey, getStyle, isUndefined, resetToOtherObject, getArrayLastItem,setChainValueByString } from '../utils/util';
import { hasPermission } from '../config/permission';
import { getElementDom } from '../elements';
import { getFullType } from '../utils/base';
import useUpdateEffect from '../hooks/useUpdateEffect';
import { PermissionContext } from '../context';

const keyName = 'Region'
 
function isResetProp(prop = '') {
    return prop.indexOf(resetProp) === 0
}

function getType(column: IRegionColumnItemProps): string {
    let columnType = getFullType(column)
    if (columnType.includes('@')) {
        columnType = columnType.split('@')[0];
    }

    return columnType.split('-')[0]
}

export function isContainer(column: IRegionColumnItemProps = {}) {
    const regionType = getFullType(column)
    return regionType.indexOf(renderContainerType) === 0 || CONTAINER_NAMES.includes(getType(column));
}

function getResetColumn(column: IRegionColumnItemProps, data: FData, preData: FData) {
    const newColumn = { ...column }

    newColumn.value = isUndefined(data, newColumn.prop as string) ? newColumn.value : getChainValueByString(data, newColumn.prop as string);
    newColumn.$data = data;
    newColumn.$preData = preData;

    const type = getType(newColumn)
    //use register render
    if (type && customRenders[type]) {
        newColumn.render = customRenders[type].render
        newColumn[customTypeProp] = newColumn.type
        //delete type key
        newColumn.type = customRenders[type].isContainer ? renderContainerType : renderType
    }

    return newColumn
}

function getResetColumns(columns: IRegionColumnItemProps[], data: FData, preData: FData): IRegionColumnItemProps[] {
    let newColumns = []
    for (let i = 0; i < columns.length; i++) {
        let column = columns[i];

        if (Array.isArray(column)) {
            newColumns.push(getResetColumns(column as IRegionColumnItemProps[], data, preData))
        } else {
            newColumns.push(getResetColumn(column, data, preData))
        }
    }
    return newColumns;
}

const cloneData = (data: FData) => {
    return util.clone(data)
}
export interface FRegionRef {
    reset: (params?: any) => void,
    set: (prop: string | FData, callback?: Function | any) => void,
    get: (prop?: string) => any
}

type IRegionEventParams = IEventParams | null

const FRegion: React.ForwardRefRenderFunction<FRegionRef, IRegionProps> = (props: IRegionProps, ref: any) => {
    const { data, columns, className, style, onEvent, onChange } = props
    //内部维护数据
    const [innerData, setInnerData] = useState<FData>(() => data || {})
    //preData: 上一次的数据，data: 当前的数据
    const innerRef = useRef<{ preData: FData, data: FData, onEvent?: Function, onChange?: Function }>(
        { preData: {}, data: innerData, onEvent, onChange }
    )
    //第一次放入的初始化数据，用户使用 reset 方法回到此数据
    const [initialData] = useState<FData>(() => data ? cloneData(data) : {})
    const [eventParams, setEventParams] = useState<IRegionEventParams>(null)
    const permissionContext = useContext(PermissionContext);
    //将当前的数据放到上一次数据对象，将下一步的数据放入当前数据数据
    const setPreDataAndCurrentData = useCallback((nextData: FData) => {
        resetToOtherObject(innerRef.current.preData, innerRef.current.data)
        resetToOtherObject(innerRef.current.data, nextData)
        setInnerData(nextData)
    }, [])

    const changeInnerData = useCallback((nextData: FData, params?: IRegionEventParams) => {
        setPreDataAndCurrentData(nextData)
        innerRef.current.onChange?.(nextData)
        params && setEventParams(params)
    }, [setPreDataAndCurrentData])

    const setItemValue = useCallback((prop: string | FData, callback?: Function | any) => {
        if (!prop) return

        const nextData = cloneData(innerRef.current.data)

        const setValue = (data: any, prop: string, cb?: Function | any) => {
            let value = cb

            if (typeof value === 'function') {
                value = callback(getChainValueByString(data, prop))
            }
            setChainValueByString(data, prop, value)
        }

        if (typeof prop === 'string') {
            setValue(nextData, prop, callback)
            changeInnerData(nextData)
        } else {
            for (let key in prop) {
                setValue(nextData, key, prop[key])
            }
            changeInnerData(nextData)
        }
    }, [changeInnerData])

    const getItemValue = useCallback((prop?: string) => {
        if (!prop) {
            return cloneData(innerRef.current.data)
        }
        return getChainValueByString(cloneData(innerRef.current.data), prop)
    }, [])

    const reset = useCallback((params?: IRegionEventParams) => {
        if (params) {
            params.row = cloneData(initialData);
        }
        changeInnerData(cloneData(initialData), params)
    }, [initialData, changeInnerData])

    const handlerEvent = useCallback((params: IEventParams) => {
        const nextData = innerRef.current.onEvent?.(params);

        if (nextData) {
            //TODO 要优化么，return 来的值等主线程结束再执行
            setTimeout(() => { changeInnerData(nextData) });
        } else if (nextData === null) {
            reset()
        }
    }, [changeInnerData, reset])

    const innerEvent = useCallback((params: IEventParams) => {
        if (isResetProp(params.prop)) {
            reset(params);
        } else {
            params.row = cloneData(innerRef.current.data);
            handlerEvent(params)
        }
    }, [reset, handlerEvent])

    const innerChange = useCallback((params: IEventParams) => {
        if (params.prop) {
            const nextData = cloneData(innerRef.current.data)
            setChainValueByString(nextData, params.prop, params.value)
            const nextParams = {
                ...params,
                type: changeType,
                row: cloneData(nextData)
            }
            changeInnerData(nextData, nextParams)
        }
    }, [changeInnerData])

    useImperativeHandle(ref, () => {
        return { reset, set: setItemValue, get: getItemValue }
    })

    useEffect(() => {
        innerRef.current.onChange = onChange
    }, [onChange])

    useEffect(() => {
        innerRef.current.onEvent = onEvent
    }, [onEvent])

    useUpdateEffect(() => {
        data && setPreDataAndCurrentData(data)
    }, [data, setPreDataAndCurrentData])

    useEffect(() => {
        if (eventParams) {
            handlerEvent(eventParams)
            setEventParams(null)
        }
    }, [eventParams, handlerEvent])

    const getContainer = useCallback((column: IRegionColumnItemProps, children: IRegionColumnItemProps[], key: string) => {
        const type = getType(column);
        const Container = type === renderType ? Render : getContainerDom(type)

        return <Container
            key={key}
            onChange={innerChange}
            onEvent={innerEvent}
            children={children}
            item={column}
        />;
    }, [innerChange, innerEvent])

    const getElement = useCallback((column: IRegionColumnItemProps, key: string) => {
        const type = getType(column);
        const Element = type === renderType ? Render : getElementDom(type);

        if (!Element) {
            console.error('未发现的元素类型：=>', type)
            return null;
        }

        return <Element
            key={key}
            onEvent={innerEvent}
            onChange={innerChange}
            item={column}
        />;
    }, [innerEvent, innerChange])

    const isLoad = useCallback((column: IRegionColumnItemProps) => {
        const { data, preData } = innerRef.current
        const params = { column, data, preData, value: column.value }
        
        const globalPermission = (permissionContext.hasPermission || hasPermission)?.(params)

        if (typeof column.load === 'function') {
            return column.load(params) && globalPermission;
        }
        return globalPermission;
    }, [permissionContext.hasPermission])

    const makeJsx: any = useCallback((columns: IRegionColumnItemProps[], level?: string) => {
        if (!columns.length) return;

        let container = [], children = [];
        let lastColumn = getArrayLastItem(columns);

        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];

            if (isContainer(lastColumn) && !isLoad(lastColumn)) break;
            const key = getOrderKey(level, i)

            if (isContainer(column)) {
                container.push(getContainer(column, children, key));
                children = [];
            } else if (Array.isArray(column)) {
                children.push(makeJsx(column, key));
            } else if (!isLoad(column)) {
                continue;
            } else {
                children.push(getElement(column, key));
            }
        }

        if (!isContainer(lastColumn)) {
            container.push(children);
        }

        return container;
    }, [isLoad, getContainer, getElement])

    const _style = useMemo(() => getStyle(keyName, style), [style])
    const _className = useMemo(() => getClass(keyName, className), [className])

    const render = useMemo(() => {
        if (!Array.isArray(columns)) return

        return makeJsx(getResetColumns(columns, innerData, innerRef.current.preData))
    }, [columns, innerData, makeJsx])

    if ((_style && Object.keys(_style).length) || _className) {
        return <div style={style} className={_className}>
            {render}
        </div>
    } else {
        return <React.Fragment> {render} </React.Fragment>;
    }
}

const R = forwardRef(FRegion) as (
    props: React.PropsWithChildren<IRegionProps> & { ref?: React.Ref<FRegionRef> },
) => React.ReactElement;

type InnerRType = typeof R

interface InnerRInterface extends InnerRType {
    [isRenderComponent]?: boolean
}

const InnerR = R as InnerRInterface

InnerR[isRenderComponent] = true

export default InnerR
