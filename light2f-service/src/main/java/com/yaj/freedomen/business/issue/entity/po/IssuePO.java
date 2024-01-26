package com.yaj.freedomen.business.issue.entity.po;

import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableLogic;

import java.math.BigDecimal;
import java.util.Date;

/*
 * @Description: 问题
 * @date: 2022-02-28
 */
@TableName(value = "issue")
public class IssuePO {
    /*
    *
    */
    @TableId
    private Integer issueId;
    /*
    *
    */
    private Integer userId;
    /*
    *
    */
    private String issueTitle;
    /*
    *
    */
    private String issueContent;
    /*
    *问题类型
    */
    private Integer issueType;
    /*
    *问题评论数量
    */
    private Integer issueCommentCount;
    /*
    *
    */
    private Date createdAt;
    /*
    *
    */
    @TableLogic
    private Integer isDeleted;

    public void setIssueId(Integer issueId) {
        this.issueId = issueId;
    }

    public Integer getIssueId() {
        return this.issueId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getUserId() {
        return this.userId;
    }

    public void setIssueTitle(String issueTitle) {
        this.issueTitle = issueTitle;
    }

    public String getIssueTitle() {
        return this.issueTitle;
    }

    public void setIssueContent(String issueContent) {
        this.issueContent = issueContent;
    }

    public String getIssueContent() {
        return this.issueContent;
    }

    public void setIssueType(Integer issueType) {
        this.issueType = issueType;
    }

    public Integer getIssueType() {
        return this.issueType;
    }

    public void setIssueCommentCount(Integer issueCommentCount) {
        this.issueCommentCount = issueCommentCount;
    }

    public Integer getIssueCommentCount() {
        return this.issueCommentCount;
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