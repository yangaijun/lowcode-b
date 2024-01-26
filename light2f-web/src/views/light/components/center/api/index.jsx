import React from 'react'
import { renderCode } from 'components/codeText'
import { toService } from 'views/light/utils/icode'
import { useSelector } from 'react-redux'
import './index.module.less'

export default function Api() {
    const page = useSelector(selector => selector.page)

    return <div>
        {
            renderCode({
                value: (page.pageFileName ? `//当前文件路径：src/services/${page.pageFileName}.js\n` : '') + toService(page)
            })
        }
    </div>
}