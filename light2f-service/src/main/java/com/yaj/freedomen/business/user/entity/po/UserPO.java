package com.yaj.freedomen.business.user.entity.po;

import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableLogic;

import java.math.BigDecimal;
import java.util.Date;

/*
 * @Description: 
 * @date: 2022-11-11
 */
@TableName(value = "user")
public class UserPO {
    /*
    *
    */
    @TableId
    private Integer userId;
    /*
    *头像KEY
    */
    private String userAvatar;
    /*
    *帐号
    */
    private String userAccount;
    /*
    *用户名
    */
    private String userName;
    /*
    *
    */
    private String userPassword;
    /*
    *邮箱
    */
    private String userEmail;
    /*
    *手机号
    */
    private String userPhone;
    /*
    *职业
    */
    private String userMajor;
    /*
    *用户城市
    */
    private String userCity;
    /*
    *
    */
    private Integer userMaxPage;
    /*
    *
    */
    private Integer userMaxProject;
    /*
    *下载次数
    */
    private Integer downloadCount;
    /*
    *
    */
    private Date createdAt;
    /*
    *
    */
    @TableLogic
    private Integer isDeleted;

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getUserId() {
        return this.userId;
    }

    public void setUserAvatar(String userAvatar) {
        this.userAvatar = userAvatar;
    }

    public String getUserAvatar() {
        return this.userAvatar;
    }

    public void setUserAccount(String userAccount) {
        this.userAccount = userAccount;
    }

    public String getUserAccount() {
        return this.userAccount;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserName() {
        return this.userName;
    }

    public void setUserPassword(String userPassword) {
        this.userPassword = userPassword;
    }

    public String getUserPassword() {
        return this.userPassword;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserEmail() {
        return this.userEmail;
    }

    public void setUserPhone(String userPhone) {
        this.userPhone = userPhone;
    }

    public String getUserPhone() {
        return this.userPhone;
    }

    public void setUserMajor(String userMajor) {
        this.userMajor = userMajor;
    }

    public String getUserMajor() {
        return this.userMajor;
    }

    public void setUserCity(String userCity) {
        this.userCity = userCity;
    }

    public String getUserCity() {
        return this.userCity;
    }

    public void setUserMaxPage(Integer userMaxPage) {
        this.userMaxPage = userMaxPage;
    }

    public Integer getUserMaxPage() {
        return this.userMaxPage;
    }

    public void setUserMaxProject(Integer userMaxProject) {
        this.userMaxProject = userMaxProject;
    }

    public Integer getUserMaxProject() {
        return this.userMaxProject;
    }

    public void setDownloadCount(Integer downloadCount) {
        this.downloadCount = downloadCount;
    }

    public Integer getDownloadCount() {
        return this.downloadCount;
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