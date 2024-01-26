package com.yaj.common.generate;

import com.yaj.common.generate.base.BaseDBInfo;

public class TableInfo extends BaseDBInfo {
    /**
     *表名
     */
    private String tableName;
    /**
     * 表描述
     */
    private String tableComment;
    /**
     * 列名
     */
    private String columnName;
    /**
     * 位置
     */
    private Integer ordinalPosition;
    /**
     *是否为空
     */
    private Boolean nullAble;
    /**
     * 数据类型
     */
    private String dataType;
    /**
     * 列主键描述，PRI为主键
     */
    private String columnKey;
    /**
     * 列描述
     */
    private String columnComment;

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getTableComment() {
        return tableComment;
    }

    public void setTableComment(String tableComment) {
        this.tableComment = tableComment;
    }

    public String getColumnName() {
        return columnName;
    }

    public void setColumnName(String columnName) {
        this.columnName = columnName;
    }

    public Integer getOrdinalPosition() {
        return ordinalPosition;
    }

    public void setOrdinalPosition(Integer ordinalPosition) {
        this.ordinalPosition = ordinalPosition;
    }

    public Boolean getNullAble() {
        return nullAble;
    }

    public void setNullAble(Boolean nullAble) {
        this.nullAble = nullAble;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public String getColumnKey() {
        return columnKey;
    }

    public void setColumnKey(String columnKey) {
        this.columnKey = columnKey;
    }

    public String getColumnComment() {
        return columnComment;
    }

    public void setColumnComment(String columnComment) {
        this.columnComment = columnComment;
    }

    @Override
    public String geOriginalTableName() {
        return this.tableName;
    }

    @Override
    public String geOriginalCloumnName() {
        return this.columnName;
    }

    @Override
    public String getOriginalDataType() {
        return this.dataType;
    }


}
