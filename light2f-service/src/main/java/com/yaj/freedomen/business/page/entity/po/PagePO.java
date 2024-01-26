package com.yaj.freedomen.business.page.entity.po;

import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableLogic;

import java.math.BigDecimal;
import java.util.Date;

/*
 * @Description: 页面
 * @date: 2022-09-22
 */
@TableName(value = "page")
public class PagePO {
    /*
    *
    */
    @TableId
    private Integer pageId;
    /*
    *母版ID，可以为空
    */
    private Integer masterplatePageId;
    /*
    *
    */
    private Integer parentId;
    /*
    *
    */
    private Integer projectId;
    /*
    *页面名称
    */
    private String pageName;
    /*
    *文件名称
    */
    private String pageFileName;
    /*
    *可访问的角色
    */
    private String pageRoles;
    /*
    *隱藏顯示
    *1: 顯示
    *2:隱藏
    */
    private Integer pageHidden;
    /*
    *路由
    */
    private String pageRouter;
    /*
    *
    */
    private String pageDataList;
    /*
    *
    */
    private Integer pageSort;
    /*
    *页面类型
    *
    *-1:系统登录模版
    *0:普通页面
    *1:登录页面
    */
    private Integer pageType;
    /*
    *
    */
    private String pageStyle;
    /*
    *
    */
    private String pageClass;
    /*
    *
    */
    private String pageLess;
    /*
    *
    */
    @TableLogic
    private Integer isDeleted;
    /*
    *
    */
    private Date createdAt;

    public void setPageId(Integer pageId) {
        this.pageId = pageId;
    }

    public Integer getPageId() {
        return this.pageId;
    }

    public void setMasterplatePageId(Integer masterplatePageId) {
        this.masterplatePageId = masterplatePageId;
    }

    public Integer getMasterplatePageId() {

        return this.masterplatePageId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    public Integer getParentId() {
        return this.parentId;
    }

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
    }

    public Integer getProjectId() {
        return this.projectId;
    }

    public void setPageName(String pageName) {
        this.pageName = pageName;
    }

    public String getPageName() {
        return this.pageName;
    }

    public void setPageFileName(String pageFileName) {
        this.pageFileName = pageFileName;
    }

    public String getPageFileName() {
        return this.pageFileName;
    }

    public void setPageRoles(String pageRoles) {
        this.pageRoles = pageRoles;
    }

    public String getPageRoles() {
        return this.pageRoles;
    }

    public void setPageHidden(Integer pageHidden) {
        this.pageHidden = pageHidden;
    }

    public Integer getPageHidden() {
        return this.pageHidden;
    }

    public void setPageRouter(String pageRouter) {
        this.pageRouter = pageRouter;
    }

    public String getPageRouter() {
        return this.pageRouter;
    }

    public void setPageDataList(String pageDataList) {
        this.pageDataList = pageDataList;
    }

    public String getPageDataList() {
        return this.pageDataList;
    }

    public void setPageSort(Integer pageSort) {
        this.pageSort = pageSort;
    }

    public Integer getPageSort() {
        return this.pageSort;
    }

    public void setPageType(Integer pageType) {
        this.pageType = pageType;
    }

    public Integer getPageType() {
        return this.pageType;
    }

    public void setPageStyle(String pageStyle) {
        this.pageStyle = pageStyle;
    }

    public String getPageStyle() {
        return this.pageStyle;
    }

    public void setPageClass(String pageClass) {
        this.pageClass = pageClass;
    }

    public String getPageClass() {
        return this.pageClass;
    }

    public void setPageLess(String pageLess) {
        this.pageLess = pageLess;
    }

    public String getPageLess() {
        return this.pageLess;
    }

    public void setIsDeleted(Integer isDeleted) {
        this.isDeleted = isDeleted;
    }

    public Integer getIsDeleted() {
        return this.isDeleted;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getCreatedAt() {
        return this.createdAt;
    }

}