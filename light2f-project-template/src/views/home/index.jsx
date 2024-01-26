import { Region } from "freedomen"
import homeService from "services/home"
import { Search } from "views/freedomen copy"
import styles from "./index.module.less"

export default function Home() {
    return (
        <div className={"freedomen-page"}>
             <Search
                className={"search"}
                columns={[
                    { type: "input", prop: "recordMark", label: "备注", placeholder: "请输入备注" },
                    { type: "input", prop: "recordMark", label: "备注", placeholder: "请输入备注" },
                    { type: "input", prop: "recordMark", label: "备注", placeholder: "请输入备注" },
                    { type: "input", prop: "recordMark", label: "备注", placeholder: "请输入备注" },

                    { type: "input", prop: "recordMark", label: "备注", placeholder: "请输入备注" },
                    { type: "input", prop: "recordMark", label: "备注", placeholder: "请输入备注" },
                    { type: "input", prop: "recordMark", label: "备注", placeholder: "请输入备注" },
                    { type: "input", prop: "recordMark", label: "备注", placeholder: "请输入备注" },
                    { type: "input", prop: "recordMark", label: "备注", placeholder: "请输入备注" },
                    { type: "input", prop: "recordMark", label: "备注", placeholder: "请输入备注" },
                    { type: "button", prop: "$reset", value: "重置" },
                ]}
            />

            <Region
                columns={[
                    [
                        [
                            { type: "text-b", value: "欢迎使用使用 light2f 在线开发的酒店管理系统", className: styles["text-b"] },
                            { type: "text", value: "服务端使用 springboot + mybatis-plus + mysql （代码自动生成 + 手写）完成" },
                            { type: "text", value: "前端已经看到了，使用 light2f 在线开发工具生成的 react18 + antd5 单页项目" },
                            [
                                { type: "text", value: "开发耗时一小时，全程开发视频地址：" },
                                { type: "text-a", value: "接口文档地址", config: { href: "https://github.com/yangaijun/hotelapidoc", target: "_blank" } },
                                { type: "space" },
                            ],
                            { type: "text", value: "接口是开放的，可以公共调用" },
                            { type: "space-vertical" },
                        ],
                        { type: "card", value: "酒店管理系统" },
                    ],
                ]}
            />
        </div>
    )
}
