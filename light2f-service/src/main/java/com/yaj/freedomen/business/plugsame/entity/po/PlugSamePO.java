package com.yaj.freedomen.business.plugsame.entity.po;

import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableLogic;

import java.math.BigDecimal;
import java.util.Date;

/*
 * @Description: 每个组件，当前最新版本
 * @date: 2022-11-11
 */
@TableName(value = "plug_same")
public class PlugSamePO {
    /*
    *
    */
    @TableId
    private Integer plugSameId;
    /*
    *最后的组件id
    */
    private Integer lastPlugId;
    /*
    *
    */
    @TableLogic
    private Integer isDeleted;
    /*
    *
    */
    private Date createdAt;

    public void setPlugSameId(Integer plugSameId) {
        this.plugSameId = plugSameId;
    }

    public Integer getPlugSameId() {
        return this.plugSameId;
    }

    public void setLastPlugId(Integer lastPlugId) {
        this.lastPlugId = lastPlugId;
    }

    public Integer getLastPlugId() {
        return this.lastPlugId;
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