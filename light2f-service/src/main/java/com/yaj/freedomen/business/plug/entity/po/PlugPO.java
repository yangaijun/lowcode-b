package com.yaj.freedomen.business.plug.entity.po;

import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableLogic;

import java.math.BigDecimal;
import java.util.Date;

/*
 * @Description: 自定义组件
 * @date: 2022-08-04
 */
@TableName(value = "plug")
public class PlugPO {
    /*
    *
    */
    @TableId
    private Integer plugId;
    /*
    *同一个组件同一个ctype,用于区分版本，更新的时候以这个为依据，version + 1
    */
    private Integer plugSameId;
    /*
    *组件缺省type如：cinput
    */
    private String plugTname;
    /*
    *
    */
    private Integer userId;
    /*
    *组件对应的资源id
    */
    private String plugUid;
    /*
    *
    */
    private String plugNpmLibs;
    /*
    *
    */
    private String plugName;
    /*
    *
    */
    private String plugTooltip;
    /*
    *
    */
    private String plugTags;
    /*
    *
    */
    private String plugDes;
    /*
    *
    */
    private Integer plugVersion;
    /*
    *
    */
    private String plugBaseProps;
    /*
    *
    */
    private String plugCustomProps;
    /*
    *star数
    */
    private Integer plugStarCount;
    /*
    *评论数
    */
    private Integer plugCommentCount;
    /*
    *组件使用文档
    */
    private String plugDoc;
    /*
    *组件更新日志
    */
    private String plugLog;
    /*
    *收藏数
    */
    private Integer plugFavCount;
    /*
    *组件状态
    *1: private
    *2: public
    */
    private Integer plugStatus;
    /*
    *组件类型，容器，组件？
    *1: 组件 
    *2: 容器
    */
    private Integer plugType;
    /*
    *
    */
    @TableLogic
    private Integer isDeleted;
    /*
    *
    */
    private Date createdAt;

    public void setPlugId(Integer plugId) {
        this.plugId = plugId;
    }

    public Integer getPlugId() {
        return this.plugId;
    }

    public void setPlugSameId(Integer plugSameId) {
        this.plugSameId = plugSameId;
    }

    public Integer getPlugSameId() {
        return this.plugSameId;
    }

    public void setPlugTname(String plugTname) {
        this.plugTname = plugTname;
    }

    public String getPlugTname() {
        return this.plugTname;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getUserId() {
        return this.userId;
    }

    public void setPlugUid(String plugUid) {
        this.plugUid = plugUid;
    }

    public String getPlugUid() {
        return this.plugUid;
    }

    public void setPlugNpmLibs(String plugNpmLibs) {
        this.plugNpmLibs = plugNpmLibs;
    }

    public String getPlugNpmLibs() {
        return this.plugNpmLibs;
    }

    public void setPlugName(String plugName) {
        this.plugName = plugName;
    }

    public String getPlugName() {
        return this.plugName;
    }

    public void setPlugTooltip(String plugTooltip) {
        this.plugTooltip = plugTooltip;
    }

    public String getPlugTooltip() {
        return this.plugTooltip;
    }

    public void setPlugTags(String plugTags) {
        this.plugTags = plugTags;
    }

    public String getPlugTags() {
        return this.plugTags;
    }

    public void setPlugDes(String plugDes) {
        this.plugDes = plugDes;
    }

    public String getPlugDes() {
        return this.plugDes;
    }

    public void setPlugVersion(Integer plugVersion) {
        this.plugVersion = plugVersion;
    }

    public Integer getPlugVersion() {
        return this.plugVersion;
    }

    public void setPlugBaseProps(String plugBaseProps) {
        this.plugBaseProps = plugBaseProps;
    }

    public String getPlugBaseProps() {
        return this.plugBaseProps;
    }

    public void setPlugCustomProps(String plugCustomProps) {
        this.plugCustomProps = plugCustomProps;
    }

    public String getPlugCustomProps() {
        return this.plugCustomProps;
    }

    public void setPlugStarCount(Integer plugStarCount) {
        this.plugStarCount = plugStarCount;
    }

    public Integer getPlugStarCount() {
        return this.plugStarCount;
    }

    public void setPlugCommentCount(Integer plugCommentCount) {
        this.plugCommentCount = plugCommentCount;
    }

    public Integer getPlugCommentCount() {
        return this.plugCommentCount;
    }

    public void setPlugDoc(String plugDoc) {
        this.plugDoc = plugDoc;
    }

    public String getPlugDoc() {
        return this.plugDoc;
    }

    public void setPlugLog(String plugLog) {
        this.plugLog = plugLog;
    }

    public String getPlugLog() {
        return this.plugLog;
    }

    public void setPlugFavCount(Integer plugFavCount) {
        this.plugFavCount = plugFavCount;
    }

    public Integer getPlugFavCount() {
        return this.plugFavCount;
    }

    public void setPlugStatus(Integer plugStatus) {
        this.plugStatus = plugStatus;
    }

    public Integer getPlugStatus() {
        return this.plugStatus;
    }

    public void setPlugType(Integer plugType) {
        this.plugType = plugType;
    }

    public Integer getPlugType() {
        return this.plugType;
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