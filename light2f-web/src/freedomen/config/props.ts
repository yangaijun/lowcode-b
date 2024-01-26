export const formItemProps = [
  'colon',
  'help',
  'htmlFor',
  'extra',
  'label',
  'required',
  'labelCol',
  'labelAlign',
  'noStyle',
  'tooltip',
  'wrapperCol', 
  'validateFirst',
  'messageVariables'
]

export const tableColumnProps = [
  'align',
  'colSpan',
  'defaultFilteredValue',
  'defaultSortOrder',
  'editable',
  'filterDropdown',
  'filterDropdownVisible',
  'filtered',
  'filteredValue',
  'filterIcon',
  'filterMultiple',
  'filterMode',
  'filterSearch',
  'filters',
  'fixed',
  'responsive',
  'sorter',
  'sortOrder',
  'onCell',
  'ellipsis',
  'onFilter',
  'onFilterDropdownVisibleChange',
  'onHeaderCell'
]

export const names = {
  optionvalue: 'optionvalue',
  labelname: 'label',
  valuename: 'value',
  childrenname: 'children'
}
//filter 为 {}, 的 default
export const filterDefaultKey = '$default'
//值为 void 时候
export const defaultFilterVoidText = '--'
//form，验证时候字段可以为空
export const emptyValue = 'empty'
//form emptyKey 不显示 验证的小红 *
export const emptyKey = '$withEmpty'
//region reset prop
export const resetProp = '$reset'
//form submit prop
export const submitProp = '$submit'
//list delete prop
export const deleteProp = '$delete'
//list delete confirm
export const deleteTipProp = '$delete-confirm'
//list add prop
export const pushProp = '$push' 
//一些输入组件可以直接触发表单提交的类型可以，如input 的 pressEnter 等, submitEventType = "pressEnter" / ["pressEnter"]
export const submitEventType = 'submitEventType'
//注册组件， 注册后可以被event 代理，可以直接取到区域值
export const proxyEvents = 'proxyEvents'
//表格分页改变
export const tablePageChangeProp = '$page'
//表格点击排序
export const tableSorterType = 'sorter'
//表格选择
export const tableSelectionProp = '$selection'
//custome Type
export const customTypeProp = '$customType'
//change事件名
export const changeType = 'change'
//click 事件名
export const clickType = 'click'
//table
export const defaultPage = {
  pageNo: 1,
  pageSize: 10
}
//options触发防抖等待时间
export const defaultDebounceWait = 280
//是否被Render处理，复制自动注入数据、事件
export const isRenderComponent = '__isRenderComponent'
//formList 使用
export const hasNameProp = '__hasNameProp'