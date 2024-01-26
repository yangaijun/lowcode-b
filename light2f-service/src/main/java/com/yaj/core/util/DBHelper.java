package com.yaj.core.util;

import com.alibaba.druid.sql.SQLUtils;
import com.alibaba.druid.sql.ast.SQLExpr;
import com.alibaba.druid.sql.dialect.mysql.parser.MySqlCreateTableParser;
import com.alibaba.druid.sql.dialect.mysql.parser.MySqlExprParser;
import com.alibaba.druid.sql.parser.SQLParser;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.yaj.common.generate.TableInfo;
import com.yaj.core.log.tools.LogHelper;
import com.yaj.freedomen.utils.WriteUtil;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;

import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class DBHelper {
	public String dbName = null;
	public static final String url = "jdbc:mysql://127.0.0.1/";  
    public static final String name = "com.mysql.jdbc.Driver";  
    public static final String user = "root";  
    public static final String password = "black94.";

    @Value("${log.path}")
    private static String logFilePath;
    public Connection conn = null;  
    public PreparedStatement pst = null;  

    public DBHelper() {  
        this.conn();
    }  

    public void conn () {
    	try {  
            Class.forName(name);//指定连接类型  
            String temp = url;
            if (dbName != null)
            	temp = url + dbName;
            conn = DriverManager.getConnection(temp, user, password);//获取连接  
            
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
    }
    public void close() {  
        try {  
            this.conn.close();  
            this.pst.close();  
        } catch (SQLException e) {  
            e.printStackTrace();  
        }  
    }
    public void resetDBName(String dbName) {
    	this.dbName = dbName;
    	this.close();
    	this.conn();
    }
    public void excuteSql(String sql) throws Exception {
    	pst = conn.prepareStatement(sql);//准备执行语句  
    	pst.executeUpdate();
    }

    private static String getSubStringEndWith(String fullString, Character endCharacter) {
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < fullString.length(); i ++) {
            if (fullString.charAt(i) == endCharacter) {
                return sb.toString();
            } else {
                sb.append(fullString.charAt(i));
            }
        }

        return  sb.toString();
    }

    private static String getTableName(String str) {
        int start = str.indexOf("`") + 1;
        String nextString = str.substring(start);
        int end = nextString.indexOf("`");


        if (end > 0) {
            return nextString.substring(0, end);
        } else {
            LogHelper.log("parse sql tableName error:" + str);
            return "error_format_name";
        }
    }

    public static List<TableInfo> parserTableInfo(String sql) {
        List<TableInfo> tableInfos = new ArrayList<>();
        String tableName = getTableName(sql);
        int start = sql.indexOf('(') + 1;
        String[] cols = sql.substring(start).split("\n");
        String tableComment = null;
        if (cols[cols.length - 1].contains("COMMENT")) {
            String sub = cols[cols.length - 1].substring(cols[cols.length - 1].indexOf("COMMENT"));
            String tabComment = getSubStringEndWith(sub.substring(sub.indexOf("'") + 1), '\'');
            tableComment = tabComment;
        }

        for (String col: cols) {
            if (col.trim().startsWith("`")) {
                TableInfo tableInfo = new TableInfo();
                tableInfo.setTableComment(tableComment);
                tableInfo.setTableName(tableName);
                tableInfo.setColumnName(col.substring(col.indexOf('`') + 1, col.lastIndexOf('`')));
                tableInfo.setNullAble(!col.contains("NOT NULL"));

                String colFieldType = getSubStringEndWith(col.substring(col.lastIndexOf('`') + 2), ' ');
                colFieldType = getSubStringEndWith(colFieldType, '(');
                tableInfo.setDataType(colFieldType);

                if (col.contains("COMMENT")) {
                    String sub = col.substring(col.indexOf("COMMENT"));
                    String comment = getSubStringEndWith(sub.substring(sub.indexOf("'") + 1), '\'');
                    tableInfo.setColumnComment(comment);
                }

                tableInfo.init();

                tableInfos.add(tableInfo);
            }
        }

        return tableInfos;
    }
    @Data
    public static class ImportSqlResult {
        private List<List<TableInfo>> resultList;
        private List<String> sqlInfoList;
    }
    public static ImportSqlResult getImportSql(InputStream inputStream) {
        InputStreamReader isr = new InputStreamReader(inputStream);
        BufferedReader reader = new BufferedReader(isr);
        List<String> lines = reader.lines().collect(Collectors.toList());
        try { reader.close(); } catch (IOException e) { e.printStackTrace(); }

        List<List<TableInfo>> resultList = new ArrayList<>();

        for (int i = 0; i < lines.size(); i ++) {
            String line = lines.get(i);

            if (line.toUpperCase().contains("CREATE TABLE ") && line.contains("(")) {
                StringBuffer sb = new StringBuffer();

                while (!line.startsWith(")") && i < lines.size()) {
                    sb.append(line).append('\n');
                    line = lines.get(++ i);
                }
                sb.append(line);

                resultList.add(parserTableInfo(sb.toString()));

                i --;
            }
        }

        ImportSqlResult result = new ImportSqlResult();
        result.setResultList(resultList);
        result.setSqlInfoList(lines);

        return result;
    }
}
