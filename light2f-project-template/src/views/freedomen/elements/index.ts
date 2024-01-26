import Input from './input'
import Avatar from './avatar'
import Select from './select'
import Button from './button'
import Cascader from './cascader'
import Checkboxs from './checkboxs'
import Mentions from './mentions'
import InputNumber from './inputnumber'
import Divider from './divider'
import Date from './date'
import DateRange from './daterange'
import Dropdown from './dropdown'
import Image from './image'
import Img from './img'
import Progress from './progress'
import Rate from './rate'
import Radios from './radios'
import AutoComplete from './autocomplete'
import Slider from './slider'
import Switch from './switch'
import Tag from './tag'
import Tags from './tags'
import Text from './text'
import Tree from './tree'
import TreeSelect from './treeselect'
import Upload from './upload'
import Steps from './steps'
import TimePicker from './timepicker'
import TimeRange from './timerange'
import Segmented from './segmented'
import Alert from './alert'

const elementMap: any = {
    alert: Alert,
    avatar: Avatar,
    autocomplete: AutoComplete,
    input: Input,
    select: Select,
    button: Button,
    cascader: Cascader,
    checkboxs: Checkboxs,
    mentions: Mentions,
    inputnumber: InputNumber,
    date: Date,
    daterange: DateRange,
    divider: Divider,
    dropdown: Dropdown,
    image: Image,
    img: Img,
    progress: Progress,
    radios: Radios,
    rate: Rate,
    slider: Slider,
    switch: Switch,
    tag: Tag,
    tags: Tags,
    text: Text,
    tree: Tree,
    steps: Steps,
    treeselect: TreeSelect,
    upload: Upload,
    timepicker: TimePicker,
    timerange: TimeRange,
    segmented: Segmented 
}

export function getElementDom(type: string) {
    return elementMap[type]
}
