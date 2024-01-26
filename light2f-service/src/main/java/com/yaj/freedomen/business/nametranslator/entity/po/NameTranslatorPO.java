package com.yaj.freedomen.business.nametranslator.entity.po;

import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableLogic;

import java.math.BigDecimal;
import java.util.Date;

/*
 * @Description: 
 * @date: 2022-02-28
 */
@TableName(value = "name_translator")
public class NameTranslatorPO {
    /*
    *
    */
    @TableId
    private Integer nameTranslatorId;
    /*
    *
    */
    private String nameTranslatorForm;
    /*
    *
    */
    private String nameTranslatorto;
    /*
    *
    */
    private Date createdAt;
    /*
    *
    */
    @TableLogic
    private Integer isDeleted;

    public void setNameTranslatorId(Integer nameTranslatorId) {
        this.nameTranslatorId = nameTranslatorId;
    }

    public Integer getNameTranslatorId() {
        return this.nameTranslatorId;
    }

    public void setNameTranslatorForm(String nameTranslatorForm) {
        this.nameTranslatorForm = nameTranslatorForm;
    }

    public String getNameTranslatorForm() {
        return this.nameTranslatorForm;
    }

    public void setNameTranslatorto(String nameTranslatorto) {
        this.nameTranslatorto = nameTranslatorto;
    }

    public String getNameTranslatorto() {
        return this.nameTranslatorto;
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