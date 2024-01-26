import { Tabs } from "antd";
import { Dialog } from "freedomen";
import PublicPage from "./public";
import SelfPage from "./self";

const tabKey = {
    self: 'self',
    public: 'public'
}

export default function ProjectPlate({ w, onChange }) {
    const items = [
        {
            key: tabKey.self,
            label: '我的',
            children: <SelfPage />
        },
        {
            key: tabKey.public,
            label: '公共',
            children: <PublicPage />
        }
    ]
    
    return <>
        <Dialog name="masterplatePage" />
        <Tabs activeKey={w} items={items} onChange={onChange} type="card" destroyInactiveTabPane />
    </>
}