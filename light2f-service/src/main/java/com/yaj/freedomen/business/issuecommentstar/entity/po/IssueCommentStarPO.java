package com.yaj.freedomen.business.issuecommentstar.entity.po;

import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.annotations.TableId;

import java.util.Date;

/*
 * @Description: 评论评分
 * @date: 2022-02-28
 */
@TableName(value = "issue_comment_star")
public class IssueCommentStarPO {
    /*
    *
    */
    @TableId
    private Integer issueCommentStarId;
    /*
    *
    */
    private Integer issueCommentId;
    /*
    *
    */
    private Integer issueCommentStarIam;
    /*
    *
    */
    private Integer userId;
    /*
    *
    */
    private Date createdAt;

    public void setIssueCommentStarId(Integer issueCommentStarId) {
        this.issueCommentStarId = issueCommentStarId;
    }

    public Integer getIssueCommentStarId() {
        return this.issueCommentStarId;
    }

    public void setIssueCommentId(Integer issueCommentId) {
        this.issueCommentId = issueCommentId;
    }

    public Integer getIssueCommentId() {
        return this.issueCommentId;
    }

    public void setIssueCommentStarIam(Integer issueCommentStarIam) {
        this.issueCommentStarIam = issueCommentStarIam;
    }

    public Integer getIssueCommentStarIam() {
        return this.issueCommentStarIam;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getUserId() {
        return this.userId;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getCreatedAt() {
        return this.createdAt;
    }

}