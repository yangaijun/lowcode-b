import { Button } from "antd";

export default function ToColumns(props) {
    const { type = "Region" } = props
    return <Button
        type="link"
        target="_blank"
        style={{ marginLeft: -14 }}
        href={`#/doc/freedomen/types?id=columns&type=${type}`}
    >
        ColumnsType
    </Button>
}