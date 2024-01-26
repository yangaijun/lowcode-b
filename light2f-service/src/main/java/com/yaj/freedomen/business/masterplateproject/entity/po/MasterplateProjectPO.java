package com.yaj.freedomen.business.masterplateproject.entity.po;

import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableLogic;

import java.math.BigDecimal;
import java.util.Date;

/*
 * @Description: 项目模板
 * @date: 2022-09-22
 */
@TableName(value = "masterplate_project")
public class MasterplateProjectPO {
    /*
    *
    */
    @TableId
    private Integer masterplateProjectId;
    /*
    *
    */
    private Integer userId;
    /*
    *
    */
    private String masterplateProjectName;
    /*
    *路径//http://localhost:3000
    */
    private String masterplateProjectBaseUrl;
    /*
    *
    */
    private String masterplateProjectTokenName;
    /*
    *
    */
    private String masterplateProjectContentType;
    /*
    *语法//保存字段
    *hook
    *class
    */
    private String masterplateProjectGrammar;
    /*
    *全局数据
    */
    private String masterplateProjectData;
    /*
    *组件配置
    */
    private String masterplateProjectFreedomenConfig;
    /*
    *
    */
    private String masterplateProjectStyle;
    /*
    *描述
    */
    private String masterplateProjectDes;
    /*
    *public: 公共的
    *private: 私有的
    *sys:系统模版
    */
    private String masterplateProjectType;
    /*
    *
    */
    @TableLogic
    private Integer isDeleted;
    /*
    *
    */
    private Date createdAt;

    public void setMasterplateProjectId(Integer masterplateProjectId) {
        this.masterplateProjectId = masterplateProjectId;
    }

    public Integer getMasterplateProjectId() {
        return this.masterplateProjectId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getUserId() {
        return this.userId;
    }

    public void setMasterplateProjectName(String masterplateProjectName) {
        this.masterplateProjectName = masterplateProjectName;
    }

    public String getMasterplateProjectName() {
        return this.masterplateProjectName;
    }

    public void setMasterplateProjectBaseUrl(String masterplateProjectBaseUrl) {
        this.masterplateProjectBaseUrl = masterplateProjectBaseUrl;
    }

    public String getMasterplateProjectBaseUrl() {
        return this.masterplateProjectBaseUrl;
    }

    public void setMasterplateProjectTokenName(String masterplateProjectTokenName) {
        this.masterplateProjectTokenName = masterplateProjectTokenName;
    }

    public String getMasterplateProjectTokenName() {
        return this.masterplateProjectTokenName;
    }

    public void setMasterplateProjectContentType(String masterplateProjectContentType) {
        this.masterplateProjectContentType = masterplateProjectContentType;
    }

    public String getMasterplateProjectContentType() {
        return this.masterplateProjectContentType;
    }

    public void setMasterplateProjectGrammar(String masterplateProjectGrammar) {
        this.masterplateProjectGrammar = masterplateProjectGrammar;
    }

    public String getMasterplateProjectGrammar() {
        return this.masterplateProjectGrammar;
    }

    public void setMasterplateProjectData(String masterplateProjectData) {
        this.masterplateProjectData = masterplateProjectData;
    }

    public String getMasterplateProjectData() {
        return this.masterplateProjectData;
    }

    public void setMasterplateProjectFreedomenConfig(String masterplateProjectFreedomenConfig) {
        this.masterplateProjectFreedomenConfig = masterplateProjectFreedomenConfig;
    }

    public String getMasterplateProjectFreedomenConfig() {
        return this.masterplateProjectFreedomenConfig;
    }

    public void setMasterplateProjectStyle(String masterplateProjectStyle) {
        this.masterplateProjectStyle = masterplateProjectStyle;
    }

    public String getMasterplateProjectStyle() {
        return this.masterplateProjectStyle;
    }

    public void setMasterplateProjectDes(String masterplateProjectDes) {
        this.masterplateProjectDes = masterplateProjectDes;
    }

    public String getMasterplateProjectDes() {
        return this.masterplateProjectDes;
    }

    public void setMasterplateProjectType(String masterplateProjectType) {
        this.masterplateProjectType = masterplateProjectType;
    }

    public String getMasterplateProjectType() {
        return this.masterplateProjectType;
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