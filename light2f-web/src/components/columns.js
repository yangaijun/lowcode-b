import ApiMasterplatePage from 'services/masterplate_page'
import ApiMasterplateProject from 'services/masterplate_project'
import { Button } from 'antd'
import user from 'libs/user'

export const libTabKey = {
    project: "project",
    comp: "comp",
    projectMp: "projectMp",
    pageMp: "pageMp"
}

export const masterplatePageId = {
    type: 'select',
    label: '页面母版',
    prop: 'masterplatePageId',
    rule: 'must',
    placeholder: '选择一套页面母版，生成页面更个性化',
    options({ resolve }) {
        ApiMasterplatePage.select({userId: user.getUserId()}).then(res => {
            resolve(res.map(el => {
                return {
                    label: el.masterplatePageName,
                    value: el.masterplatePageId
                }
            }))
        })
    },
    load: ({ data }) => !data.pageId && data.pageState !== 2,
    config: {
        help: <>模板，可以在<Button type='link' size='small' target='_blank' href={`#/lib?type=${libTabKey.pageMp}`} >页面母版</Button>中编辑，还没有请复制一套系统预定义的</> ,
    }
}

export const masterplateProjectId = {
    type: 'select',
    label: '项目母版',
    prop: 'masterplateProjectId',
    rule: 'must',
    placeholder: '选择一套项目母版，生成更定制化',
    options({ resolve }) {
        ApiMasterplateProject.select({userId: user.getUserId()}).then(res => {
            resolve(res.map(el => {
                return {
                    label: el.masterplateProjectName,
                    value: el.masterplateProjectId
                }
            }))
        })
    },
    config: {
        help: <>脚手架，可以在<Button type='link' size='small' target='_blank' href={`#/lib?type=${libTabKey.projectMp}`} >项目母版</Button>中编辑，还没有请复制一套系统预定义的</> ,
    }
}

export const masterplateProject = {
    type: 'select',
    label: '项目母版',
    prop: 'masterplateProject',
    placeholder: '预选择一套项目母版, 用于使用其全局样式',
    options({ resolve }) {
        ApiMasterplateProject.select({userId: user.getUserId()}).then(res => {
            resolve(res)
        })
    },
    config: {
        optionvalue: 1,
        valuename: 'masterplateProjectId',
        labelname: 'masterplateProjectName'
    }
}