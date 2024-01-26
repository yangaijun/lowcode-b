import { Form } from "freedomen"
import { useState } from "react"
import { message } from "antd"
import util, { history } from "libs/util"
import loginService from "services/Login"
import styles from "./index.module.less"

export default function Login() {
    const [formData, setFormData] = useState({
        userAccount: "admin",
        userPassword: "123456",
    })
    const [loading, setLoading] = useState(false)
    return (
        <div className={styles["freedomen-page"]}>
            <Form
                className={styles["form"]}
                data={formData}
                onSubmit={(data) => {
                    setLoading(true)
                    loginService
                        .login(data)
                        .then((res) => {
                            message.success("登录成功！")
                            //根据自己的数据结构处理
                            const { data = {} } = res
                            if (data.token) {
                                util.setToken(data.token)
                            }
                            history.push("/home")
                            //history.replace("") 登录成功跳转到相应首页
                        })
                        .catch((e) => {
                            setLoading(false)
                        })
                }}
                columns={[
                    { type: "text-div", value: "酒店管理后台登录", className: styles["text-div"] },
                    { type: "input", prop: "userAccount", placeholder: "请输入用户名", rule: { must: "用户名不能为空" } },
                    {
                        type: "input-password",
                        prop: "userPassword",
                        placeholder: "请输入密码",
                        rule: { must: "密码不能为空" },
                        config: { submitEventType: "pressEnter" },
                    },
                    [
                        { type: "button-primary", prop: "$submit", value: "登录", config: { shape: "round", loading: loading }, className: styles["drsubmit"] },
                        { type: "div", className: styles["div"] },
                    ],
                ]}
            />
        </div>
    )
}
