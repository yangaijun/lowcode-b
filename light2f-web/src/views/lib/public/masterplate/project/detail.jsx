import { useEffect, useState } from 'react';
import { message } from 'antd';
import { CssEditor, FdConfigEditor, FdGlobalDataEditor } from 'components/Editors';
import { Form } from 'freedomen';
import { useDispatch, useSelector } from 'react-redux';
import ApiMasterplateProject from 'services/masterplate_project';
import { setLight } from 'slices/loadingSlice';
import history from 'libs/history';
import styles from './index.module.less';
import { freedomenConfigLabel, freedomenGlobalDataLabel, globalLessLabel } from 'views/light/components/panel/component/doc';
import { setGlobalDataCompletions } from 'views/light/components/panel/component/renders';
import { getConstNameByStr, parseURLParams } from 'libs/utils';
import ILink from 'components/ILink';

export const configColumns = [
    {
        render() {
            return <div className={styles.ftitle}>Axios（http库）基本配置:</div>
        }
    },
    {
        type: 'input',
        prop: 'masterplateProjectBaseUrl',
        label: '服务器基本路径(每个接口都相同的部分)',
        config: {
            maxLength: 256,
            required: false,
            help: <>在线调试存在跨域问题，具体解决请查看文档<ILink url={'/doc/light/api'}>接口</ILink></>
        },
        placeholder: '如：http://localhost:8080/projectName，注意要加上协议(http[s]://)'
    },
    { type: 'input', prop: 'masterplateProjectTokenName', label: 'Token名(服务端从headers中取Token时键的名称)', config: { maxLength: 24 }, placeholder: 'header中传给服务端的token名称， 如:token、x-token、Authorization' },
    { type: 'select', prop: 'masterplateProjectContentType', label: 'ContentType(到服务端的数据类型)', placeholder: '传到服务端的数据类型, default: application/json', options: 'application/json,multipart/form-data,application/x-www-form-urlencoded' },
    {
        render() {
            return <div className={styles.ftitle}>项目其它配置:</div>
        }
    },
    { render: FdGlobalDataEditor, prop: 'masterplateProjectData', label: freedomenGlobalDataLabel },
    {
        render: FdConfigEditor,
        label: freedomenConfigLabel,
        prop: 'masterplateProjectFreedomenConfig',
        config: {
            help: '使用可以$util.getToken(),$current.baseURL 等方法，输入$会有提示'
        }
    },
    { render: CssEditor, prop: 'masterplateProjectStyle', label: globalLessLabel }
]

export default function Detail() {
    const dispatch = useDispatch()
    const [data, setData] = useState({ masterplateProjectType: 'private' })
    const [permission, setPermission] = useState(false)
    const { id, insertType } = parseURLParams();

    const { light } = useSelector(selector => selector.loading)

    useEffect(() => {
        if (!id) return

        dispatch(setLight(true))
        const parmas = { masterplateProjectId: id }
        Promise.all([
            ApiMasterplateProject.selectById(id),
            ApiMasterplateProject.permission(parmas)
        ]).then(([mp, permission]) => {
            dispatch(setLight(false))
            if (Object.keys(mp).length) {
                if (insertType) {
                    mp.masterplateProjectType = 'private'
                }
                setData(mp)
                if (mp.masterplateProjectData) {
                    setGlobalDataCompletions(getConstNameByStr(mp.masterplateProjectData))
                }
            }
            setPermission(permission)
        })
    }, [id, insertType])

    const preText = (id ? (insertType ? "复制" : "修改") : "创建")
    const hasPremission = insertType ? true : (!id || permission)

    if (light) return null;

    return <div className={"main-center"}>
        <div className={styles.title}>
            {hasPremission ? (preText + "项目母版") : "项目母版详情"}
        </div>
        <Form
            data={data}
            config={{ layout: 'vertical', labelCol: undefined }}
            onSubmit={data => {
                dispatch(setLight(true))
                //以复制方式
                if (insertType) {
                    data.insertType = insertType
                }
                if (data.masterplateProjectData) {
                    try {
                        data.masterplateProjectData = window.codeFormart(data.masterplateProjectData)
                    } catch (error) {
                        message.error('全局数据语法错误，请检查！')
                        return
                    }
                }
                if (data.masterplateProjectFreedomenConfig) {
                    try {
                        data.masterplateProjectFreedomenConfig = window.codeFormart(data.masterplateProjectFreedomenConfig)
                    } catch (error) {
                        message.error('freedomen配置语法错误，请检查！')
                        return
                    }
                }
                ApiMasterplateProject.insertOrUpdate(data).then(_ => {
                    message.success(preText + '成功!')
                    history.goBack()
                })
            }}
            onEvent={(params) => {
                if (params.type === 'blur' && params.prop === 'masterplateProjectData') {
                    setGlobalDataCompletions(getConstNameByStr(params.value), false)
                }
            }}
            columns={[
                { type: 'input', prop: 'masterplateProjectName', label: '母版名称', placeholder: '请输入名称，如：通用CMS系统母版', rule: 'must', config: { maxLength: 12 } },
                { type: 'select', prop: 'todo', label: '脚手架(使用create-react-app创建的基本可运行项目)', value: '缺省', disabled: true },
                { type: 'input-area', prop: 'masterplateProjectDes', placeholder: '输入相关项目脚手架的描述', label: '描述', config: { rows: 5, maxLength: 255 } },
                { type: 'switch', prop: 'masterplateProjectType', value: 'private', label: '保密性', config: { help: '关闭后，其他人也可以使用', uncheckedValue: 'public', checkedValue: 'private', checkedChildren: '私有的', unCheckedChildren: '公共的' } },
                ...configColumns,
                { type: 'button-primary', prop: '$submit', value: '保存', load: () => hasPremission }
            ]}
        />
    </div>
}