import { useState, useEffect } from 'react';
import { FloatButton } from "antd";
import classnames from 'classnames';
import './index.less';

export default function LightVideoLayout(props) {
    const { location: { pathname = '' } } = props.history
    const [activity, setActivity] = useState(pathname.substring(1))

    useEffect(() => {
        setActivity(pathname)
    }, [pathname])

    const getLi = (name, text) => {
        const path = `/doc/video/${name}`
        return <li key={name} className={classnames({ 'video-doc-activity': activity === path })} onClick={_ => {
            if (activity !== path) {
                setActivity(name)
                props.history.push(`/doc/video/${name}`)
            }
        }}>{text}</li>
    }

    return <div style={{ display: 'flex' }} >
        <div className="video-doc-left" >
            <ul style={{ paddingTop: 12 }}>
                {
                    [
                        { name: 'basic', text: 'Basic' },
                        { name: 'example', text: '完整项目实战' }
                    ].map((el) => getLi(el.name, el.text))
                }
            </ul>
        </div>
        <div className='video-doc-center'>
            <FloatButton.BackTop />
            {props.children}
        </div>
    </div>
}
