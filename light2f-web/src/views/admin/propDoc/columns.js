import { PlusOutlined } from "@ant-design/icons"
import { Divider } from "antd"
import { DefaulutEditor } from "components/Editors"
import { FormList } from "freedomen"
import styles from './index.module.less'
const wrapperCol = { offset: 4 }
export const propDocColumns = [
    {
        prop: 'list', render() {
            return <FormList
                columns={[
                    {
                        prop: '$index', render({ value }) {
                            return <Divider orientation="center" className={styles.ptitle}>第 {value + 1} 种方案</Divider>
                        }
                    },
                    { type: 'button@small', prop: '$delete', value: '删除方案', config: { wrapperCol } },
                    { type: 'input-area', label: '描述', prop: 'componentPropDocRem', config: { maxLength: 2048, rows: 4 } },
                    {
                        render: DefaulutEditor, label: 'code', prop: 'componentPropDocCode', rule: ({ data }) => {
                            if (!data.componentPropDocRem && !data.componentPropDocCode) {
                                return Promise.reject("描述与code至少需要有一个有值")
                            }

                            return Promise.resolve()
                        }, config: {
                            help: '如果有函数请使用es6语法: () => {}, 请不要使用function(){}语法'
                        }
                    },
                ]}
            />
        }
    },
    {
        type: 'button-dashed', prop: 'add', value: '新增方案', style: { width: '100%' }, config: {
            icon: <PlusOutlined />,
            wrapperCol
        }
    }
]