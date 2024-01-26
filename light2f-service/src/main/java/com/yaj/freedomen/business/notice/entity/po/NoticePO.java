package com.yaj.freedomen.business.notice.entity.po;

import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableLogic;

import java.math.BigDecimal;
import java.util.Date;

/*
 * @Description: 
 * @date: 2024-01-16
 */
@TableName(value = "notice")
public class NoticePO {
    /*
    *
    */
    @TableId
    private Integer noticeId;
    /*
    *
    */
    private Integer userId;
    /*
    *
    */
    private Integer sendUserId;
    /*
    *
    */
    private String noticeTitle;
    /*
    *
    */
    private String noticeContent;
    /*
    *
    */
    private Integer noticeIsRead;
    /*
    *
    */
    private Date createdAt;
    /*
    *
    */
    @TableLogic
    private Integer isDeleted;

    public void setNoticeId(Integer noticeId) {
        this.noticeId = noticeId;
    }

    public Integer getNoticeId() {
        return this.noticeId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getUserId() {
        return this.userId;
    }

    public void setSendUserId(Integer sendUserId) {
        this.sendUserId = sendUserId;
    }

    public Integer getSendUserId() {
        return this.sendUserId;
    }

    public void setNoticeTitle(String noticeTitle) {
        this.noticeTitle = noticeTitle;
    }

    public String getNoticeTitle() {
        return this.noticeTitle;
    }

    public void setNoticeContent(String noticeContent) {
        this.noticeContent = noticeContent;
    }

    public String getNoticeContent() {
        return this.noticeContent;
    }

    public void setNoticeIsRead(Integer noticeIsRead) {
        this.noticeIsRead = noticeIsRead;
    }

    public Integer getNoticeIsRead() {
        return this.noticeIsRead;
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