import React, { useMemo, useRef } from "react";
import { useChange, useClassName, useConfig, useDisabled, useEvent, useStyle } from "../hooks/useBase";
import { IRenderParams, IRenderProps } from "../config/type";
import { getFullType } from "../utils/base";
import util, { getChainValueByString } from "../utils/util";
import { hasNameProp, isRenderComponent } from "../config/props";

export default function Render(props: IRenderProps) {
    const { children, item } = props
    const { prop, value, placeholder, render, $data: data, $preData: preData } = item
    const useUpdateRef = useRef<any>({ shouldUpdate: null, cache: null, effectPre: {}, effectCurrent: {} })

    const onChange = useChange(props)
    const onEvent = useEvent(props)
    const style = useStyle(props)
    const className = useClassName(props)
    const disabled = useDisabled(props)
    const config = useConfig(props)

    const type = getFullType(item)

    const getRenderCache = () => {
        const shouldUpdate = (callback: (preData: any, currentData: any) => boolean) => {
            useUpdateRef.current.shouldUpdate = callback
        }
        //防止注册进来没法每个 update,所以 config 中也可以使用
        if (config.shouldUpdate) {
            useUpdateRef.current.shouldUpdate = config.shouldUpdate
            delete config.shouldUpdate
        }

        let cache = render && render({
            value,
            preData,
            data,
            children,
            $base: { style, className, placeholder, disabled, onChange, onEvent, config, shouldUpdate }
        })

        if (cache?.type?.[isRenderComponent]) {
            const {
                data: cacheData = value,
                onChange: cacheOnChange = (data: any) => onChange(data),
                config: cacheConfig = config,
            } = cache.props

            cache = React.cloneElement(cache, {
                name: cache?.type?.[hasNameProp] ? prop : undefined,
                data: cacheData,
                onChange: cacheOnChange,
                config: cacheConfig,
            }, null)
        }
        return cache
    }

    const renderd = useMemo(() => {
        useUpdateRef.current.effectPre = useUpdateRef.current.effectCurrent
        useUpdateRef.current.effectCurrent = { style, className, disabled, placeholder, config }
        const { shouldUpdate, cache } = useUpdateRef.current

        if (
            cache === null ||
            util.notEquals(useUpdateRef.current.effectPre, useUpdateRef.current.effectCurrent) ||
            (prop && util.notEquals(getChainValueByString(preData, prop), getChainValueByString(data, prop))) ||
            type.indexOf(renderContainerType) === 0 ||
            shouldUpdate === true ||
            (shouldUpdate && shouldUpdate(preData, data))
        ) {
            useUpdateRef.current.cache = getRenderCache()
        }
        return useUpdateRef.current.cache
    }, [type, getRenderCache, prop, preData, data, style, className, disabled, placeholder, config, children])

    return renderd
}

export const renderType = 'render'
export const renderContainerType = 'render-c'
export const renderTypes = [renderType, renderContainerType]

export interface customValueProps {
    render: (params: IRenderParams) => {},
    isContainer?: boolean
}

export const customRenders: Record<string, customValueProps> = {}

export function registerRender(type: string, render?: (params: IRenderParams) => {}, isContainer = false) {
    if (type && render) {
        customRenders[type] = { render, isContainer }
    } else {
        console.warn('registerRender, type and render are required')
    }

    return { registerRender }
}
/**
 * 删除注册的组件，不传type 删除全部
 * @param type string
 */
export function removeRender(type?: string) {
    if (type) {
        delete customRenders[type]
    } else {
        for (let i in customRenders) {
            delete customRenders[i]
        }
    }
}