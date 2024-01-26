package com.yaj.common.generate;
 
import com.yaj.common.generate.base.DBInfoUtil;
import com.yaj.common.generate.base.GenerateFileUtil;
import com.yaj.core.util.IterablesUtil;

import org.beetl.core.Configuration;
import org.beetl.core.GroupTemplate;
import org.beetl.core.Template;
import org.beetl.core.resource.ClasspathResourceLoader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.io.*; 
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map; 
import java.util.stream.Collectors;

@Service
public class GenerateService {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final String backbasePath = "E:/privatedata/spring_original/src/main/java/com/autoproject";
    private final String frontbasePath = "E:/privatedata/vueelement_original/src/views/auto_project_pages";
    
    public void test() {
        String sql = "SELECT table_name as tableName FROM INFORMATION_SCHEMA.TABLES\n" +
                "WHERE table_schema = 'httpresponse'";
//        List<TableInfo> list = jdbcTemplate.queryForList(sql,TableInfo.class);
        List<TableInfo> list = jdbcTemplate.query(sql, new RowMapper<TableInfo>() {
            @Override
            public TableInfo mapRow(ResultSet resultSet, int i) throws SQLException {
                TableInfo tableInfo = new TableInfo();
                tableInfo.setTableName(resultSet.getString(1));
                return tableInfo;
            }
        });
        System.out.println(list);
    }

    public List<String> getAllTableNames(String tableSchema) {
        String sql = "SELECT table_name as tableName FROM INFORMATION_SCHEMA.TABLES\n" +
                "WHERE table_schema = '" + tableSchema + "'";
        return jdbcTemplate.query(sql, new RowMapper<String>() {
            @Override
            public String mapRow(ResultSet resultSet, int i) throws SQLException {
                return resultSet.getString(1);
            }
        });
    }

    public List<TableInfo> getColumnsByTableName(String tableSchema,String tableName) {
        String sql = " select DISTINCT c.TABLE_NAME as tableName,COLUMN_NAME as columnName,ORDINAL_POSITION as ordinalPosition, " +
                " IS_NULLABLE as nullAble,DATA_TYPE as dataType,COLUMN_KEY as columnKey,COLUMN_COMMENT as columnComment, " +
                " TABLE_COMMENT AS tableComment " +
                " from information_schema.COLUMNS c " +
                " left join INFORMATION_SCHEMA.TABLES t " +
                " on c.TABLE_NAME=t.TABLE_NAME and c.TABLE_SCHEMA=t.TABLE_SCHEMA " +
                " where c.TABLE_NAME='" + tableName + "' and c.table_schema='"+tableSchema+"'";
        return jdbcTemplate.query(sql, new RowMapper<TableInfo>() {
            @Override
            public TableInfo mapRow(ResultSet resultSet, int i) throws SQLException {
                TableInfo tableInfo = new TableInfo();
                tableInfo.setTableName(resultSet.getString(1));
                tableInfo.setColumnName(resultSet.getString(2));
                tableInfo.setOrdinalPosition(resultSet.getInt(3));
                tableInfo.setNullAble(resultSet.getBoolean(4));
                tableInfo.setDataType(resultSet.getString(5));
                tableInfo.setColumnKey(resultSet.getString(6));
                tableInfo.setColumnComment(resultSet.getString(7));
                tableInfo.setTableComment(resultSet.getString(8));
                tableInfo.init();
                return tableInfo;
            }
        });
    }

