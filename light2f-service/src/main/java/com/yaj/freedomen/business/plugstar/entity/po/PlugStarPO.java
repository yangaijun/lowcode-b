package com.yaj.freedomen.business.plugstar.entity.po;

import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableLogic;

import java.math.BigDecimal;
import java.util.Date;

/*
 * @Description: 
 * @date: 2022-03-11
 */
@TableName(value = "plug_star")
public class PlugStarPO {
    /*
    *
    */
    @TableId
    private Integer plugStarId;
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
    private Integer plugStarIam;
    /*
    *
    */
    private Date createdAt;
    /*
    *
    */
    @TableLogic
    private Integer isDeleted;

    public void setPlugStarId(Integer plugStarId) {
        this.plugStarId = plugStarId;
    }

    public Integer getPlugStarId() {
        return this.plugStarId;
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

    public void setPlugStarIam(Integer plugStarIam) {
        this.plugStarIam = plugStarIam;
    }

    public Integer getPlugStarIam() {
        return this.plugStarIam;
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