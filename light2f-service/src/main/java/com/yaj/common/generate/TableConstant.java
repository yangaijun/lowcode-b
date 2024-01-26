package com.yaj.common.generate;

import java.util.ArrayList;
import java.util.List;

/**
 * type status注释实体<br>
 *     @测试类
 *     0=zero 零
 *     1=one 一
 *     2=two 二
 *
 */
public class TableConstant {
    /**
     * 类名，首字母大写，驼峰命名
     */
    private String className;
    /**
     * 类注释
     */
    private String classComment;
    /**
     * 类型：type status
     */
    private TableConstantEnum type;
    /**
     * 注释列表
     */
    private List<TableConstantItem> items = new ArrayList<>();


    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getClassComment() {
        return classComment;
    }

    public void setClassComment(String classComment) {
        this.classComment = classComment;
    }

    public TableConstantEnum getType() {
        return type;
    }

    public void setType(TableConstantEnum type) {
        this.type = type;
    }

    public List<TableConstantItem> getItems() {
        return items;
    }

    public void setItems(List<TableConstantItem> items) {
        this.items = items;
    }
}
