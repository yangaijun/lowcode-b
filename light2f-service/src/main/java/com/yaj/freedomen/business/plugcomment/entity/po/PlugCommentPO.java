package com.yaj.freedomen.business.plugcomment.entity.po;

import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableLogic;

import java.math.BigDecimal;
import java.util.Date;

/*
 * @Description: 组件评论
 * @date: 2022-03-11
 */
@TableName(value = "plug_comment")
public class PlugCommentPO {
    /*
    *
    */
    @TableId
    private Integer plugCommentId;
    /*
    *
    */
    private Integer plugId;
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
    private String plugCommentContent;
    /*
    *
    */
    @TableLogic
    private Integer isDeleted;
    /*
    *
    */
    private Date createdAt;

    public void setPlugCommentId(Integer plugCommentId) {
        this.plugCommentId = plugCommentId;
    }

    public Integer getPlugCommentId() {
        return this.plugCommentId;
    }

    public void setPlugId(Integer plugId) {
        this.plugId = plugId;
    }

    public Integer getPlugId() {
        return this.plugId;
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

    public void setPlugCommentContent(String plugCommentContent) {
        this.plugCommentContent = plugCommentContent;
    }

    public String getPlugCommentContent() {
        return this.plugCommentContent;
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