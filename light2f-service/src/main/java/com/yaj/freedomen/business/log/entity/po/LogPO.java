package com.yaj.freedomen.business.log.entity.po;

import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableLogic;

import java.math.BigDecimal;
import java.util.Date;

/*
 * @Description: 
 * @date: 2023-10-19
 */
@TableName(value = "log")
public class LogPO {
    /*
    *
    */
    @TableId
    private Integer logId;
    /*
    *
    */
    private String logType;
    /*
    *
    */
    private String logInfo;
    /*
    *
    */
    private Date createdAt;
    /*
    *
    */
    @TableLogic
    private Integer isDeleted;
    /*
    *
    */
    private Integer userId;

    public void setLogId(Integer logId) {
        this.logId = logId;
    }

    public Integer getLogId() {
        return this.logId;
    }

    public void setLogType(String logType) {
        this.logType = logType;
    }

    public String getLogType() {
        return this.logType;
    }

    public void setLogInfo(String logInfo) {
        this.logInfo = logInfo;
    }

    public String getLogInfo() {
        return this.logInfo;
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

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getUserId() {
        return this.userId;
    }

}