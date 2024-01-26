import { useMemo } from 'react'
import { renderCode, renderJs } from 'components/codeText'
import { toHook } from 'views/light/utils/icode'
import { useSelector } from 'react-redux'
import Bus, { BUS_KEYS } from 'views/light/bus'

export default function Code(props) {
    const { designList } = props
    const page = useSelector(selector => selector.page)

    return useMemo(() => {
        if (!page.pageId) {
            return renderJs({ value: `//请先选中您想要编辑的页面` })
        } else {
            return renderCode({
                value: toHook(designList, {
                    ...page,
                    //取最新改变的style class less 等值，  因为页面还没保存
                    ...Bus.get(BUS_KEYS.pageData)
                })
            })
        }
    }, [designList, page.pageId])
}