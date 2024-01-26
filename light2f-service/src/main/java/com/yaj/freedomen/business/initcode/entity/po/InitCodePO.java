package com.yaj.freedomen.business.initcode.entity.po;

import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableLogic;

import java.math.BigDecimal;
import java.util.Date;

/*
 * @Description: 页面初始化代码
 * @date: 2022-02-28
 */
@TableName(value = "init_code")
public class InitCodePO {
    /*
    *
    */
    @TableId
    private Integer initCodeId;
    /*
    *
    */
    private Integer pageId;
    /*
    *代码类型
    *var: 变量
    *fn: 函数
    *effect: 副作用
    *ref: ref
    */
    private String initCodeType;
    /*
    *变量名
    */
    private String initCodeName;
    /*
    *影响
    */
    private String initCodeEffect;
    /*
    *变量值
    */
    private String initCodeValue;
    /*
    *
    */
    private Date createdAt;
    /*
    *
    */
    @TableLogic
    private Integer isDeleted;

    public void setInitCodeId(Integer initCodeId) {
        this.initCodeId = initCodeId;
    }

    public Integer getInitCodeId() {
        return this.initCodeId;
    }

    public void setPageId(Integer pageId) {
        this.pageId = pageId;
    }

    public Integer getPageId() {
        return this.pageId;
    }

    public void setInitCodeType(String initCodeType) {
        this.initCodeType = initCodeType;
    }

    public String getInitCodeType() {
        return this.initCodeType;
    }

    public void setInitCodeName(String initCodeName) {
        this.initCodeName = initCodeName;
    }

    public String getInitCodeName() {
        return this.initCodeName;
    }

    public void setInitCodeEffect(String initCodeEffect) {
        this.initCodeEffect = initCodeEffect;
    }

    public String getInitCodeEffect() {
        return this.initCodeEffect;
    }

    public void setInitCodeValue(String initCodeValue) {
        this.initCodeValue = initCodeValue;
    }

    public String getInitCodeValue() {
        return this.initCodeValue;
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