    public void processGeneretion(String schema,String moduleName,String basePath, String... tableNames) throws IOException {
 
        String modulePath = basePath + File.separator + moduleName;

        ClasspathResourceLoader resourceLoader = new ClasspathResourceLoader("generate-template");
        Configuration cfg = Configuration.defaultConfiguration();
        GroupTemplate gt = new GroupTemplate(resourceLoader, cfg);


        List<String> tableNamesList = Arrays.asList(tableNames);
        tableNamesList.forEach(tableName -> {
            String tableNameWithoutUnderLine = tableName.replace("_", "");
            List<TableInfo> tableInfoList = getColumnsByTableName(schema, tableName);
            List<TableConstant> tableConstantList = tableInfoList.stream()
                    .filter(tableInfo -> tableInfo.getColumnComment().startsWith("@"))
                    .map(tableInfo -> {
                        TableConstant tableConstant = new TableConstant();
                        tableConstant.setClassName(DBInfoUtil.columnName2CamelCase(tableInfo.getColumnName(), true));

                        InputStream inputStream = new ByteArrayInputStream(tableInfo.getColumnComment().getBytes());
                        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));

                        IterablesUtil.forEach(reader.lines().filter(s -> !"".equals(s)).collect(Collectors.toList()), (index, s) -> {
                            if (index == 0) {
                                tableConstant.setClassComment(s.trim().replaceFirst("@", ""));
                                if (tableConstant.getClassName().toLowerCase().contains(TableConstantEnum.TYPE.getValue())) {
                                    tableConstant.setType(TableConstantEnum.TYPE);
                                } else if (tableConstant.getClassName().toLowerCase().contains(TableConstantEnum.STATUS.getValue())) {
                                    tableConstant.setType(TableConstantEnum.STATUS);
                                }
                            } else {
                            	s = s.trim().replaceAll("\\s+", " ");
                            	if(!s.equals("")) {
                            		TableConstantItem tableConstantItem = new TableConstantItem();
                                    try {
                                        tableConstantItem.setValue(s.split("=")[0].trim());
                                        tableConstantItem.setKey(s.split("=")[1].trim().split(" ")[0].toUpperCase());
                                        tableConstantItem.setDescribe(s.split("=")[1].trim().split(" ")[1]);
                                    } catch (Exception e) {
                                        tableConstantItem.setError("格式错误："+s);
                                    }
                                    tableConstant.getItems().add(tableConstantItem);
                                }                            	
                                
                            }
                        });

                        return tableConstant;
                    })
                    .collect(Collectors.toList());


            String tableComment = tableInfoList.get(0).getTableComment();
           
            //po
            Template t = gt.getTemplate("po.template");
            t.binding("moduleName", moduleName);
            t.binding("tableName", tableName);
            t.binding("packageName", DBInfoUtil.removeUnderlineAndLowerCase(tableName));
            t.binding("entityPrefix", DBInfoUtil.columnName2CamelCase(tableName, true));
            t.binding("columnList", tableInfoList);
            t.binding("tableComment", tableComment);
            String content = t.render();
            try {
                GenerateFileUtil.writeToFile(content, GenerateFileUtil.mergePath(modulePath, "business", tableNameWithoutUnderLine, "entity", "po", DBInfoUtil.columnName2CamelCase(tableName, true) + "PO.java"), true);
                GenerateFileUtil.writeToFile(null, GenerateFileUtil.mergePath(modulePath, "business", tableNameWithoutUnderLine, "entity", "vo"), true);
            } catch (IOException e) {
                e.printStackTrace();
            }

            //type && status
            t = gt.getTemplate("type_status.template");
            t.binding("moduleName", moduleName);
            t.binding("packageName", DBInfoUtil.removeUnderlineAndLowerCase(tableName));
            for(TableConstant tableConstant:tableConstantList){
                if(true){
                    t.binding("type", tableConstant.getType().getValue().toLowerCase());
                    t.binding("constant",tableConstant);
                    content = t.render();
                    try {
                        GenerateFileUtil.writeToFile(content, GenerateFileUtil.mergePath(modulePath, "business", tableNameWithoutUnderLine, "entity",tableConstant.getType().getValue().toLowerCase(), tableConstant.getClassName() + ".java"), true);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }

            //mapper.java
            t = gt.getTemplate("mapper-java.template");
            t.binding("moduleName", moduleName);
            t.binding("tableName", tableName);
            t.binding("packageName", DBInfoUtil.removeUnderlineAndLowerCase(tableName));
            t.binding("entityPrefix", DBInfoUtil.columnName2CamelCase(tableName, true));
            t.binding("tableComment", tableComment);
            content = t.render();
            try {
                GenerateFileUtil.writeToFile(content, GenerateFileUtil.mergePath(modulePath, "business", tableNameWithoutUnderLine, "mapper", DBInfoUtil.columnName2CamelCase(tableName, true) + "Mapper.java"), false);
            } catch (IOException e) {
                e.printStackTrace();
            }

            //mapper.xml
            t = gt.getTemplate("mapper-xml.template");
            t.binding("moduleName", moduleName);
            t.binding("tableName", tableName);
            t.binding("packageName", DBInfoUtil.removeUnderlineAndLowerCase(tableName));
            t.binding("entityPrefix", DBInfoUtil.columnName2CamelCase(tableName, true));
            content = t.render();
            try {
                GenerateFileUtil.writeToFile(content, GenerateFileUtil.mergePath(modulePath, "business", tableNameWithoutUnderLine, "mapper", DBInfoUtil.columnName2CamelCase(tableName, true) + "Mapper.xml"), false);
            } catch (IOException e) {
                e.printStackTrace();
            }

            //service
            t = gt.getTemplate("service.template");
            t.binding("moduleName", moduleName);
            t.binding("tableName", tableName);
            t.binding("packageName", DBInfoUtil.removeUnderlineAndLowerCase(tableName));
            t.binding("entityPrefix", DBInfoUtil.columnName2CamelCase(tableName, true));
            t.binding("objectPrefix", DBInfoUtil.columnName2CamelCase(tableName, false));
            t.binding("tableComment", tableComment);
            content = t.render();
            try {
                GenerateFileUtil.writeToFile(content, GenerateFileUtil.mergePath(modulePath, "business", tableNameWithoutUnderLine, "service", DBInfoUtil.columnName2CamelCase(tableName, true) + "Service.java"), false);
            } catch (IOException e) {
                e.printStackTrace();
            }
        });


    }


