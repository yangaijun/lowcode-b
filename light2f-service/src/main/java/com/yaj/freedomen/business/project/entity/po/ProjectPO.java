package com.yaj.freedomen.business.project.entity.po;

import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableLogic;

import java.math.BigDecimal;
import java.util.Date;

/*
 * @Description: 
 * @date: 2022-05-16
 */
@TableName(value = "project")
public class ProjectPO {
    /*
    *
    */
    @TableId
    private Integer projectId;
    /*
    *
    */
    private Integer masterplateProjectId;
    /*
    *母版ID,可以为空,记录系统是否很用一键生成
    */
    private Integer masterplatePageId;
    /*
    *
    */
    private Integer userId;
    /*
    *
    */
    private String projectName;
    /*
    *项目角色
    */
    private String projectRoles;
    /*
    *private:私有的
    *public:公共的
    */
    private String projectType;
    /*
    *
    */
    private String projectDes;
    /*
    *
    */
    private String colFilter;
    /*
    *
    */
    private String databaseUrl;
    /*
    *
    */
    private String databaseUsername;
    /*
    *
    */
    private String databasePassword;
    /*
    *
    */
    private Date createdAt;

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
    }

    public Integer getProjectId() {
        return this.projectId;
    }

    public void setMasterplateProjectId(Integer masterplateProjectId) {
        this.masterplateProjectId = masterplateProjectId;
    }

    public Integer getMasterplateProjectId() {
        return this.masterplateProjectId;
    }

    public void setMasterplatePageId(Integer masterplatePageId) {
        this.masterplatePageId = masterplatePageId;
    }

    public Integer getMasterplatePageId() {
        return this.masterplatePageId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getUserId() {
        return this.userId;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectName() {
        return this.projectName;
    }

    public void setProjectRoles(String projectRoles) {
        this.projectRoles = projectRoles;
    }

    public String getProjectRoles() {
        return this.projectRoles;
    }

    public void setProjectType(String projectType) {
        this.projectType = projectType;
    }

    public String getProjectType() {
        return this.projectType;
    }

    public void setProjectDes(String projectDes) {
        this.projectDes = projectDes;
    }

    public String getProjectDes() {
        return this.projectDes;
    }

    public void setColFilter(String colFilter) {
        this.colFilter = colFilter;
    }

    public String getColFilter() {
        return this.colFilter;
    }

    public void setDatabaseUrl(String databaseUrl) {
        this.databaseUrl = databaseUrl;
    }

    public String getDatabaseUrl() {
        return this.databaseUrl;
    }

    public void setDatabaseUsername(String databaseUsername) {
        this.databaseUsername = databaseUsername;
    }

    public String getDatabaseUsername() {
        return this.databaseUsername;
    }

    public void setDatabasePassword(String databasePassword) {
        this.databasePassword = databasePassword;
    }

    public String getDatabasePassword() {
        return this.databasePassword;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getCreatedAt() {
        return this.createdAt;
    }

}