package com.yaj.common.generate.base;


public abstract class BaseDBInfo {
    /**
     * 表名去下滑线
     */
    protected String tableNameWithoutUnderline;
    /**
     * 列名驼峰命名
     */
    protected String columnNameWithCamelCase;
    /**
     * 对应实体类名
     */
    protected String entityPrefix;
    /**
     * 类字段类型
     */
    protected String fieldType;


    /**
     * 获取原有表名
     *
     * @return
     */
    public abstract String geOriginalTableName();

    /**
     * 获取原有列名
     *
     * @return
     */
    public abstract String geOriginalCloumnName();

    /**
     * 获取数据库字段类型
     *
     * @return
     */
    public abstract String getOriginalDataType();

    /**
     * 初始化
     */
    public void init() {
        this.tableNameWithoutUnderline = DBInfoUtil.removeUnderlineAndLowerCase(geOriginalTableName());
        this.columnNameWithCamelCase = DBInfoUtil.columnName2CamelCase(geOriginalCloumnName());
        this.entityPrefix = DBInfoUtil.columnName2CamelCase(geOriginalTableName(), true);
        this.fieldType = DBInfoUtil.dbType2JavaType(getOriginalDataType());
    }

    public String getTableNameWithoutUnderline() {
        return tableNameWithoutUnderline;
    }

    public void setTableNameWithoutUnderline(String tableNameWithoutUnderline) {
        this.tableNameWithoutUnderline = tableNameWithoutUnderline;
    }

    public String getColumnNameWithCamelCase() {
        return columnNameWithCamelCase;
    }

    public void setColumnNameWithCamelCase(String columnNameWithCamelCase) {
        this.columnNameWithCamelCase = columnNameWithCamelCase;
    }



    public String getFieldType() {
        return fieldType;
    }

    public void setFieldType(String fieldType) {
        this.fieldType = fieldType;
    }

    public String getEntityPrefix() {
        return entityPrefix;
    }

    public void setEntityPrefix(String entityPrefix) {
        this.entityPrefix = entityPrefix;
    }
}
