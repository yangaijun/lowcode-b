## 简介

开发 ToB 项目的低代码工具，高效快捷，谁用谁知道

预览地址 [Light2f](https://light2f.com)

## 启动

后端：springboot + java8

前端：react18



导入 sql

配置 redis, mysql, 邮件 (不发邮件可先忽略),  以及模板路径（将项目中的 `light2f-project-template` 文件复制到对应目录）

```js
template:
  filePath: d:\\project #文件路徑
  fileName: light2f-project-template #文件名
```

配置 `com.yaj.common.cos` 中 `CosUtil.java` 中的 cos key 和 id，不用到上传先忽略

启动后端项目



启动前端项目，如果修改了 Cos 注意 Config 中的 url 前置路径