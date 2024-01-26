import { Router } from 'react-router-dom';
import { ConfigProvider, FloatButton, message, Modal } from 'antd';
import { CommentOutlined } from '@ant-design/icons'
import history from './libs/history';
import Routes from './components/Routes'
import routes from './routes'
import zhCN from 'antd/es/locale/zh_CN';
import store from './store'
import Freedomen, { Dialog, Form } from 'freedomen'
import { Provider } from 'react-redux'
import user, { UserType } from 'libs/user';
import * as ExFreedomen from 'ex-freedomen'
import config from 'config';
import { DocDialogName, TokenDialogName } from 'views/light/config';
import ApiUser from 'services/user'
import 'styles/index.less'
import './App.css';

Freedomen.setDefaultStyles({
  'text-div@title': {
    fontWeight: 700,
    fontSize: 24,
    margin: '10px 0'
  },
  'divider@form': {
    marginBottom: 5
  },
  'text@tip': {
    color: 'rgba(0, 0, 0, 0.45)',
    marginLeft: 8
  },
  'text@grey': {
    color: 'rgba(0, 0, 0, 0.45)'
  },
  'card@form': {
    marginTop: 15
  }
})

Freedomen.setDefaultConfigs(() => {
  return {
    '-g@small': {
      size: 'small'
    },
    Form: {
      labelCol: { span: 4 }
    },
    'select*': {
      allowClear: true
    },
    'input,input@*,input-*': {
      allowClear: true,
      changeEventType: 'blur'
    },
    'autocomplete*': {
      changeEventType: 'blur'
    },
    //上传
    'upload*': {
      action: '/lightApi/User/upload',
      headers: {
        'token': user.getToken()
      },
      onSuccess: (value) => {
        return value
      },
      onError: (rsp) => {
        message.error(rsp.message)
      },
      filter: ({ value }) => `${config.imageBaseUrl}/${value}`
    },
    'quill*': {
      action: '/lightApi/User/upload',
      headers: {
        'token': user.getToken()
      },
      onSuccess: (value) => {
        return `${config.imageBaseUrl}/${value}`
      }
    }
  }
})
//register custom render
Freedomen.registerRender('quill', ExFreedomen.Quill)
  .registerRender('uploadFolder', ExFreedomen.Upload)

function App() {

  return (
    <Provider store={store}>
      <Dialog name={DocDialogName} width={800} noForm className="drag-dialog" />
      <Dialog name={TokenDialogName} width={600} />
      <Dialog name={"feedback"} width={680} title="问题反馈" >
        <Form
          data={{ logType: 'feedback' }}
          onSubmit={data => {
            Dialog.loading("feedback")
            ApiUser.feedback(data).then(res => {
              message.success("已反馈，谢谢！")
              Dialog.close("feedback")
            })
          }}
          columns={[
            { type: 'quill', prop: 'logInfo', placeholder: "请输入遇到的问题，或建议。如：仓储管理项目可以做吗，会有什么问题？为什么没有富文本，代码编辑器组件？做一套**系统成本怎么样？公司有比较多的后台，可以定制自动生成吗？想做一套很大的ERP系统不敢使用怎么办？可不可以做一套CMS实例项目？", rule: { must: "请输入需要反馈的内容" }, config: {help: "如果是使用上或需要及时知道结果请使用 issues 或关注订阅号私聊"} }
          ]}
        />
      </Dialog>

      <FloatButton icon={<CommentOutlined />} description="反馈" shape="square" onClick={() => {
        if (user.getRoleType() !== UserType.User) {
          Modal.confirm({
            title: "提示",
            content: "请先登录~"
          })
        } else {
          Dialog.open("feedback")
        }
      }} />

      <ConfigProvider locale={zhCN}>
        <Router history={history}>
          <Routes routes={routes} />
        </Router>
      </ConfigProvider>
    </Provider>
  );
}

export default App;
