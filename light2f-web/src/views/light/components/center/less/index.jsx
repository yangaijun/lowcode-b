import { renderLess } from 'components/codeText'
import { toPageLess } from 'views/light/utils/icode'
import Bus, { BUS_KEYS } from 'views/light/bus'

export default function Less({ designList }) {

    return <div>
        {renderLess({
            value:"//当前文件路径：./index.module.less\n" + toPageLess({
                designList,
                ...Bus.get(BUS_KEYS.pageData)
            })
        })}
    </div>
}