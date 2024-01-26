import { Spin } from 'antd';
import { useSelector } from 'react-redux';

export default function LightLayout(props) {
    const { light } = useSelector(selector => selector.loading)

    return <Spin spinning={light}>
        {props.children}
    </Spin>
} 
