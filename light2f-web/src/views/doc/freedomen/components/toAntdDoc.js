import { Button } from "antd";
import { AntdURL } from "libs/contants";

export default function ToAntdDoc({ text, name, api = 'api' }) {
    return <Button
        type="link"
        target="_blank"
        style={{ marginLeft: -14 }}
        href={`${AntdURL}/components/${name}-cn/#${api}`}
    >
        {text}
    </Button>
}