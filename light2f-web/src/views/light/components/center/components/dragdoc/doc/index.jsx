import { useCallback, useEffect, useState } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import DocDetails, { details } from './page'
import styles from './index.module.less'
import { Select } from 'antd'

export default function Doc() {
    const [content, setContent] = useState(null)
    const [currentId, setCurrentId] = useState(null)
    const [searchOptions, setSearchOptions] = useState([])

    const list = [
        {
            title: "快速开始",
            des: "了解如何在线从零到一设计完整后台系统的前端功能，以便我们能够快速使用。从一个简单的酒店管理系统到一个复杂的 ERP 系统来渐进介绍快速开发系统产品",
            children: [
                {
                    title: DocDetails.UseStart.title,
                    children: DocDetails.UseStart
                },
                {
                    title: DocDetails.UseLocal.title,
                    children: DocDetails.UseLocal
                }
            ]
        },
        {
            title: "项目母版设置",
            des: "每个项目都会初始化一个脚手架，可以用来全局配置，如 axios(http库)，全局样式、全局数据、UI框架全局属性配置等",
            children: [
                {
                    title: DocDetails.ProjectConfig.title,
                    children: DocDetails.ProjectConfig
                }
            ]
        },
        {
            title: "页面相关",
            des: "系统由一张张页面组成，用来进行管理功能设计，如用户管理、订单管理、权限管理等",
            children: [
                {
                    title: DocDetails.PageCreate.title,
                    children: DocDetails.PageCreate
                },
                {
                    title: DocDetails.PageMenu.title,
                    children: DocDetails.PageMenu
                },
                {
                    title: DocDetails.PageRouter.title,
                    children: DocDetails.PageRouter
                }
            ]
        },
        {
            title: "组件相关",
            des: "页面由一个个组件结合搭配而成，所以组件只能放在页面中。如表单、表格、查询、弹窗、消息提示等等",
            children: [
                {
                    title: DocDetails.CmpMsg.title,
                    children: DocDetails.CmpMsg
                },
                {
                    title: DocDetails.CmpRegion.title,
                    children: DocDetails.CmpRegion
                },
                {
                    title: DocDetails.CmpSearch.title,
                    children: DocDetails.CmpSearch
                },
                {
                    title: DocDetails.CmpForm.title,
                    children: DocDetails.CmpForm
                },
                {
                    title: DocDetails.CmpFormList.title,
                    children: DocDetails.CmpFormList
                },
                {
                    title: DocDetails.CmpTable.title,
                    children: DocDetails.CmpTable
                },
                {
                    title: DocDetails.CmpList.title,
                    children: DocDetails.CmpList
                }
            ]
        },
        {
            title: "模态框相关",
            des: "弹出层，组件的一样，用于强交互操作等，前缀有 F 表示是表单，因为使用频率高，所以对应组件中已经固定放入了表单",
            children: [
                {
                    title: DocDetails.ModalFDialog.title,
                    children: DocDetails.ModalFDialog
                },
                {
                    title: DocDetails.ModalDialog.title,
                    children: DocDetails.ModalDialog
                },
                {
                    title: DocDetails.ModalFDrawer.title,
                    children: DocDetails.ModalFDrawer
                },
                {
                    title: DocDetails.ModalDrawer.title,
                    children: DocDetails.ModalDrawer
                }
            ]
        },
        {
            title: "模块相关",
            des: "抽象出项目中相同的组件、功能、逻辑。如远程获取公司列表选项组件，查询组件与逻辑（获取表单数据，调用接口，保存接口数据），多个连续相同字段的组件等等",
            children: [
                {
                    title: DocDetails.ModelCreate.title,
                    children: DocDetails.ModelCreate
                },
                {
                    title: DocDetails.ModelUse.title,
                    children: DocDetails.ModelUse
                }
            ]
        },
        {
            title: "预定义相关",
            des: "同 react 中的 useState, useRef, useCallback, useEffect，用于保存数据，个性处理等",
            children: [
                {
                    title: DocDetails.PreviewCreate.title,
                    children: DocDetails.PreviewCreate
                },
                {
                    title: DocDetails.PreviewUse.title,
                    children: DocDetails.PreviewUse
                }
            ]
        },
        {
            title: "接口相关",
            des: "定义与服务端通信接口相关信息",
            children: [
                {
                    title: DocDetails.ApiCreate.title,
                    children: DocDetails.ApiCreate
                },
                {
                    title: DocDetails.ApiUse.title,
                    children: DocDetails.ApiUse
                }
            ]
        }
    ]

    const onSearch = useCallback((v) => {
        if (v?.trim() === "") {
            setSearchOptions([])
        } else {
            const options = []
            for (let key in details) {
                details[key].forEach((el, index) => {
                    const str = DocDetails[key].title + "=>" + el.title
                    if (str.toUpperCase().includes(v.toUpperCase())) {
                        const label = <span dangerouslySetInnerHTML={{
                            __html: str.replace(new RegExp('(' + v.replaceAll('$', "\\$") + ')', "ig"), `<span style="color:#409eff">$1</span>`)
                        }} />

                        options.push({ value: key + "_" + index, label })
                    }
                })
            }
            setSearchOptions(options)
        }
    }, [])

    const onSearchChange = useCallback((v) => {
        if (v) {
            const [key, id] = v.split("_");
            if (key && id !== undefined) {
                setCurrentId(id)
                setContent(DocDetails[key])
            }
        }
        setSearchOptions([])
    }, [])

    useEffect(() => {
        if (currentId) {
            const node = document.getElementById(currentId)
            if (node) {
                node.style = "color:#409eff"
                //图片加载
                setTimeout(() => {
                    node.scrollIntoView({ block: "center" })
                }, 200);
            }
        }
    }, [currentId])

    return <div className={styles.main}>
        {!content ? <div>
            <div className={styles.searchDiv}>
                <Select
                    showSearch
                    placeholder={"请输入要搜索的内容，如内置 API 相关：$"}
                    defaultActiveFirstOption={false}
                    className={styles.search}
                    allowClear
                    showArrow={false}
                    filterOption={false}
                    onSearch={onSearch}
                    onChange={onSearchChange}
                    notFoundContent={null}
                    options={searchOptions}
                />
            </div>
            <ul>
                {
                    list.map((el, key) => {
                        return <li key={key}>
                            {el.title}
                            <div className={styles.des}>{el.des}</div>
                            <ul>
                                {
                                    el.children?.map((e, k) => {
                                        return <li key={k} onClick={() => {
                                            setContent(e.children)
                                        }}>
                                            {e.title}
                                        </li>
                                    })
                                }
                            </ul>
                        </li>
                    })
                }
            </ul>
        </div> : <div className={styles.detail} >
            <div className={styles.header} onClick={() => {
                setCurrentId(null)
                setContent(null)
            }}>
                <ArrowLeftOutlined /> 返回
            </div>
            <div className={styles.content} >
                {content}
            </div>
        </div>}
    </div>
}