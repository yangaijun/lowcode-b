import Div from './div'
import Card from './card'
import Space from './space'
import Col from './col'
import Row from './row'
import Fragment from './fragement'
import FormItem from './formitem'
import InputGroup from './inputgroup'
import Popconfirm from './popconfirm'
import Spin from './spin'
import Tooltip from './tooltip' 
import Affix from './affix'

const containerMap: any = {
    div: Div,
    card: Card,
    space: Space,
    col: Col,
    row: Row,
    fragment: Fragment,
    formitem: FormItem,
    inputgroup: InputGroup,
    popconfirm: Popconfirm,
    spin: Spin,
    tooltip: Tooltip,
    affix: Affix
}

export const tableColumnGroupType = 'tablecolgroup'

export function getContainerDom(type: string) {
    return containerMap[type]
}

export const CONTAINER_NAMES = Object.keys(containerMap)
 