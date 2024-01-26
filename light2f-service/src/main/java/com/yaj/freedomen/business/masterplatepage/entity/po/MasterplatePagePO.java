package com.yaj.freedomen.business.masterplatepage.entity.po;

import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableLogic;

import java.math.BigDecimal;
import java.util.Date;

/*
 * @Description: 页面母版
 * @date: 2023-04-24
 */
@TableName(value = "masterplate_page")
public class MasterplatePagePO {
    /*
    *
    */
    @TableId
    private Integer masterplatePageId;
    /*
    *
    */
    private Integer userId;
    /*
    *模版名称
    */
    private String masterplatePageName;
    /*
    *
    */
    private Integer masterplatePageMaster;
    /*
    *public:公共的
    *private:私有的
    *sys:系统模版
    */
    private String masterplatePageType;
    /*
    *描述
    */
    private String masterplatePageDes;
    /*
    *
    */
    @TableLogic
    private Integer isDeleted;
    /*
    *
    */
    private Date createdAt;
    /*
    *
    */
    private String masterplatePageTmp;

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

    public void setMasterplatePageName(String masterplatePageName) {
        this.masterplatePageName = masterplatePageName;
    }

    public String getMasterplatePageName() {
        return this.masterplatePageName;
    }

    public void setMasterplatePageMaster(Integer masterplatePageMaster) {
        this.masterplatePageMaster = masterplatePageMaster;
    }

    public Integer getMasterplatePageMaster() {
        return this.masterplatePageMaster;
    }

    public void setMasterplatePageType(String masterplatePageType) {
        this.masterplatePageType = masterplatePageType;
    }

    public String getMasterplatePageType() {
        return this.masterplatePageType;
    }

    public void setMasterplatePageDes(String masterplatePageDes) {
        this.masterplatePageDes = masterplatePageDes;
    }

    public String getMasterplatePageDes() {
        return this.masterplatePageDes;
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

    public void setMasterplatePageTmp(String masterplatePageTmp) {
        this.masterplatePageTmp = masterplatePageTmp;
    }

    public String getMasterplatePageTmp() {
        return this.masterplatePageTmp;
    }

}