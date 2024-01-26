import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { Provider } from 'react-redux';
import Router from 'routes/Router';
import store from 'store';
import './freedomenConfig'
import './App.less';

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <Router />
      </ConfigProvider>
    </Provider>
  );
}

export default App;
