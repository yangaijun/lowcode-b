package com.yaj.freedomen.business.componentpropdoc.entity.po;

import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableLogic;

import java.math.BigDecimal;
import java.util.Date;

/*
 * @Description: 组件属性文档
 * @date: 2022-06-20
 */
@TableName(value = "component_prop_doc")
public class ComponentPropDocPO {
    /*
    *
    */
    @TableId
    private Integer componentPropDocId;
    /*
    *
    */
    private Integer plugId;
    /*
    *对应的prop
    */
    private String componentPropDocProp;
    /*
    *如click,多个 cilck 通过sort 组件一组文档
    */
    private String componentPropDocName;
    /*
    *注释
    */
    private String componentPropDocRem;
    /*
    *代码
    */
    private String componentPropDocCode;
    /*
    *
    */
    private Integer componentPropDocSort;
    /*
    *
    */
    private Date createdAt;
    /*
    *
    */
    @TableLogic
    private Integer isDeleted;

    public void setComponentPropDocId(Integer componentPropDocId) {
        this.componentPropDocId = componentPropDocId;
    }

    public Integer getComponentPropDocId() {
        return this.componentPropDocId;
    }

    public void setPlugId(Integer plugId) {
        this.plugId = plugId;
    }

    public Integer getPlugId() {
        return this.plugId;
    }

    public void setComponentPropDocProp(String componentPropDocProp) {
        this.componentPropDocProp = componentPropDocProp;
    }

    public String getComponentPropDocProp() {
        return this.componentPropDocProp;
    }

    public void setComponentPropDocName(String componentPropDocName) {
        this.componentPropDocName = componentPropDocName;
    }

    public String getComponentPropDocName() {
        return this.componentPropDocName;
    }

    public void setComponentPropDocRem(String componentPropDocRem) {
        this.componentPropDocRem = componentPropDocRem;
    }

    public String getComponentPropDocRem() {
        return this.componentPropDocRem;
    }

    public void setComponentPropDocCode(String componentPropDocCode) {
        this.componentPropDocCode = componentPropDocCode;
    }

    public String getComponentPropDocCode() {
        return this.componentPropDocCode;
    }

    public void setComponentPropDocSort(Integer componentPropDocSort) {
        this.componentPropDocSort = componentPropDocSort;
    }

    public Integer getComponentPropDocSort() {
        return this.componentPropDocSort;
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