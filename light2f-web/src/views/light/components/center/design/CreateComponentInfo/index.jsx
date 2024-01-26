import CodeEditor from "components/CodeEditor"
import { Dialog, Form, Table } from "freedomen"
import { isPlainObject } from "libs/utils"
import { useEffect, useMemo } from "react"
import { useSelector } from "react-redux"
import { InitCodeType } from "views/light/types"
import { designListToDataList, objectToString } from "views/light/utils/util"
import { cloneDeep } from 'lodash'
import ApiComponent from "services/component"
import Bus, { BUS_KEYS } from "views/light/bus"
import { message } from "antd"
import { replaceInstructStr } from "views/light/utils/icode"
import styles from "./index.module.less"

const sortStartKeys = [
    "$var",
    "$fn",
    "$ref",
    "$api",
    "$prop",
    "$dialog",
    "$drawer"
]

function getMatchValue(str = "") {
    return str + " "
}

function matchAllVars(str) {
    const regex = /(?<=\$var\.).*?(?=[^\w])/gms

    return str.match(regex)
}

function matchAllSets(str) {
    const regex = /(?<=\$set\([^\w]).*?(?=[^\w])/gms

    return str.match(regex)
}

function matchAllFns(str) {
    const regex = /(?<=\$fn\.).*?(?=\()/gms

    return str.match(regex)
}

function matchAllRefs(str) {
    const regex = /(?<=\$ref\.).*?(?=[^\w])/gms

    return str.match(regex)
}

function matchAllProps(str) {
    const regex = /(?<=\.set\([^\w]).*?(?=[^\w])/gms
    return str.match(regex)
}

function matchAllApis(str) {
    const regex = /(?<=\$api\.).*?(?=\()/gms

    return str.match(regex)
}

function matchAllDialogs(str) {
    const regex = /(?<=\$dialog\.(open|loading|close)\([^\w]).*?(?=[^\w])/gms

    return str.match(regex)
}

function matchAllDrawers(str) {
    const regex = /(?<=\$drawer\.(open|loading|close)\([^\w]).*?(?=[^\w])/gms

    return str.match(regex)
}

function getVarTempInfo(key) {
    let newKey = '$var_' + key;
    let useTmp = "$temp." + newKey

    return [newKey, useTmp]
}

function getPropTempInfo(key) {
    let newKey = '$prop_' + key;
    let useTmp = "$temp." + newKey

    return [newKey, useTmp]
}

function getDialogTempInfo(key) {
    let newKey = '$dialog_' + key;
    let useTmp = "$temp." + newKey

    return [newKey, useTmp]
}

function getDrawerTempInfo(key) {
    let newKey = '$drawer_' + key;
    let useTmp = "$temp." + newKey

    return [newKey, useTmp]
}

function getFnTempInfo(key) {
    let newKey = '$fn_' + key;
    let useTmp = "$temp." + newKey

    return [newKey, useTmp]
}

function getRefTempInfo(key) {
    let newKey = '$ref_' + key;
    let useTmp = "$temp." + newKey

    return [newKey, useTmp]
}

function getApiTempInfo(key) {
    let newKey = '$api_' + key;
    let useTmp = "$temp." + newKey

    return [newKey, useTmp]
}

function getApiUrlTempInfo(key) {
    let newKey = '$api_' + key + '_url';
    let useTmp = "$temp." + newKey

    return [newKey, useTmp]
}
//useCallback, useEffect 中 $set 替换
function replaceSetVar(str, v, tuse) {
    return str.replaceAll("$set('" + v + "'", '$set("' + tuse + '"')
        .replaceAll("$set(\"" + v + "\"", '$set("' + tuse + '"')
}

function CreateComponentInfo({ column, value, onChange }) {
    const { initCodes, services } = useSelector(selector => selector.page)

    const info = useMemo(() => {
        if (value) return value

        const $temps = {}, $vars = [], $props = [], $sets = [], $fns = [], $refs = [], $effects = [], $apis = [], $dialogs = [], $drawers = []
        const $varsSet = new Set(), $propsSet = new Set(), $setsSet = new Set(), $fnsSet = new Set(), $refsSet = new Set(), $effectsSet = new Set(), $apisSet = new Set(), $dialogsSet = new Set(), $drawersSet = new Set();
        const refCodeMaps = {}, refCodeNames = []

        initCodes.filter(c => c.initCodeType === InitCodeType.REF).forEach(c => {
            refCodeNames.push(c.initCodeName)
            refCodeMaps[c.initCodeName] = c.initCodeValue
        })

        function matchAlls(matchValue, tempValue, initCodeEffect) {
            //vars
            matchAllVars(matchValue)?.forEach(v => {
                const [tkey, tuse] = getVarTempInfo(v)
                if (!$varsSet.has(v)) {
                    $varsSet.add(v)
                    $temps[tkey] = v

                    $vars.push({
                        originName: v,
                        name: tuse,
                        initCodeEffect
                    })
                }
                if (tempValue) {
                    tempValue = tempValue.replaceAll("$var." + v, "$var." + tuse)
                }
            })
            //props 
            matchAllProps(matchValue)?.forEach(v => {
                const [tkey, tuse] = getPropTempInfo(v)
                if (!$propsSet.has(v)) {
                    $propsSet.add(v)
                    $temps[tkey] = v

                    $props.push({ originName: v, name: tuse, initCodeEffect })
                }
                if (tempValue) {
                    tempValue = replaceInstructStr(tempValue, [
                        [`.set("${v}"`, `.set("${tuse}"`],
                        [`.set('${v}'`, `.set("${tuse}"`]
                    ])
                }
            })
            //sets
            matchAllSets(matchValue)?.forEach(v => {
                const [tkey, tuse] = getVarTempInfo(v)
                if (!$setsSet.has(v)) {
                    $setsSet.add(v)

                    $sets.push({ name: tuse, originName: v, initCodeEffect })
                }

                if (!$varsSet.has(v)) {
                    $varsSet.add(v)
                    $temps[tkey] = v

                    $vars.push({ originName: v, name: tuse, fromSet: true, initCodeEffect })
                }
                if (tempValue) {
                    tempValue = replaceSetVar(tempValue, v, tuse)
                }
            })
            //fns
            matchAllFns(matchValue)?.forEach(v => {
                const [tkey, tuse] = getFnTempInfo(v)
                if (!$fnsSet.has(v)) {
                    $fnsSet.add(v)
                    $temps[tkey] = v

                    $fns.push({
                        originName: v,
                        name: tuse,
                        initCodeEffect
                    })
                }
                if (tempValue) {
                    tempValue = tempValue.replaceAll("$fn." + v, "$fn." + tuse)
                }
            })
            //refs
            matchAllRefs(matchValue)?.forEach(v => {
                const [tkey, tuse] = getRefTempInfo(v)
                if (!$refsSet.has(v)) {
                    $refsSet.add(v)
                    $temps[tkey] = v

                    $refs.push({
                        originName: v,
                        name: tuse,
                        isCreate: refCodeNames.includes(v),
                        initCodeValue: refCodeMaps[v],
                        initCodeEffect
                    })
                }

                if (tempValue) {
                    tempValue = tempValue.replaceAll("$ref." + v, "$ref." + tuse)
                }
            })
            //apis
            matchAllApis(matchValue)?.forEach(v => {
                const [tkey, tuse] = getApiTempInfo(v)
                if (!$apisSet.has(v)) {
                    $apisSet.add(v)
                    $temps[tkey] = v

                    $apis.push({
                        originName: v,
                        name: tuse,
                        initCodeEffect
                    })
                }
                if (tempValue) {
                    tempValue = tempValue.replaceAll("$api." + v, "$api." + tuse)
                }
            })
            //dialogs
            matchAllDialogs(matchValue)?.forEach(v => {
                const [tkey, tuse] = getDialogTempInfo(v)
                if (!$dialogsSet.has(v)) {
                    $dialogsSet.add(v)
                    $temps[tkey] = v

                    $dialogs.push({
                        originName: v,
                        name: tuse,
                        initCodeEffect
                    })
                }
                if (tempValue) {
                    tempValue = replaceInstructStr(tempValue, [
                        [`$dialog.loading("${v}"`, `$dialog.loading("${tuse}"`],
                        [`$dialog.loading('${v}'`, `$dialog.loading("${tuse}"`],

                        [`$dialog.close("${v}"`, `$dialog.close("${tuse}"`],
                        [`$dialog.close('${v}'`, `$dialog.close("${tuse}"`],

                        [`$dialog.open("${v}"`, `$dialog.open("${tuse}"`],
                        [`$dialog.open('${v}'`, `$dialog.open("${tuse}"`]
                    ])
                }
            })
            //drawers
            matchAllDrawers(matchValue)?.forEach(v => {
                const [tkey, tuse] = getDrawerTempInfo(v)
                if (!$drawersSet.has(v)) {
                    $drawersSet.add(v)
                    $temps[tkey] = v

                    $drawers.push({
                        originName: v,
                        name: tuse,
                        initCodeEffect
                    })
                }
                if (tempValue) {
                    tempValue = replaceInstructStr(tempValue, [
                        [`$drawer.loading("${v}"`, `$drawer.loading("${tuse}"`],
                        [`$drawer.loading('${v}'`, `$drawer.loading("${tuse}"`],

                        [`$drawer.close("${v}"`, `$drawer.close("${tuse}"`],
                        [`$drawer.close('${v}'`, `$drawer.close("${tuse}"`],

                        [`$drawer.open("${v}"`, `$drawer.open("${tuse}"`],
                        [`$drawer.open('${v}'`, `$drawer.open("${tuse}"`]
                    ])
                }
            })

            return tempValue
        }

        function setInfo(cols) {
            const setObjectInfo = (data) => {
                for (let key in data) {
                    const value = data[key]

                    if (isPlainObject(value)) {
                        setObjectInfo(value)
                    } else if (key === 'dataName') {
                        const trimValue = value.trim()
                        const [tkey, tuse] = getVarTempInfo(trimValue)

                        if (!$varsSet.has(trimValue)) {
                            $varsSet.add(trimValue)
                            $temps[tkey] = trimValue

                            $vars.push({
                                originName: trimValue,
                                name: tuse
                            })
                        }

                        const obj = $vars.find(v => v.originName === trimValue)
                        if (obj) {
                            obj.isCreate = true
                            obj.disabled = true
                            obj.initCodeValue = data.data
                            obj.isAutoCreate = true
                        }
                        data.dataName = tuse
                    } else if (key === 'prop' && value) {
                        const trimValue = value.trim()
                        const [tkey, tuse] = getPropTempInfo(trimValue)

                        if (!$propsSet.has(trimValue)) {
                            $propsSet.add(trimValue)
                            $temps[tkey] = trimValue

                            $props.push({
                                originName: trimValue,
                                name: tuse
                            })

                        }

                        data.prop = tuse
                    } else if (key === 'name' && value) {
                        const trimValue = value.trim()
                        if (['Dialog', 'FDialog'].includes(column.type)) {
                            const [tkey, tuse] = getDialogTempInfo(trimValue)

                            if (!$dialogsSet.has(trimValue)) {
                                $dialogsSet.add(trimValue)
                                $temps[tkey] = trimValue

                                $dialogs.push({
                                    originName: trimValue,
                                    name: tuse
                                })
                            }

                            const obj = $dialogs.find(v => v.originName === trimValue)
                            if (obj) {
                                obj.isCreate = true
                            }
                            data.name = tuse

                        } else if (['Drawer', 'FDrawer'].includes(column.type)) {
                            const [tkey, tuse] = getDrawerTempInfo(trimValue)

                            if (!$drawersSet.has(trimValue)) {
                                $drawersSet.add(trimValue)
                                $temps[tkey] = trimValue

                                $drawers.push({
                                    originName: trimValue,
                                    name: tuse
                                })
                            }

                            const obj = $drawers.find(v => v.originName === trimValue)
                            if (obj) {
                                obj.isCreate = true
                            }
                            data.name = tuse
                        }

                    } else if (key === 'ref') {
                        const trimValue = value.trim()
                        const [tkey, tuse] = getRefTempInfo(trimValue)
                        if (!$refsSet.has(trimValue)) {
                            $refsSet.add(trimValue)
                            $temps[tkey] = trimValue

                            $refs.push({
                                originName: trimValue,
                                name: tuse
                            })
                        }

                        const obj = $refs.find(v => v.originName === trimValue)
                        if (obj) {
                            obj.isCreate = true
                            obj.disabled = true
                            obj.isAutoCreate = true
                        }
                    } else if (typeof value === 'string') {
                        //------------------------------------
                        data[key] = matchAlls(getMatchValue(value), value)
                    }
                }
            }

            for (let col of cols) {
                const { data, children } = col
                if (Array.isArray(children)) {
                    setInfo(children)
                }
                setObjectInfo(data)
            }
        }

        function replaceRefProp(cols) {
            const instructs = []
            $props.forEach(v => {
                $refs.forEach(r => {
                    instructs.push([
                        `${r.name}.set("${v.originName}"`,
                        `${r.name}.set("${v.name}"`
                    ], [
                        `${r.name}.set('${v.originName}'`,
                        `${r.name}.set("${v.name}"`
                    ], [
                        `${r.name}.get("${v.originName}"`,
                        `${r.name}.set("${v.name}"`
                    ], [
                        `${r.name}.get('${v.originName}'`,
                        `${r.name}.set("${v.name}"`
                    ])
                })
            })

            const setObjectInfo = (data) => {
                for (let key in data) {
                    const value = data[key]
                    if (typeof value === 'string') {

                    }
                }
            }
            for (let col of cols) {
                const { data, children } = col
                if (Array.isArray(children)) {
                    replaceRefProp(children)
                }
                setObjectInfo(data)
            }
        }

        const dataList = cloneDeep(designListToDataList([column]))
        setInfo(dataList)
        replaceRefProp(dataList)
        //相关的预定义
        const relationInitCodes = [], newRelationMap = {}
        function setRelations(effectNames) {
            const rs = initCodes.filter(code => code.initCodeEffect?.some(el => effectNames.has(el)))
            if (rs.length) {
                relationInitCodes.push(...rs)
                setRelations(new Set(rs.map(el => el.initCodeName)))
            }
        }

        setRelations(new Set([...$varsSet, ...$fnsSet]))

        for (let code of relationInitCodes) {
            const { initCodeId, initCodeType, initCodeName, initCodeValue, initCodeEffect } = code
            const effectStr = initCodeEffect?.toString()

            if (newRelationMap[initCodeId]) continue

            const [tkey, tuse] = getFnTempInfo(initCodeName)
            if (initCodeType === InitCodeType.FN && !$fnsSet.has(initCodeName)) {
                $fnsSet.add(initCodeName)
                $temps[tkey] = initCodeName

                $fns.push({ originName: initCodeName, name: tuse })
            } else if (initCodeType === InitCodeType.EFFECT && !$effectsSet.has(effectStr)) {
                const [tkey, tuse] = getFnTempInfo(effectStr)
                $effectsSet.add(effectStr)
                $temps[tkey] = effectStr

                $effects.push({
                    originName: effectStr, name: tuse
                })
            }

            newRelationMap[initCodeId] = {
                ...code,
                initCodeValue: matchAlls(getMatchValue(initCodeValue), initCodeValue, initCodeEffect) //------------------------------------
            }
        }
        //依赖计算
        const fnCodeMaps = {}, fnCodeNames = [], fnCodes = initCodes.filter(c => c.initCodeType === InitCodeType.FN)

        fnCodes.forEach(c => {
            fnCodeNames.push(c.initCodeName)
            fnCodeMaps[c.initCodeName] = { ...c }
        })

        function getFunDeps(fnName) {
            const deps = []
            const { initCodeEffect } = fnCodeMaps[fnName]

            for (let effect of initCodeEffect) {
                if (fnCodeNames.includes(effect)) {
                    deps.push(...getFunDeps(effect))
                } else {
                    deps.push(effect)
                }
            }
            return deps
        }

        function setFunDeps() {
            for (let key in fnCodeMaps) {
                fnCodeMaps[key].varDeps = getFunDeps(fnCodeMaps[key].initCodeName)
            }
        }

        setFunDeps()

        const isCreateVarNameSet = new Set()
        $vars.forEach(v => {
            if (v.isCreate) {
                isCreateVarNameSet.add(v.originName)
            }
        })
        function isEveryDeps(initCodeEffect) {
            return initCodeEffect.every(el => {
                if (isCreateVarNameSet.has(el)) return true

                const fnCode = fnCodeMaps[el]
                return fnCode && fnCode.varDeps.every(el => isCreateVarNameSet.has(el))
            })
        }
        function resetFnSetVar(initCodeValue) {
            let value = initCodeValue || ''
            const arrs = matchAllSets(initCodeValue)

            if (!arrs) return initCodeValue

            for (let v of arrs) {
                if (v !== '') {
                    const [, tuse] = getVarTempInfo(v)
                    value = replaceSetVar(value, v, tuse)
                }
            }
            return value
        }
        //去原预定义code中找初始值等
        initCodes.forEach(c => {
            const code = newRelationMap[c.initCodeId] || c

            const { initCodeType, initCodeName, initCodeValue, initCodeEffect } = code
            const effectStr = initCodeEffect?.toString()
            const effectTemp = initCodeEffect?.map(el => {
                for (let key in $temps) {
                    if ($temps[key] === el) {
                        return "$temp." + key
                    }
                }
            })

            if (initCodeType === InitCodeType.VAR) {
                const obj = $vars.find(v => v.originName === initCodeName)
                if (obj) {
                    obj.initCodeValue = initCodeValue

                    const setObj = $sets.find(s => s.originName === initCodeName)

                    if (
                        !obj.fromSet && (!obj.initCodeEffect || isEveryDeps(obj.initCodeEffect))
                        &&
                        setObj && (!setObj.initCodeEffect || isEveryDeps(setObj.initCodeEffect))
                    ) {
                        obj.isCreate = true
                    }
                }
            } else if (initCodeType === InitCodeType.FN) {
                const obj = $fns.find(v => v.originName === initCodeName)
                if (obj) {
                    obj.initCodeValue = resetFnSetVar(initCodeValue)
                    obj.initCodeEffect = effectTemp

                    if (isEveryDeps(initCodeEffect)) {
                        obj.isCreate = true
                    }
                }
            } else if (initCodeType === InitCodeType.EFFECT) {
                const obj = $effects.find(v => v.originName === effectStr)
                if (obj) {
                    obj.initCodeValue = resetFnSetVar(initCodeValue)
                    obj.initCodeEffect = effectTemp

                    if (isEveryDeps(initCodeEffect)) {
                        obj.isCreate = true
                    }
                }
            }
        })

        services.forEach(service => {
            const obj = $apis.find(v => v.originName === service.serviceName)

            if (obj) {
                const [k, serviceUrl] = getApiUrlTempInfo(obj.originName)
                $temps[k] = service.serviceUrl
                if (!obj.initCodeEffect || isEveryDeps(obj.initCodeEffect)) {
                    obj.isCreate = true
                }
                Object.assign(obj, { ...service, serviceUrl })
            }
        })

        let newTemps = {}
        Object.keys($temps).sort((a, b) => {
            const [sk1] = a.split("_")
            const [sk2] = b.split("_")
            return sortStartKeys.indexOf(sk1) - sortStartKeys.indexOf(sk2)
        }).forEach(k => { newTemps[k] = $temps[k] })
        newTemps = objectToString(newTemps)?.replaceAll(" $", "\n    $").replace(" }", "\n}")

        return { $temps: newTemps, $vars, $fns, $refs, $effects, $apis, $dialogs, $drawers, data: dataList[0] }
    }, [value, column, initCodes, services])

    useEffect(() => {
        onChange(info)
    }, [info])

    return <div className={styles.main}>
        <div className={styles.temps}>
            <CodeEditor
                isSet={true}
                value={info.$temps}
                onChange={$temps => {
                    onChange({ ...info, $temps })
                }}
                style={{ height: 154, width: 362 }}
            />
            <div className={styles.right}>
                <div>以 $var_ 开头：变量，用 useState 创建</div>
                <div>以 $fn_ 开头：函数，用 useCallback 创建</div>
                <div>以 $ref_ 开头：引用，用 useRef 创建或组件的 ref 属性</div>
                <div>以 $api_ 开头：访问 http 时的接口方法名或路径</div>
                <div>以 $prop_ 开头：组件的字段名属性</div>
                <div>以 $dialog_ 开头：对话框的 name 属性</div>
                <div>以 $drawer_ 开头：侧滑抽屉的 name 属性</div>
            </div>
        </div>
        {
            Boolean(info.$vars?.length) && <>
                <div className={styles.title}>关联变量/属性名(有使用到并且有赋值操作会默认创建)：</div>
                <Table
                    data={info.$vars}
                    config={{ pagination: false, size: 'small' }}
                    onChange={$vars => {
                        onChange({ ...info, $vars })
                    }}
                    columns={[
                        { prop: 'originName', width: 120, label: '变量名称' },
                        { prop: 'name', width: 200, label: '模版变量使用', config: { maxlength: 25 } },
                        { prop: 'initCodeValue', label: '初始值', config: { maxlength: 60 } },
                        { type: 'switch@small', label: '使用时创建', width: 110, disabled: ({ data }) => data.disabled, prop: 'isCreate' }
                    ]}
                />
            </>
        }
        {
            Boolean(info.$fns?.length) && <>
                <div className={styles.title}>关联函数(依赖完全在关联变量或关联函数中会默认创建)：</div>
                <Table
                    data={info.$fns}
                    config={{ pagination: false, size: 'small' }}
                    onChange={$fns => {
                        onChange({ ...info, $fns })
                    }}
                    columns={[
                        { prop: 'originName', width: 120, label: '函数名称' },
                        { prop: 'name', width: 200, label: '名称模版变量', config: { maxlength: 25 } },
                        { prop: 'initCodeValue', label: '初始值', config: { maxlength: 54 } },
                        { type: 'switch@small', label: '使用时创建', width: 110, prop: 'isCreate' }
                    ]}
                />
            </>
        }
        {
            Boolean(info.$refs?.length) && <>
                <div className={styles.title}>ref(有使用到并且不是组件的 ref 属性就会默认创建)：</div>
                <Table
                    data={info.$refs}
                    config={{ pagination: false, size: 'small' }}
                    onChange={$refs => {
                        onChange({ ...info, $refs })
                    }}
                    columns={[
                        { prop: 'originName', width: 120, label: '函数名称' },
                        { prop: 'name', width: 200, label: '名称模版变量', config: { maxlength: 25 } },
                        { prop: 'initCodeValue', label: '初始值', config: { maxlength: 60 } },
                        { type: 'switch@small', label: '使用时创建', width: 110, disabled: ({ data }) => data.disabled, prop: 'isCreate' }
                    ]}
                />
            </>
        }
        {
            Boolean(info.$effects?.length) && <>
                <div className={styles.title}>关联影响(依赖完全在关联变量或关联函数中会默认创建)：</div>
                <Table
                    data={info.$effects}
                    onChange={$effects => {
                        onChange({ ...info, $effects })
                    }}
                    config={{ pagination: false, size: 'small' }}
                    columns={[
                        { prop: 'originName', width: 120, filter: ({ value }) => `[${value}]`, label: '依赖名称' },
                        { prop: 'name', width: 200, label: '模版变量使用', filter: ({ value }) => `[${value}]`, config: { maxlength: 25 } },
                        { prop: 'initCodeValue', label: '初始值', config: { maxlength: 60 } },
                        { type: 'switch@small', label: '使用时创建', width: 110, prop: 'isCreate' }
                    ]}
                />
            </>
        }
        {
            Boolean(info.$apis?.length) && <>
                <div className={styles.title}>关联接口(有使用到会默认创建，如果是组合型其它中使用到可以关闭)：</div>
                <Table
                    data={info.$apis}
                    onChange={$apis => {
                        onChange({ ...info, $apis })
                    }}
                    config={{ pagination: false, size: 'small' }}
                    columns={[
                        { prop: 'originName', width: 120, label: '原始名称' },
                        { prop: 'name', width: 200, label: '模版变量使用' },
                        { prop: 'serviceMethod', width: 140, label: 'Method' },
                        { prop: 'serviceUrl', label: '路径' },
                        { type: 'switch@small', label: '使用时创建', width: 110, prop: 'isCreate' }
                    ]}
                />
            </>
        }
    </div>
}

export const getComponentForm = (componentRelationRef, dialogName, projectId, pageId, column, formData, value) => {
    return <Form
        data={formData}
        className='dialog-content'
        onSubmit={data => {
            const componentDataList = data.componentDataList || JSON.stringify(componentRelationRef.current.data)
            delete componentRelationRef.current.data
            const componentRelations = JSON.stringify(componentRelationRef.current)

            Dialog.loading(dialogName)

            ApiComponent.insertOrUpdate({
                projectId,
                componentId: data.componentId,
                componentName: data.componentName,
                componentDes: data.componentDes,
                componentGroup: data.componentGroup,
                componentUseTip: data.componentUseTip,
                componentFromId: data.componentFromId || pageId,
                componentImg: data.componentImg,
                componentDataList,
                componentRelations
            }).then(_ => {
                Dialog.close(dialogName)
                Bus.emit(BUS_KEYS.addOrUpdateModelOk, true)
                message.success(formData ? "修改成功" : "添加成功")
            })
        }}
        columns={[
            {
                type: 'autocomplete', label: '组名', prop: 'componentGroup', config: { maxLength: 22 }, options({ value, resolve }) {
                    ApiComponent.groupOptions({ projectId, componentGroup: value }).then(r => {
                        r.length ? resolve(r.toString()) : resolve()
                    })
                }
            },
            { type: 'input', label: '模块名称', prop: 'componentName', rule: 'must', config: { maxLength: 25, allowClear: true } },
            { type: 'input-area', label: '功能介绍', placeholder: "输入功能介绍", prop: 'componentDes', config: { maxLength: 125 } },
            { type: 'input-area', label: '使用提示', placeholder: "输入使用方法，如要修改什么", prop: 'componentUseTip', config: { maxLength: 125 } },
            { type: 'upload-img', label: '预览缩略图', prop: 'componentImg' },
            {
                label: '使用关联',
                prop: 'relation',
                render() {
                    return <CreateComponentInfo column={column} value={value} onChange={(value) => {
                        componentRelationRef.current = value
                    }} />
                },
                config: {
                    tooltip: "自动提取模块内的常用变量，以及依赖的函数、接口等形成变量模版，用于使用的时候可以直接模版修改，注意一下默认创建是否是你所想的"
                }
            }
        ]}
    />
}