    public void autoProject$back(String moduleName, String schema) throws Exception {
    	List<String> tableNamesList = getAllTableNames(schema);
    	
    	ClasspathResourceLoader resourceLoader = new ClasspathResourceLoader("autoproject-back-template");
        Configuration cfg = Configuration.defaultConfiguration();
        GroupTemplate gt = new GroupTemplate(resourceLoader, cfg);
        String modulePath = backbasePath + File.separator + moduleName;
        tableNamesList.forEach(tableName -> {
            String tableNameWithoutUnderLine = tableName.replace("_", "");
            List<TableInfo> tableInfoList = getColumnsByTableName(schema, tableName);
            List<TableConstant> tableConstantList = tableInfoList.stream()
                    .filter(tableInfo -> tableInfo.getColumnComment().startsWith("@"))
                    .map(tableInfo -> {
                        TableConstant tableConstant = new TableConstant();
                        tableConstant.setClassName(DBInfoUtil.columnName2CamelCase(tableInfo.getColumnName(), true));

                        InputStream inputStream = new ByteArrayInputStream(tableInfo.getColumnComment().getBytes());
                        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));

                        IterablesUtil.forEach(reader.lines().filter(s -> !"".equals(s)).collect(Collectors.toList()), (index, s) -> {
                            if (index == 0) {
                                tableConstant.setClassComment(s.trim().replaceFirst("@", ""));
                                if (tableConstant.getClassName().toLowerCase().contains(TableConstantEnum.TYPE.getValue())) {
                                    tableConstant.setType(TableConstantEnum.TYPE);
                                } else if (tableConstant.getClassName().toLowerCase().contains(TableConstantEnum.STATUS.getValue())) {
                                    tableConstant.setType(TableConstantEnum.STATUS);
                                }
                            } else {
                            	s = s.trim().replaceAll("\\s+", " ");
                            	if(!s.equals("")) {
                            		TableConstantItem tableConstantItem = new TableConstantItem();
                                    try {
                                        tableConstantItem.setValue(s.split("=")[0].trim());
                                        tableConstantItem.setKey(s.split("=")[1].trim().split(" ")[0].toUpperCase());
                                        tableConstantItem.setDescribe(s.split("=")[1].trim().split(" ")[1]);
                                    } catch (Exception e) {
                                        tableConstantItem.setError("格式错误："+s);
                                    }
                                    tableConstant.getItems().add(tableConstantItem);
                                }                            	
                                
                            }
                        });

                        return tableConstant;
                    })
                    .collect(Collectors.toList());


            String tableComment = tableInfoList.get(0).getTableComment();

            //po
            Template t = gt.getTemplate("po.template");
            t.binding("moduleName", moduleName);
            t.binding("tableName", tableName);
            t.binding("packageName", DBInfoUtil.removeUnderlineAndLowerCase(tableName));
            t.binding("entityPrefix", DBInfoUtil.columnName2CamelCase(tableName, true));
            t.binding("columnList", tableInfoList);
            t.binding("tableComment", tableComment);
            String content = t.render();
            try {
                GenerateFileUtil.writeToFile(content, GenerateFileUtil.mergePath(modulePath, "business", tableNameWithoutUnderLine, "entity", "po", DBInfoUtil.columnName2CamelCase(tableName, true) + "PO.java"), true);
            } catch (IOException e) {
                e.printStackTrace();
            }

            //type && status
            t = gt.getTemplate("type_status.template");
            t.binding("moduleName", moduleName);
            t.binding("packageName", DBInfoUtil.removeUnderlineAndLowerCase(tableName));
            for(TableConstant tableConstant:tableConstantList){
                if(true){
                    t.binding("type", tableConstant.getType().getValue().toLowerCase());
                    t.binding("constant",tableConstant);
                    content = t.render();
                    try {
                        GenerateFileUtil.writeToFile(content, GenerateFileUtil.mergePath(modulePath, "business", tableNameWithoutUnderLine, "entity",tableConstant.getType().getValue().toLowerCase(), tableConstant.getClassName() + ".java"), true);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }

            //mapper.java
            t = gt.getTemplate("mapper-java.template");
            t.binding("moduleName", moduleName);
            t.binding("tableName", tableName);
            t.binding("packageName", DBInfoUtil.removeUnderlineAndLowerCase(tableName));
            t.binding("entityPrefix", DBInfoUtil.columnName2CamelCase(tableName, true));
            t.binding("tableComment", tableComment);
            content = t.render();
            try {
                GenerateFileUtil.writeToFile(content, GenerateFileUtil.mergePath(modulePath, "business", tableNameWithoutUnderLine, "mapper", DBInfoUtil.columnName2CamelCase(tableName, true) + "Mapper.java"), false);
            } catch (IOException e) {
                e.printStackTrace();
            }

            //mapper.xml
            t = gt.getTemplate("mapper-xml.template");
            t.binding("moduleName", moduleName);
            t.binding("tableName", tableName);
            t.binding("packageName", DBInfoUtil.removeUnderlineAndLowerCase(tableName));
            t.binding("entityPrefix", DBInfoUtil.columnName2CamelCase(tableName, true));
            content = t.render();
            try {
                GenerateFileUtil.writeToFile(content, GenerateFileUtil.mergePath(modulePath, "business", tableNameWithoutUnderLine, "mapper", DBInfoUtil.columnName2CamelCase(tableName, true) + "Mapper.xml"), false);
            } catch (IOException e) {
                e.printStackTrace();
            }

            //service
            t = gt.getTemplate("service.template");
            t.binding("moduleName", moduleName);
            t.binding("tableName", tableName);
            t.binding("packageName", DBInfoUtil.removeUnderlineAndLowerCase(tableName));
            t.binding("entityPrefix", DBInfoUtil.columnName2CamelCase(tableName, true));
            t.binding("objectPrefix", DBInfoUtil.columnName2CamelCase(tableName, false));
            t.binding("tableComment", tableComment);
            content = t.render();
            try {
                GenerateFileUtil.writeToFile(content, GenerateFileUtil.mergePath(modulePath, "business", tableNameWithoutUnderLine, "service", DBInfoUtil.columnName2CamelCase(tableName, true) + "Service.java"), false);
            } catch (IOException e) {
                e.printStackTrace();
            }
           
        });

    }
    
