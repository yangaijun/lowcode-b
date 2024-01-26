package com.yaj.freedomen.business.component.entity.po;

import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableLogic;

import java.math.BigDecimal;
import java.util.Date;

/*
 * @Description: 项目组件
 * @date: 2023-06-12
 */
@TableName(value = "component")
public class ComponentPO {
    /*
    *
    */
    @TableId
    private Integer componentId;
    /*
    *
    */
    private Integer projectId;
    /*
    *
    */
    private Integer componentFromId;
    /*
    *
    */
    private String componentDes;
    /*
    *
    */
    private String componentName;
    /*
    *
    */
    private String componentDataList;
    /*
    *
    */
    private Date createAt;
    /*
    *
    */
    @TableLogic
    private Integer isDeleted;
    /*
    *关联
    */
    private String componentRelations;
    /*
    *
    */
    private Integer componentSort;
    /*
    *
    */
    private String componentGroup;
    /*
    *
    */
    private String componentType;
    /*
    *介绍图
    */
    private String componentImg;
    /*
    *
    */
    private String componentUseTip;

    public void setComponentId(Integer componentId) {
        this.componentId = componentId;
    }

    public Integer getComponentId() {
        return this.componentId;
    }

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
    }

    public Integer getProjectId() {
        return this.projectId;
    }

    public void setComponentFromId(Integer componentFromId) {
        this.componentFromId = componentFromId;
    }

    public Integer getComponentFromId() {
        return this.componentFromId;
    }

    public void setComponentDes(String componentDes) {
        this.componentDes = componentDes;
    }

    public String getComponentDes() {
        return this.componentDes;
    }

    public void setComponentName(String componentName) {
        this.componentName = componentName;
    }

    public String getComponentName() {
        return this.componentName;
    }

    public void setComponentDataList(String componentDataList) {
        this.componentDataList = componentDataList;
    }

    public String getComponentDataList() {
        return this.componentDataList;
    }

    public void setCreateAt(Date createAt) {
        this.createAt = createAt;
    }

    public Date getCreateAt() {
        return this.createAt;
    }

    public void setIsDeleted(Integer isDeleted) {
        this.isDeleted = isDeleted;
    }

    public Integer getIsDeleted() {
        return this.isDeleted;
    }

    public void setComponentRelations(String componentRelations) {
        this.componentRelations = componentRelations;
    }

    public String getComponentRelations() {
        return this.componentRelations;
    }

    public void setComponentSort(Integer componentSort) {
        this.componentSort = componentSort;
    }

    public Integer getComponentSort() {
        return this.componentSort;
    }

    public void setComponentGroup(String componentGroup) {
        this.componentGroup = componentGroup;
    }

    public String getComponentGroup() {
        return this.componentGroup;
    }

    public void setComponentType(String componentType) {
        this.componentType = componentType;
    }

    public String getComponentType() {
        return this.componentType;
    }

    public void setComponentImg(String componentImg) {
        this.componentImg = componentImg;
    }

    public String getComponentImg() {
        return this.componentImg;
    }

    public void setComponentUseTip(String componentUseTip) {
        this.componentUseTip = componentUseTip;
    }

    public String getComponentUseTip() {
        return this.componentUseTip;
    }

}