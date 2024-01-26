import { message } from "antd";
import less from "less";

const globalId = 'globalPageStyle'
const renderMap = {}
const styleIdMap = {}

function createStyle(content, id) {
    let style = document.getElementById(id)
    if (style) {
        style.innerHTML = content
    } else {
        style = document.createElement('style');
        style.id = id
        const textNode = document.createTextNode(content);
        style.appendChild(textNode)
        document.head.appendChild(style)
    }
}

function createStyleFromLessString(str = '', id) {
    renderMap[id] = null

    if (str) {
        //renderMap 解決触发太频繁，而第一个返回结果，即使用的样式不对，应该使用最后一次
        const render = renderMap[id] = less.render(str, {})
        render.then(res => {
            if (render === renderMap[id]) {
                createStyle(res.css, id)
            }
        }).catch(e => {
            message.error('less 语法出错---', str)
        })
    }
}

function deleteStyle(id) {
    const style = document.getElementById(id)
    if (style) {
        document.head.removeChild(style);
    }
}

export function createGolbalStyleFromLessString(str) {
    createStyleFromLessString(str, globalId)
}

export function createPreviewStyleFromLessString(str, previewId, reload) {
    styleIdMap[previewId] = previewId
    if (reload || !document.getElementById(previewId)) {
        createStyleFromLessString(str, previewId)
    }
}

export function deleteGolbalStyle() {
    deleteStyle(globalId)
}

export function deletePreviewStyle() {
    for (let previewId in styleIdMap) {
        deleteStyle(previewId)
        delete styleIdMap[previewId]
    }
}
