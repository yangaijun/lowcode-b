package com.yaj.freedomen.business.pluguse.entity.po;

import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableLogic;

import java.math.BigDecimal;
import java.util.Date;

/*
 * @Description: 用户使用的组件
 * @date: 2022-05-19
 */
@TableName(value = "plug_use")
public class PlugUsePO {
    /*
    *
    */
    @TableId
    private Integer plugUseId;
    /*
    *
    */
    private Integer projectId;
    /*
    *
    */
    private Integer userId;
    /*
    *
    */
    private Integer plugId;
    /*
    *
    */
    private String plugUseName;
    /*
    *
    */
    private String plugUseType;
    /*
    *
    */
    private Integer plugUseVersion;
    /*
    *
    */
    private Date createdAt;
    /*
    *
    */
    @TableLogic
    private Integer isDeleted;

    public void setPlugUseId(Integer plugUseId) {
        this.plugUseId = plugUseId;
    }

    public Integer getPlugUseId() {
        return this.plugUseId;
    }

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
    }

    public Integer getProjectId() {
        return this.projectId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getUserId() {
        return this.userId;
    }

    public void setPlugId(Integer plugId) {
        this.plugId = plugId;
    }

    public Integer getPlugId() {
        return this.plugId;
    }

    public void setPlugUseName(String plugUseName) {
        this.plugUseName = plugUseName;
    }

    public String getPlugUseName() {
        return this.plugUseName;
    }

    public void setPlugUseType(String plugUseType) {
        this.plugUseType = plugUseType;
    }

    public String getPlugUseType() {
        return this.plugUseType;
    }

    public void setPlugUseVersion(Integer plugUseVersion) {
        this.plugUseVersion = plugUseVersion;
    }

    public Integer getPlugUseVersion() {
        return this.plugUseVersion;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getCreatedAt() {
        return this.createdAt;
    }

    public void setIsDeleted(Integer isDeleted) {
        this.isDeleted = isDeleted;
    }

    public Integer getIsDeleted() {
        return this.isDeleted;
    }

}