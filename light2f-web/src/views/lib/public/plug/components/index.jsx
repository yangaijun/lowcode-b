import { Dialog, Form } from 'freedomen'
import { codeRender_data, codeRender_disabled, codeRender_rule, codeRender_event, codeRender_filter } from "views/light/components/panel/component/renders";
import ApiPlugUse from 'services/plug_use'
import ApiProject from 'services/project'
import ApiPlug from 'services/plug'
import { message, Tag } from 'antd';
import { ComponentType, PropType } from 'views/light/types';
import { getSpace } from 'views/light/utils/util';
import { freedomenTypes } from 'libs/contants';
import { disabledCopyLabel, ruleCopyLabel, filterCopyLabel, getFormItemLabelWithDocs, useType } from 'views/light/components/panel/component/doc';
import { getChannel } from 'libs/utils';

const formPropColumns = [
    { type: 'input', prop: 'label', label: 'label', value: '自定义的组件', config: { maxLength: 10 } },
    { prop: 'rule', label: ruleCopyLabel, render: codeRender_rule }
]

const defaultPropColumns = {
    prop: { type: 'input', prop: 'prop', label: 'prop', placeholder: '请输入prop', rule: 'must' },
    value: { prop: 'value', label: '缺省值', render: codeRender_data, placeholder: '请输入缺省值' },
    placeholder: { type: 'input', prop: 'placeholder', label: 'placeholder', placeholder: '请输入placehoder' },
    filter: { render: codeRender_filter, label: filterCopyLabel, prop: 'filter' },
    disabled: { prop: 'disabled', label: disabledCopyLabel, placeholder: 'disabled', render: codeRender_disabled }
}

export const customType = "customplug"

export const defaultPlugColumn = { type: customType, label: '自定义的组件', prop: customType }

export const submitButtonColumns = {
    type: 'button-primary',
    value: '提交',
    prop: '$submit',
    config: {
        wrapperCol: { offset: 4 }
    }
}

const columnSequence = [
    'prop',
    'type',
    'label',
    'placeholder',
    'value',
    'filter',
    'disabled',
    'options',
    'style',
    'rule',
    'config'
]
/**
 * 
 * @param {plugBaseProps: string[], plugCustomProps: any[]} param0 
 * @returns 
 */
export const getPlugPropForm = ({ plugBaseProps = [], plugCustomProps = [], doc = {} }, onSubmit = () => { }) => {
    const columns = [...formPropColumns]
    //base属性
    for (let item of plugBaseProps) {
        if (defaultPropColumns[item]) {
            columns.push(defaultPropColumns[item])
        }
    }
    //custom属性
    for (let item of plugCustomProps) {
        const column = {
            prop: item.prop,
            label: doc[item.$key] ? getFormItemLabelWithDocs(item.prop, doc[item.$key].list, useType.copy) : item.prop,
            placeholder: item.help,
            config: { help: item.help }
        }

        if (item.type === PropType.fn) {
            column.render = codeRender_event
            column.value = `(params) => {\n${getSpace()}\n}`
        } else if (item.type === PropType.number) {
            column.type = 'inputnumber'
        } else {
            column.type = 'input'
        }

        columns.push(column)
    }
    //排序
    columns.sort((a, b) => {
        const aIndex = columnSequence.indexOf(a.prop)
        const bIndex = columnSequence.indexOf(b.prop)

        return (aIndex === - 1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex)
    }) 

    return <Form
        data={{ prop: 'testProp' }}
        config={{ labelCol: { span: 6 } }}
        style={{ maxHeight: 520, overflowY: 'auto', paddingRight: 12 }}
        onSubmit={(data) => {
            const newData = {}
            for (let key in data) {
                if (/^[A-Za-z]+$/.test(data[key])) {
                    newData[key] = data[key]
                } else {
                    try {
                        newData[key] = eval('(' + data[key] + ')')
                    } catch (error) {
                        newData[key] = data[key]
                    }
                }
            }
            onSubmit(newData)
        }}
        columns={columns}
    />
}

export const getAddToMeForm = (data = {}, projectId, onSuccess) => {
    const formData = {
        plugUseName: data.plugName,
        plugUseType: data.plugTname,
        plugUseVersion: data.plugVersion,
        plugId: data.plugId,
        plugSameId: data.plugSameId,
        projectId
    }
    return <Form
        data={formData}
        onSubmit={data => {
            Dialog.loading("addToMe")

            ApiPlugUse.insertOrUpdate(data).then(() => {
                message.success('添加成功！')
                
                const channel = getChannel()
                channel.postMessage("loadApiPlugUse")
                channel.close()

                Dialog.close("addToMe")
                onSuccess && onSuccess()
            })
        }}
        columns={[
            { type: 'input', label: '名称', placeholder: '请输入名称，中文', prop: 'plugUseName', rule: 'must', config: { maxLength: 40 } },
            {
                type: 'select',
                label: '到项目',
                prop: 'projectId',
                placeholder: '选择将组件添加到项目中',
                options({ resolve }) { 
                    Promise.all([ApiProject.select(), ApiPlugUse.select()]).then(([projects, plugUses]) => { 
                        resolve(projects.map(el => {
                            const disabled = !!plugUses.find(p => {
                                return el.projectId === p.projectId && data.plugId === p.plugId
                            })

                            return {
                                label: disabled ? el.projectName + "(已添加)" : el.projectName,
                                value: el.projectId,
                                disabled,
                            }
                        }))
                    })

                },
                rule: 'must',
                config: { filterable: true, help: '将组件添加到此项目中' }
            },
            {
                type: 'input',
                label: '类型名',
                prop: 'plugUseType',
                placeholder: '类型名，全小写英文，如button',
                rule({ value, data }) {
                    if (!value) return Promise.reject("请输入类型名")
                    if (freedomenTypes.includes(value)) return Promise.reject("预订义类型名称不以使用")
                    if (!/^[a-z]+$/.test(value)) return Promise.reject('建议使用全小写字母')

                    return new Promise((resolve, reject) => {
                        ApiPlugUse.uniqueType({ plugUseType: value, projectId: data.projectId }).then(res => {
                            if (res) resolve()
                            else reject("类型已使用，请更换")
                        })
                    })
                },
                config: { maxLength: 40 }
            },
            {
                type: 'select',
                label: '使用版本',
                prop: 'plugUseVersion',
                options({ resolve, data }) {
                    ApiPlug.selectBySameId(data.plugSameId).then(res => {
                        const options = res.map(el => {
                            return {
                                value: el.plugVersion,
                                label: 'version: ' + el.plugVersion
                            }
                        })
                        resolve(options)
                    })
                },
                rule: { must: '请选择版本' }
            }
        ]}
    />
}


export const getTypeTag = (type) => {
    return <Tag color="#108ee9" title={
        type === ComponentType.element ? '如:input,button' : '如: div, p'
    }>
        {type === ComponentType.element ? "元素" : "容器"}
    </Tag>
}