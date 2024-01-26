package com.yaj.freedomen.business.plugfav.entity.po;

import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableLogic;

import java.math.BigDecimal;
import java.util.Date;

/*
 * @Description: 收藏
 * @date: 2022-03-11
 */
@TableName(value = "plug_fav")
public class PlugFavPO {
    /*
    *
    */
    @TableId
    private Integer plugFavId;
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
    private Date createdAt;
    /*
    *
    */
    @TableLogic
    private Integer isDeleted;

    public void setPlugFavId(Integer plugFavId) {
        this.plugFavId = plugFavId;
    }

    public Integer getPlugFavId() {
        return this.plugFavId;
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