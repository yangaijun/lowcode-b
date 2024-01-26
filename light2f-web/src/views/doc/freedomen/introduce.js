import { Typography } from "antd";
import { Region } from "freedomen";
import { AntdURL } from "libs/contants";

const { Text } = Typography
export default function FIntroduce() {
    return (<div>
        <Region
            columns={[
                { type: 'text-div@title', value: "Freedomen 简介" },
                {
                    type: 'text',
                    className: 'des',
                    value: <>
                        Freedomen 本身也是像 antd 一样的开源的，也是以 <a href={AntdURL} target="_blank">antd</a> 为主材料的UI框架。
                        可以直接免费安装使用，其主要是对组件进行代理，统一字段名，以及对加载、失效、样式等在不影响其现有功能情况下添加控制，并组件数据化等，
                        使数据结构更简单统一，从而方便开发。更加方便结合 Light(本站可视化设计器) 工具实现代码生成
                    </>
                }
            ]}
        />
        <div className="label2">
            安装
        </div>
        <div className="doc-content">
            1. 安装antd： <Text code>npm i antd</Text><br />
            2. 安装freedomen： <Text code>npm i freedomen</Text> <br />
            注: freedomen2.x 对应 antd4； 当前是 freedomen3.x 对应 antd5
        </div>
        <div className="label2">
            使用
        </div>
        <div className="doc-content">
            引入：<Text code>import {"{ Form }"} from "freedomen"</Text> <br />

            使用：<Text code>
                export default function() {`{
                    return <Form 
                        columns={[
                            {type: 'input'}
                        ]}
                    />
                }`}
            </Text>
        </div>

        <div className="label2">
            地址
        </div>
        <div className="doc-content">
            Freedomen仓库地址：<a href="https://github.com/yangaijun/freedomen" target="_blank"> github 新窗口链接 </a>
        </div>
    </div>)
}