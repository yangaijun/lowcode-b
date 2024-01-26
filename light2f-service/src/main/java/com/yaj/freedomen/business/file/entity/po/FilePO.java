package com.yaj.freedomen.business.file.entity.po;

import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableLogic;

import java.math.BigDecimal;
import java.util.Date;

/*
 * @Description: 文件
 * @date: 2022-02-28
 */
@TableName(value = "file")
public class FilePO {
    /*
    *
    */
    @TableId
    private Integer fileId;
    /*
    *没有parentId
    */
    private Integer parentId;
    /*
    *
    */
    private String fileName;
    /*
    *1:文件夹
    */
    private Integer fileType;
    /*
    *
    */
    @TableLogic
    private Integer isDeleted;
    /*
    *
    */
    private Date createdAt;

    public void setFileId(Integer fileId) {
        this.fileId = fileId;
    }

    public Integer getFileId() {
        return this.fileId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    public Integer getParentId() {
        return this.parentId;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileName() {
        return this.fileName;
    }

    public void setFileType(Integer fileType) {
        this.fileType = fileType;
    }

    public Integer getFileType() {
        return this.fileType;
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