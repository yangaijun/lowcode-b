import { useCallback, useEffect, useRef, useMemo, useState } from 'react'
import AceEditor from "react-ace"
import "ace-builds/webpack-resolver"
import "ace-builds/src-noconflict/theme-clouds"
import "ace-builds/src-noconflict/mode-javascript"
import "ace-builds/src-noconflict/mode-less"
import "ace-builds/src-noconflict/ext-language_tools"
import "ace-builds/src-noconflict/mode-json"
import { renderJs } from 'components/codeText'
import { uniqueId } from 'lodash'
import { Modal } from 'antd'

const border = "1px solid #d9d9d9"
var allAceCompletions = null

function trimHasString(m, s) {
    if (m && s) {
        return m.replaceAll(" ", "").includes(s.replaceAll(" ", ""))
    }
    return false
}

function isRightString(str) {
    //rule 验证
    return str?.indexOf("len") === 0 || str?.includes(" ")
}
/**
 * 编辑器
 * @param {mode: 模式，styles: 样式，value: 值，palcehoder: 提示， isSet: 是否是设置提示（覆盖）, onChange:fn返回值} param0 
 * @returns 
 */
export default function CodeEditor({
    mode = "javascript",
    style = { height: 120, width: 258 },
    value,
    completions,
    placeholder,
    isSet,
    onChange,
    onBlur,
    asycCompletions, //array [{targetName: string, completions: [...completions]}]
    ...rest
}) {
    const aceRef = useRef()
    const [innerValue, setInnerValue] = useState()
    const defaultCompletions = useMemo(() => {
        if (mode === 'javascript') {
            return [
                { caption: 'console.log', value: 'console.log()', score: 1, meta: '控制台' },
                { caption: 'JSON.stringify', value: 'JSON.stringify()', score: 1 },
                { caption: 'JSON.parse', value: 'JSON.parse()', score: 1}
            ]
        }
        return []
    }, [mode])
    //获取基本代码提示
    const getCompleters = useCallback(() => {
        const getCompletions = {
            getCompletions: function (editors, session, pos, prefix, callback) {
                callback(null, [...defaultCompletions, ...completions]);
            }
        }
        return isSet ? [
            getCompletions
        ] : [
            getCompletions,
            ...allAceCompletions
        ]
    }, [completions, isSet, defaultCompletions])
    //处理异步代码提示
    const setAsycCompletions = useCallback((value) => {
        setInnerValue(value)
        if (!completions) return

        const completers = getCompleters()
        if (asycCompletions) {
            for (let item of asycCompletions) {
                if (trimHasString(value, item.targetName)) {
                    completers.push({
                        getCompletions: function (editors, session, pos, prefix, callback) {
                            callback(null, item.completions);
                        }
                    })
                }
            }
            aceRef.current.editor.completers = completers
        } else {
            aceRef.current.editor.completers = completers
        }
    }, [asycCompletions, getCompleters, completions])

    useEffect(() => {
        if (value && typeof value !== 'string') {
            console.error('react-ace value must be string, but get', value)
            setInnerValue(value?.toString())
        } else { setInnerValue(value) }
    }, [value])

    if (style) {
        style.border = border
    } else {
        style = { border }
    }

    return <AceEditor
        ref={aceRef}
        mode={mode}
        style={style}
        name={"ace" + uniqueId()}
        placeholder={placeholder}
        theme="clouds"
        fontSize={14}
        enableSnippets
        enableLiveAutocompletion
        highlightActiveLine
        setOptions={{ useWorker: false }}
        showGutter={false}
        value={innerValue}
        onBlur={() => {
            try {
                innerValue && mode !== 'less' && mode !== 'json' && window.codeFormart(innerValue)
            } catch (e) {
                try {
                    new Function("return " + innerValue)
                } catch (error) { 
                    if (!isRightString(innerValue)) {
                        Modal.error({
                            title: '语法错误',
                            width: 680,
                            content: renderJs({ value: error.message })
                        })
                    }
                }
            }
            onBlur?.()
            onChange?.(innerValue)
        }}
        onChange={setAsycCompletions}
        editorProps={{ $blockScrolling: true }}
        onLoad={editor => {
            if (allAceCompletions === null) {
                allAceCompletions = editor.completers
            }

            if (completions) {
                editor.completers = getCompleters()
            }
        }}
        {...rest}
    />
}