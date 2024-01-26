import { Region } from 'freedomen'
import { render, renderCode } from 'components/codeText'

const f1 =
    `<Region  
    columns={[ 
        [
            { type: 'button-link', prop: 'b1', value: '删除' },
            { type: 'button-link', prop: 'b2', value: '修改' },
            { type: 'fragment' }
        ]
    ]}
/>`
export default function DFragment() {
    return <div >
        <Region
            data={{
                use: `type: 'fragment'`, f1
            }}
            columns={[
                { type: 'text-div@title', value: 'Fragment 空标签' },
                { prop: 'use', render: renderCode },
                [
                    {
                        render() {
                            return <Region
                                columns={[
                                    [
                                        { type: 'button-link', prop: 'b1', value: '删除' },
                                        { type: 'button-link', prop: 'b2', value: '修改' },
                                        { type: 'fragment' }
                                    ]
                                ]}
                            />
                        }
                    },
                    { type: 'divider@form' },
                    { prop: 'f1', render },
                    { type: 'card@form', value: '1. 基本使用' }
                ]
            ]}
        />
        <div style={{
            backgroundColor: '#eef2ff',
            padding: 10,
            marginBottom: 5,
            marginTop: 25
        }}>
            <strong>提示：</strong> 同 React.Fragment {"<></>"}
        </div>
    </div>
}