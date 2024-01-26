import CodeEditor from 'components/CodeEditor';
import { defaultCompletions, utilCompletions } from 'views/light/components/panel/component/renders';

export const FdGlobalDataEditor = ({ value, $base: { onChange, onEvent, placeholder } }) => {
    return <div onDoubleClick={_ => { onEvent('dbclick', { value }) }}>
        <CodeEditor
            isSet={true}
            value={value}
            placeholder={placeholder || "请输入如：const options = []"}
            style={{ height: 310, width: 632 }}
            onBlur={() => {
                onEvent('blur', value)
            }}
            onChange={onChange}
        />
    </div>
}

export const FdConfigEditor = ({ value, $base: { onChange, onEvent } }) => {
    const configCompletions = [
        { name: 'fss', value: 'Freedomen.setDefaultStyles({\n\n})\n', meta: '样式' },
        { name: 'fsc', value: 'Freedomen.setDefaultConfigs({\n\n})\n', meta: '配置' },
        { name: 'fscs', value: 'Freedomen.setDefaultClasses({\n\n})\n', meta: 'class' },
        { name: 'fsr', value: 'Freedomen.registerRules({\n\n})\n', meta: '验证' },
        //加载权限
        { name: 'fsp', value: 'Freedomen.setPermission(({ column, data, value }) => {\n    return true\n})\n', meta: '加载' },
        //失效权限
        { name: 'fsd', value: 'Freedomen.setDisabled(({ column, data, value }) => {\n    return false\n})\n', meta: '失效' },
        //当前配置中数据
        { name: 'baseURL', value: '$current.baseURL', meta: 'axios基本路径' },
        { name: 'projectName', value: '$current.projectName', meta: '项目名称' },
        { name: 'tokenName', value: '$current.tokenName', meta: 'Token名称' },
        { name: 'contentType', value: '$current.contentType', meta: '到服务端的数据类型' },
        ...utilCompletions,
        ...defaultCompletions.globalDataCompletions
    ]

    return <div onDoubleClick={_ => { onEvent('dbclick', { value }) }}>
        <CodeEditor
            isSet={true}
            value={value}
            placeholder={"请输入配置"}
            completions={configCompletions}
            style={{ height: 310, width: 658 }}
            onChange={onChange}
        />
    </div>
}

export const CssEditor = ({ value, $base: { onChange, onEvent } }) => {
    return <div onDoubleClick={_ => { onEvent('dbclick', { value, mode: 'less' }) }}>
        <CodeEditor
            mode="less"
            value={value}
            placeholder={"请输入 less "}
            style={{ height: 310, width: 658 }}
            onChange={onChange}
        />
    </div>
}

export const DefaulutEditor = ({ value, $base: { onChange, style, placeholder } }) => {
    return <CodeEditor
        value={value}
        placeholder={placeholder}
        mode="json"
        style={Object.assign({ height: 200, width: '100%' }, style)}
        onChange={onChange}
    />
}  