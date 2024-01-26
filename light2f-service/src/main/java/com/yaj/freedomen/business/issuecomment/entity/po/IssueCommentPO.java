package com.yaj.freedomen.business.issuecomment.entity.po;

import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableLogic;

import java.math.BigDecimal;
import java.util.Date;

/*
 * @Description: 问题评论
 * @date: 2022-02-28
 */
@TableName(value = "issue_comment")
public class IssueCommentPO {
    /*
    *
    */
    @TableId
    private Integer issueCommentId;
    /*
    *
    */
    private Integer parentId;
    /*
    *
    */
    private Integer userId;
    /*
    *
    */
    private Integer issueId;
    /*
    *
    */
    private String issueCommentContent;
    /*
    *
    */
    private Integer issueCommentStar;
    /*
    *
    */
    @TableLogic
    private Integer isDeleted;
    /*
    *
    */
    private Date createdAt;

    public void setIssueCommentId(Integer issueCommentId) {
        this.issueCommentId = issueCommentId;
    }

    public Integer getIssueCommentId() {
        return this.issueCommentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    public Integer getParentId() {
        return this.parentId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getUserId() {
        return this.userId;
    }

    public void setIssueId(Integer issueId) {
        this.issueId = issueId;
    }

    public Integer getIssueId() {
        return this.issueId;
    }

    public void setIssueCommentContent(String issueCommentContent) {
        this.issueCommentContent = issueCommentContent;
    }

    public String getIssueCommentContent() {
        return this.issueCommentContent;
    }

    public void setIssueCommentStar(Integer issueCommentStar) {
        this.issueCommentStar = issueCommentStar;
    }

    public Integer getIssueCommentStar() {
        return this.issueCommentStar;
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