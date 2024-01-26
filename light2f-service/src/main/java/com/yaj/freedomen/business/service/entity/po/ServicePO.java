package com.yaj.freedomen.business.service.entity.po;

import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableLogic;

import java.math.BigDecimal;
import java.util.Date;

/*
 * @Description: 接口
 * @date: 2022-09-21
 */
@TableName(value = "service")
public class ServicePO {
    /*
    *
    */
    @TableId
    private Integer serviceId;
    /*
    *
    */
    private Integer pageId;
    /*
    *方法
    *POST
    *GET
    *PUT
    *DELETE
    */
    private String serviceMethod;
    /*
    *
    */
    private String serviceUrl;
    /*
    *
    */
    private String serviceName;
    /*
    *注释
    */
    private String serviceComment;
    /*
    *
    */
    private String serviceResponseType;
    /*
    *
    */
    private Date createdAt;
    /*
    *
    */
    @TableLogic
    private Integer isDeleted;

    public void setServiceId(Integer serviceId) {
        this.serviceId = serviceId;
    }

    public Integer getServiceId() {
        return this.serviceId;
    }

    public void setPageId(Integer pageId) {
        this.pageId = pageId;
    }

    public Integer getPageId() {
        return this.pageId;
    }

    public void setServiceMethod(String serviceMethod) {
        this.serviceMethod = serviceMethod;
    }

    public String getServiceMethod() {
        return this.serviceMethod;
    }

    public void setServiceUrl(String serviceUrl) {
        this.serviceUrl = serviceUrl;
    }

    public String getServiceUrl() {
        return this.serviceUrl;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getServiceName() {
        return this.serviceName;
    }

    public void setServiceComment(String serviceComment) {
        this.serviceComment = serviceComment;
    }

    public String getServiceComment() {
        return this.serviceComment;
    }

    public void setServiceResponseType(String serviceResponseType) {
        this.serviceResponseType = serviceResponseType;
    }

    public String getServiceResponseType() {
        return this.serviceResponseType;
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