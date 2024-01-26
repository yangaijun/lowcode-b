import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Collapse } from 'antd';

const { Panel } = Collapse;

export function render({ value, $base: { config } }) {
    return <Collapse
        ghost
        bordered={false}
        defaultActiveKey={[config?.activeKey]}
    >
        <Panel header="code" key="1">
            <SyntaxHighlighter language="jsx" style={docco}>
                {value}
            </SyntaxHighlighter>
        </Panel>
    </Collapse>
}

export function renderCode({ value }) {
    return <SyntaxHighlighter
        showLineNumbers={false}
        language="jsx"
        style={docco}>
        {value}
    </SyntaxHighlighter>
}

export function renderJs({ value }) {
    return <SyntaxHighlighter
        showLineNumbers={false}
        language="jsx"
        style={docco}>
        {value}
    </SyntaxHighlighter>
}

export function renderLess({ value }) {
    return <SyntaxHighlighter
        showLineNumbers={false}
        language="less"
        style={docco}>
        {value}
    </SyntaxHighlighter>
}
/**
 * 去掉没用空格
 * @param {string} str 
 * @returns 
 */
export function clearInvalidSpace(str = '') {
    let nIndex = str.indexOf('\n');
    if (nIndex !== -1) {
        let k = 0
        for (let i = nIndex + 1; i < str.length; i++) {
            if (str[i] !== ' ') break
            k++
        }
        if (k > 4) {
            let spaceString = new Array(k - 4)
            str = str.replaceAll("\n" + spaceString.fill(' ').join(''), '\n')
        }
    }
    return str
}