    public void testGenerateVo(String moduleName, String tableName, Map<String,String> map) throws Exception{
    	ClasspathResourceLoader resourceLoader = new ClasspathResourceLoader("autoproject-back-template");
        Configuration cfg = Configuration.defaultConfiguration();
        GroupTemplate gt = new GroupTemplate(resourceLoader, cfg);
        String modulePath = backbasePath;
        Template t = gt.getTemplate("vo.template");
 
        t.binding("attributeAndType", map);
	
        t.binding("moduleName", moduleName);
        t.binding("tableName", tableName);
        t.binding("packageName", DBInfoUtil.removeUnderlineAndLowerCase(tableName));
        t.binding("entityPrefix", DBInfoUtil.columnName2CamelCase(tableName, true));
        t.binding("objectPrefix", DBInfoUtil.columnName2CamelCase(tableName, false));
        t.binding("tableComment", "test_test");
        String content = t.render(); 
	    try {
	        GenerateFileUtil.writeToFile(content, GenerateFileUtil.mergePath(modulePath, "business", tableName.replace("_", ""), "entity", "vo", DBInfoUtil.columnName2CamelCase(tableName, true) + "VO.java"), true);
	    } catch (IOException e) {
	        e.printStackTrace();
	    }
    }
    public void test2() throws Exception { 
    	 autoProject$back("testautoproject","auto_project");
	}
    
    public void autoProject$front( String schema, List<String> tableNamesList) throws Exception {
    	String modulePath = frontbasePath;
    	
    	 ClasspathResourceLoader resourceLoader = new ClasspathResourceLoader("autoproject-front-template");
         Configuration cfg = Configuration.defaultConfiguration();
         GroupTemplate gt = new GroupTemplate(resourceLoader, cfg);
         
         
         tableNamesList.forEach(tableName -> {
        	 
	         Template t = gt.getTemplate("vuepages.template");
	         //some privilege need to do
	         //
	         
	         List<Map<String, String>> list = new ArrayList<>();
	         Map<String, String> sub = new HashMap<>();
	         	sub.put("prop", "testProp");
	         	sub.put("label", "testLabel");
	         	sub.put("type", "testType");
	         	sub.put("rule", "testRule"); 
	         	list.add(sub);
	         t.binding("tableName", tableName);
	         t.binding("props", list);
	         
	         t.binding("entityPrefix", DBInfoUtil.columnName2CamelCase(tableName, true));
	         
	         String content = t.render();
	         try {
	             GenerateFileUtil.writeToFile(content, GenerateFileUtil.mergePath(modulePath, DBInfoUtil.columnName2CamelCase(tableName, true) + "AP.vue"), true);
	         } catch (IOException e) {
	             e.printStackTrace();
	         }
         });
    }
    public void test$front() throws Exception {
    	autoProject$front("testautoproject",getAllTableNames("auto_project"));
    }
}
