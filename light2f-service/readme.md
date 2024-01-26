## service
1. 创建项目母版： 创建并编辑 项目母版完成后 将其 masterplate_project_type 设为 sys
2. 创建页面母版：创建并编辑 页面母版完成后 将其 masterplate_page_type 设为 sys
3. 创建统一登录页面： 创建个项目，进入后 新建个登录页面，注意文件名为 Login，将 page_type 改为 -1
4. component_prop_doc表里的文档要复制 dev 到 prod
5. 用户Id 为 1 的项目都为被列为示例
## front
1. D:\project\project-template  下载的项目的脚手架。 clone 到 linux: /application/project/project-template
2. D:\project\freedomen-custom-component 自定义组件脚手架， 上传到腾讯云
## freedomen
> freedomen 框架更新 to npm & 上面的 package.json 修改对应版本

## 前端相关
1. 系统模块
    admin用户的 test 项目，添加完要手动修改数据库的 componentType 为 sys