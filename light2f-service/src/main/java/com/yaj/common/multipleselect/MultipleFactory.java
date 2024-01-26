package com.yaj.common.multipleselect;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableLogic;
import com.baomidou.mybatisplus.annotations.TableName;

public class MultipleFactory { 
	private static List<String> AGGREGATES;
	static {
		AGGREGATES = new ArrayList<>(); 
		AGGREGATES.add("AVG");
		AGGREGATES.add("COUNT");
		AGGREGATES.add("MAX");
		AGGREGATES.add("MIN");
		AGGREGATES.add("SUM"); 
	}
	private static MultipleSelect make(String otherColumns, Collection<?> entities) {
		MultipleSelect mulSelect = new MultipleSelect(); 
		TableEntity[] tes = new TableEntity[entities.size()];
		int k = 0;  
		for (Object o : entities) { 
			//Property name is inconsistent with database field name, filter
			Map<String, String> filter = new HashMap<>();
			TableEntity te = new TableEntity();
				te.setLogicDelete(getTableLogic(o)); 
				te.setNotExsit(getTableField(o, filter)); 
				te.setFilter(filter);
				te.setEntity(o);
				te.setTableName(getTableName(o)); 
				te.setAllEntityColumns(getAllEntityColumns(o));
				te.setAllTableColumns(entityColumnsToTableColumns(te.getAllEntityColumns(), filter));
			tes[k ++] = te;
		}  
		//set select columns 
		String[] others = otherColumns.split(",");
		StringBuilder otherColumnSb = new StringBuilder();
		for (String column : others) {
			column = column.trim();
			
			if (column.indexOf(":") != -1) {
				String[] column$2 = column.split(":"); 
				String back = getOtherColumnName(column$2[1], tes, null);
				
				if (back != null && AGGREGATES.contains(column$2[0].toUpperCase())) {
					String[] ctName$t2 = back.split(" "); 
					otherColumnSb.append(",") 
						.append(column$2[0])
						.append("(")
						.append(ctName$t2[0])
						.append(")")
						.append(" ")
						.append(ctName$t2[1]);
				}
			} else if (column.indexOf(" ") != -1) {
				String[] column$2 = column.split(" ");   
				String back = getOtherColumnName(column$2[0], tes, column$2[1]);
				
				if (back != null)
					otherColumnSb.append(",").append(back);
				
			} else {
				String back = getOtherColumnName(column, tes, null);
				if (back != null)
					otherColumnSb.append(",").append(back);
			}
		}
		otherColumnSb.insert(0, tes[0].getSelectSegment());
		mulSelect.setColumns(otherColumnSb.toString());
		mulSelect.setMasterTable(tes[0].getTableName() + " as " + tes[0].getNickName());
		//create left join segment
		List<String> join = new ArrayList<>();
		for (int i = 1; i < tes.length; i ++) {
			StringBuilder sb = new StringBuilder();
			Map<String, String> map = findSameColumn(tes[i], tes, i);
			if (map == null) 
				continue;
			TableEntity te = tes[i];
			sb.append(te.getTableName())
			  .append(" as ")
			  .append(te.getNickName())
			  .append(" on ")
			  .append(te.getNickName())
			  .append(".")
			  .append(map.get("column_left"))
			  .append(" = ") 
			  .append(map.get("table"))
			  .append(".")
			  .append(map.get("column_right"));
			
			join.add(sb.toString());
		}
		mulSelect.setJoin(join);
		//create sqlSegment
		StringBuilder sb = new StringBuilder();
		Map<String, Object> parameter = new HashMap<>(); 
		for (TableEntity te : tes) {
			for (int i = 0; i < te.getAllEntityColumns().size(); i ++) {
				if (!te.getNotExsit().contains(te.getAllEntityColumns().get(i))) {
					Object value;
					try {
						value = getFieldValue(te.getEntity(), te.getAllEntityColumns().get(i));
						if (value != null) {
							String parameterName = "entity_" + te.getNickName() + "_" + te.getAllEntityColumns().get(i);
							sb.append(" and ")
							  .append(te.getNickName())
							  .append(".")
							  .append(te.getAllTableColumns().get(i))
							  .append(" = ")
							  .append(getStringValueByObject(parameterName, value, parameter));
						}
					} catch (Exception e) {
						e.printStackTrace();
					} 
				}
			}
		} 
		mulSelect.addParameter(parameter);
		mulSelect.setSqlSegment(sb.toString());
		mulSelect.setTes(tes);
		return mulSelect;
	}
	public static MultipleSelect makeSelect(String otherColumns, Collection<?> entities) {
		return make(otherColumns, entities);
	}
	//otherColumns such as "${1}.createTime,${jobinfo}.createTime,${job_info}.jobInfoId"
	public static MultipleSelect makeSelect(String otherColumns, Object ...entities) {
		return make(otherColumns, Arrays.asList(entities));
	}
	private static Object getFieldValue(Object entity, String fieldName) {  
        try {    
            String firstLetter = fieldName.substring(0, 1).toUpperCase();    
            String getter = "get" + firstLetter + fieldName.substring(1);    
            Method method = entity.getClass().getMethod(getter, new Class[] {});    
            Object value = method.invoke(entity, new Object[] {});    
            return value;    
        } catch (Exception e) {    
            return null;    
        }    
    }  
	//get table nick name addition '.' and table column by entity column 'tempColumn'
	public static String getOtherColumnName(String tempColumn, TableEntity[] tes, String nickColName) {
		String[] split$2 = tempColumn.split("\\.");
		if (split$2.length == 1) {
			return getOtherAllColumnName(split$2[0].replaceAll("\\$\\{|}", ""), tes);
		} else if (split$2.length != 2) {
			return null;
		}
		String tableDeputyName = split$2[0].replaceAll("\\$\\{|}", "");
		String tableName = null;
		String tableColumn = null;
		StringBuilder sb = new StringBuilder();
		try {
			int tableIndex = Integer.parseInt(tableDeputyName);
			if (tableIndex >= tes.length)
				return null;
			tableName = tes[tableIndex].getNickName();
			if (!tes[tableIndex].getAllEntityColumns().contains(split$2[1])) {
				return null;
			} else {
				tableColumn = tes[tableIndex].getAllTableColumns().get(tes[tableIndex].getAllEntityColumns().indexOf(split$2[1]));
			}
		} catch (Exception e) { 
			for (TableEntity te : tes) {
				String column = tableDeputyName.toLowerCase();
				if (column.equals(te.getNickName().toLowerCase()) || column.equals(te.getTableName().toLowerCase())) {
					tableName = te.getNickName();
					if (!te.getAllEntityColumns().contains(split$2[1])) {
						return null;
					} else {
						tableColumn = te.getAllTableColumns().get(te.getAllEntityColumns().indexOf(split$2[1]));
					}
				}
			}
		}
		if (tableName == null || tableColumn == null)
			return null;
		sb.append(tableName)
			.append(".")
			.append(tableColumn)
			.append(" ")
			.append("`")
			.append(nickColName == null ? split$2[1] : nickColName)
			.append("`");
		
		return sb.toString();
	}
	private static String getOtherAllColumnName(String string, TableEntity[] tes) {
		TableEntity te = null;
		try {
			int tableIndex = Integer.parseInt(string);
			if (tableIndex >= tes.length)
				return null;
			te = tes[tableIndex];
		} catch (Exception e) { 
			for (TableEntity t : tes) {
				String column = string.toLowerCase();
				if (column.equals(t.getNickName().toLowerCase()) || column.equals(t.getTableName().toLowerCase())) {
					te = t;
					break;
				}
			}
		} 
		return te.getSelectSegment();
	}
	//strip injection
	private static String getStringValueByObject(String prefix, Object value, Map<String, Object> parameter) {
		StringBuilder sb = new StringBuilder();
		sb.append("#{parameter.").append(prefix).append("}");
		parameter.put(prefix, value);
		return sb.toString();
	}
	//find two table same column,from during index 'i' to first
	private static Map<String, String> findSameColumn(TableEntity entity, TableEntity[] tes, int i) {
		Map<String, String> map = new HashMap<>();
		String tryId = getIdAnnotation(entity.getEntity().getClass());

		if (tryId != null) {
			for (int j = 0; j < i; j ++) {
				String curId = getIdAnnotation(tes[j].getEntity().getClass());
				if (curId == null) return null;
				
				if (tes[j].getAllEntityColumns().contains(tryId)) { 

					String columnLeft = entity.getFilter().get(tryId);
					if (columnLeft == null) {
						columnLeft = getTableColumn(tryId);
					}
					map.put("column_left", columnLeft);
					
					String columnRight = tes[j].getFilter().get(tryId);
					if (columnRight == null) { 
						columnRight = getTableColumn(tryId); 
					}
					map.put("column_right", columnRight);
					
					map.put("table", tes[j].getNickName());
					return map;
				} else if (entity.getAllEntityColumns().contains(curId)) {
					
					String columnLeft = entity.getFilter().get(curId);
					if (columnLeft == null) {
						columnLeft = getTableColumn(curId);
					}
					map.put("column_left", columnLeft);
					
					String columnRight = tes[j].getFilter().get(curId);
					if (columnRight == null)
						columnRight = getTableColumn(curId);
					map.put("column_right", columnRight);
					
					map.put("table", tes[j].getNickName());
					return map;
				}
			}
		}
		
		return null;
	}
	//get entity has @TableId annotation field name
	public static String getIdAnnotation(Class<?> clazz) {
		Field[] fields = clazz.getDeclaredFields(); 
		for (Field field : fields) {
			if (field.isAnnotationPresent(TableId.class)) {
				return field.getName();
			}
		}
		return null;
	}
	//get entity has @TableField annotation field name 
	public static List<String> getTableField(Object entity, Map<String, String> filter) {
		List<String> names = new ArrayList<>();
		Field[] fields = entity.getClass().getDeclaredFields(); 
		for (Field field : fields) {
			if (field.isAnnotationPresent(TableField.class)) {
				if (field.getAnnotation(TableField.class).exist() == false) {
					names.add(field.getName());
				}
				if (!field.getAnnotation(TableField.class).value().equals("")) { 
					filter.put(field.getName(), field.getAnnotation(TableField.class).value());
				} 
			} else if (field.isAnnotationPresent(TableId.class)) {
				if (!field.getAnnotation(TableId.class).value().equals("")) { 
					filter.put(field.getName(), field.getAnnotation(TableId.class).value());
				} 
			}
		}
		return names;
	}
	//entity column to table column
	public static String getTableColumn(String attribute) { 
		return attribute.replaceAll("[A-Z]", "_$0").toLowerCase();
	}
	//get table name by entity annotation
	public static String getTableName(Object entity) {
		if (entity.getClass().isAnnotationPresent(TableName.class)) {
			return entity.getClass().getAnnotation(TableName.class).value(); 
		}
		(new Exception("the entity " + entity.getClass().getSimpleName() + " is not use @tableName annotation")).printStackTrace();
		return null;
		
	}
	//get table logic column name  by  entity annotation
	public static String getTableLogic(Object entity) {
		 for (Field filed: entity.getClass().getDeclaredFields()) { 
			 if (filed.isAnnotationPresent(TableLogic.class))
				 return MultipleFactory.getTableColumn(filed.getName());
		 }
		 return null;
	}	
	//all of entity columns convert to table columns
	private static List<String> entityColumnsToTableColumns(List<String> columns, Map<String, String> filter) {
		List<String> tableColumns = new ArrayList<>();
		columns.forEach(i -> {
			if (filter.get(i) != null) {
				tableColumns.add(filter.get(i));
			} else {
				tableColumns.add(getTableColumn(i));
			}
		});
		return tableColumns;
	} 
	//get all columns by entity
	private static List<String> getAllEntityColumns(Object entity) {
		Field[] fields = entity.getClass().getDeclaredFields();  
		List<String> names = new ArrayList<>(fields.length); 
        for (Field field: fields) {
        	names.add(field.getName());
        } 
        return names;
	}
}