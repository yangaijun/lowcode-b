import { Tabs } from "antd";
import PublicProject from "./public";
import SelfProject from "./self";

const tabKey = {
    self: 'self',
    public: 'public'
}

export default function ProjectPlate({ w, onChange }) {

    const items = [
        {
            key: tabKey.self,
            label: `我的`,
            children: <SelfProject />,
        },
        {
            key: tabKey.public,
            label: `公共`,
            children: <PublicProject />,
        }
    ]

    return <Tabs activeKey={w} items={items} onChange={onChange} type="card" />
}