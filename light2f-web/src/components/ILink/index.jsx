
import { Button } from 'antd'

export default function ILink({ url, target = 'blank', children, fontSize, style }) {
    return <Button size='small' type='link' href={`#${url}`} target={target} style={{ ...style, fontSize }}>
        {children}
    </Button>
}