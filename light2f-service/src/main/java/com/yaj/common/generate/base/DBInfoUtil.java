package com.yaj.common.generate.base;

import java.util.Arrays;

import com.yaj.core.util.IterablesUtil;

public class DBInfoUtil {
    /**
     * 带下滑线字段转驼峰输出
     *
     * @param columnName
     * @return
     */
    public static String columnName2CamelCase(String columnName, boolean firstCharUpper) {
        StringBuffer sb = new StringBuffer("");
        IterablesUtil.forEach(Arrays.asList(columnName.split("_")), (index, str) -> {
            if (!firstCharUpper && index == 0) {
                sb.append(str.toLowerCase());
            } else {
                sb.append(str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase());
            }
        });
        return sb.toString();
    }

    /**
     * 带下滑线字段转驼峰输出，默认首字母大写
     *
     * @param columnName
     * @return
     */
    public static String columnName2CamelCase(String columnName) {
        return columnName2CamelCase(columnName, false);
    }

    /**
     * 去除下滑线,且输出为小写字母
     *
     * @param str
     * @return
     */
    public static String removeUnderlineAndLowerCase(String str) {
        return str.replaceAll("_", "").toLowerCase();
    }

    /**
     * 数据库实体类类型对应转换
     * @param type
     * @return
     */
    public static String dbType2JavaType(String type) {
        type = type.toUpperCase();
        switch(type){
            case "VARCHAR":
            case "CHAR":
                return "String";
            case "NUMBER":
            case "DECIMAL":
                return "BigDecimal";
            case "TINYINT":
            case "SMALLINT":
            case "MEDIUMINT":
            case "INT":
            case "BIT":
                return "Integer";
            case "BIGINT":
                return "Long";
            case "DATETIME":
            case "TIMESTAMP":
            case "DATE":
                return "Date";
            //		case "BIT":
            //			return "Boolean";
            default:
                return "String";
        }
    }

    public static void main(String[] args) {
        System.out.println(DBInfoUtil.columnName2CamelCase("abc_def_dfdf"));
        System.out.println(DBInfoUtil.columnName2CamelCase("abc_def_dfdf",false));
        System.out.println(DBInfoUtil.removeUnderlineAndLowerCase("_a_b_c_d_"));
    }
}
