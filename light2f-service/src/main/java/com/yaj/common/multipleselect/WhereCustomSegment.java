package com.yaj.common.multipleselect;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map; 

public class WhereCustomSegment { 
	
	private TableEntity tableEntity;
	
	private List<String> segmentSql;
	
	private Map<String, Object> parameter = null;
	
	private String parameterPrefixName;
	
	private String once = null;

	private String currentOpreatioalType = "AND"; 
	
	private final Integer leftDivision = 0x0001;
	
	private final Integer rightDivision = 0x0002;
	
	public WhereCustomSegment(TableEntity tableEntity) {
		segmentSql = new ArrayList<>();
		this.tableEntity = tableEntity; 
		parameter = new HashMap<>();
		parameterPrefixName = "custom_" + tableEntity.getNickName() + "_";
	}
	private String getOpreatioalType() {
		if (this.once != null) {
			String temp = this.once;
			this.once = null;
			return temp; 
		} else { 
			return currentOpreatioalType;
		}
	}
	//create same segment [tableName].[tableCoumn] as: 'and table1.table_column1',if no column be found,return null;
	private StringBuffer getPublicSegment(String column) {
		StringBuffer sb = new StringBuffer();
		if (!tableEntity.getAllEntityColumns().contains(column)) {
			(new Exception("no column '" + column + "' be found in table " + tableEntity.getTableName())).printStackTrace();
			return null;
		}
		try {
			if (segmentSql.get(segmentSql.size() - 1).indexOf("(") == -1 
					|| (segmentSql.get(segmentSql.size() - 1).indexOf("(") != -1 
						&& segmentSql.get(segmentSql.size() - 1).indexOf(")") != -1
						&& segmentSql.get(segmentSql.size() - 1).indexOf("(") < segmentSql.get(segmentSql.size() - 1).indexOf(")")))
				sb.append(getOpreatioalType()); 
		} catch (Exception e) {
			sb.append(getOpreatioalType());
		}
		sb.append(" ")
		  .append(tableEntity.getNickName()).append(".")
		  .append(tableEntity.getAllTableColumns().get(tableEntity.getAllEntityColumns().indexOf(column)))
		  .append(" ");
		return sb;
	} 
	private String getKey(String column) {
		String key = null;
		int index = 0;
		do {
			key = this.parameterPrefixName + column + index ++; 
			//if var name use 10
			if (index > 10)
				break;
		} while (parameter.get(key) != null);
		return key;
	}
	private void setSimpleOpreation(boolean ifNeed, String column, Object value, String opreation) {
		if (ifNeed) {
			StringBuffer sb = getPublicSegment(column); 
			if (sb != null) { 
				String key = getKey(column); 
				sb.append(opreation)
				  .append(" ")
				  .append("#{parameter.")
				  .append(key)
				  .append("}");
				parameter.put(key, value);
				segmentSql.add(sb.toString());
			}
		}  
	}
	public WhereCustomSegment like(boolean ifNeed, String column, String value) {
		this.setSimpleOpreation(ifNeed, column, "%" + value + "%", "LIKE");
		return this;
	}
	public WhereCustomSegment or() {
		if (!this.currentOpreatioalType.equals("OR"))
			this.currentOpreatioalType = "OR";
		return this;
	}
	public WhereCustomSegment and() {
		if (!this.currentOpreatioalType.equals("AND"))
			this.currentOpreatioalType = "AND";
		return this;
	}
	public WhereCustomSegment andOnce() {
		this.once = "AND";
		return this;
	}
	public WhereCustomSegment orOnce() {
		this.once = "OR";
		return this;
	}
	public WhereCustomSegment between(boolean ifNeed, String column, Object left, Object right) {
		if (ifNeed) {
			StringBuffer sb = getPublicSegment(column); 
			if (sb != null) { 
				String key = this.parameterPrefixName + column;
				sb.append("BETWEEN #{parameter.").append(key).append("_left} AND #{parameter.").append(key).append("_right}");
				parameter.put(key + "_left",  left);
				parameter.put(key + "_right",  right);
				segmentSql.add(sb.toString());
			}
		}
		return this;
	}
	private Integer lastDivisionType() {
		int  i = segmentSql.size() - 1;
		int  countLeft = 0, countRight = 0; 
		for ( ; i >= 0; i --) { 
			int index = 0;
			while (index < segmentSql.get(i).length()) {
				if (segmentSql.get(i).charAt(index) == '(') {
					countLeft ++;
				} else if (segmentSql.get(i).charAt(index) == ')') {
					countRight ++;
				}
				index ++;
			}
		} 
		return countLeft == countRight ? rightDivision : leftDivision;
	}
	public WhereCustomSegment division() {
		if (this.lastDivisionType() == rightDivision) {
			segmentSql.add(" " + getOpreatioalType() + " (");
		} else {
			segmentSql.add(") " + getOpreatioalType() + " (");
		}
		return this;
	}
	public WhereCustomSegment between(String column, Object left, Object right) {
		return this.between(true, column, left, right);
	}
	public WhereCustomSegment like(String column, String value) { 
		return this.like(true, column, value);
	}
	public WhereCustomSegment notLike(boolean ifNeed, String column, String value) {
		this.setSimpleOpreation(ifNeed, column, "%" + value + "%", "NOT LIKE");
		return this;
	}
	public WhereCustomSegment notLike(String column,String value) { 
		return this.notLike(true, column, value);
	}
	public WhereCustomSegment eq(boolean ifNeed, String column, Object value) {
		this.setSimpleOpreation(ifNeed, column, value, "="); 
		return this;
	} 
	public WhereCustomSegment le(boolean ifNeed, String column, Object value) {
		this.setSimpleOpreation(ifNeed, column, value, "<="); 
		return this;
	} 
	public WhereCustomSegment le(String column, Object value) {
		this.le(true, column, value);
		return this;
	}
	public WhereCustomSegment lt(boolean ifNeed, String column, Object value) {
		this.setSimpleOpreation(ifNeed, column, value, "<"); 
		return this;
	} 
	public WhereCustomSegment lt(String column, Object value) {
		this.lt(true, column, value);
		return this;
	}
	public WhereCustomSegment ge(boolean ifNeed, String column, Object value) {
		this.setSimpleOpreation(ifNeed, column, value, ">="); 
		return this;
	}
	public WhereCustomSegment ge(String column, Object value) {
		this.ge(true, column, value);
		return this;
	}
	public WhereCustomSegment gt(boolean ifNeed, String column, Object value) {
		this.setSimpleOpreation(ifNeed, column, value, ">"); 
		return this;
	}
	public WhereCustomSegment gt(String column, Object value) {
		this.gt(true, column, value);
		return this;
	}
	public WhereCustomSegment eq(String column, Object value) {
		return this.eq(true, column, value);
	}
	public WhereCustomSegment notEq(boolean ifNeed, String column, Object value) {
		this.setSimpleOpreation(ifNeed, column, value, "<>"); 
		return this;
	}
	public WhereCustomSegment notEq(String column, Object value) {
		return this.notEq(true, column, value);
	}
	private void inOrNotIn(StringBuffer sb, String op, String column, Collection<?> value) {
		sb.append(op).append(" ("); 
		Iterator<?> iterator = value.iterator();
		int index = 0;
		while (iterator.hasNext()) {
			StringBuffer sub = new StringBuffer();
			sub.append(parameterPrefixName)
			   .append(column)
			   .append("_")
			   .append(op.replaceAll(" ", ""))
			   .append("_")
			   .append(index ++);
			
			sb.append("#{parameter.")
			  .append(sub)
			  .append("},");
			this.parameter.put(sub.toString(), iterator.next());
		}
		sb.deleteCharAt(sb.length() - 1);  
		sb.append(")");
	}
	public WhereCustomSegment in(String column, Collection<?> value) { 
		return this.in(true, column, value);
	} 
	public WhereCustomSegment in(boolean ifNeed, String column, Collection<?> value) { 
		if (ifNeed) {
			StringBuffer sb = this.getPublicSegment(column);
			if (sb != null) {
				inOrNotIn(sb, "IN", column, value);
				segmentSql.add(sb.toString());
			}
		}
		return this;
	} 
	private void nullOrNotNull(String op, String column) {
		StringBuffer sb = this.getPublicSegment(column);
			sb.append("IS") 
			  .append(" ")
			  .append(op);
		segmentSql.add(sb.toString()); 
	}
	public WhereCustomSegment isNull(String column) { 
		nullOrNotNull("NULL", column);
		return this;
	}
	public WhereCustomSegment isNotNull(String column) {
		nullOrNotNull("NOT NULL", column);
		return this;
	}
	public WhereCustomSegment in(String column, Object[] value) { 
		return this.in(true, column, Arrays.asList(value));
	} 
	public WhereCustomSegment in(boolean ifNeed, String column, Object[] value) { 
		return this.in(ifNeed, column, Arrays.asList(value));
	} 
	public WhereCustomSegment notIn(String column, Collection<?> value) { 
		return this.notIn(true, column, value);
	} 
	public WhereCustomSegment notIn(boolean ifNeed, String column, Collection<?> value) { 
		if (ifNeed) {
			StringBuffer sb = this.getPublicSegment(column);
			if (sb != null) {
				inOrNotIn(sb, "NOT IN", column, value);
				segmentSql.add(sb.toString());
			}
		}
		return this;
	} 
	public WhereCustomSegment notIn(String column, Object[] value) { 
		return this.notIn(true, column, Arrays.asList(value));
	} 
	public WhereCustomSegment notIn(boolean ifNeed, String column, Object[] value) { 
		return this.notIn(ifNeed, column, Arrays.asList(value));
	} 
	public List<String> getSegmentSql() {
		if (this.lastDivisionType() == leftDivision) {
			segmentSql.add(")");
		}
		return segmentSql;
	}
	public void setSegmentSql(List<String> segmentSql) {
		this.segmentSql = segmentSql;
	}
	public Map<String, Object> getParameter() {
		return parameter;
	}
	public void setParameter(Map<String, Object> parameter) {
		this.parameter = parameter;
	}
	//exp:("year(createTime)=? and month(createTime)=?", new Object[]{2019, 10})
	public WhereCustomSegment sql(String sql, Object[] params) {
		  StringBuffer segmentSql = new StringBuffer(getOpreatioalType() + " ");
		  
		  int index = 0;
		  for (int i = 0; i < sql.length(); i ++) {
			   if (Character.isAlphabetic(sql.charAt(i))) {
				   StringBuffer sb = new StringBuffer();
				   do {
					   sb.append(sql.charAt(i));
				   } while(Character.isAlphabetic(sql.charAt(++ i)));
				   i --;
				   if (tableEntity.getAllEntityColumns().contains(sb.toString())) {
					   segmentSql.append(tableEntity.getNickName())
					   	.append(".")
					   	.append(tableEntity.getAllTableColumns().get(tableEntity.getAllEntityColumns().indexOf(sb.toString())));
				   } else {
					   segmentSql.append(sb.toString());
				   }
			   } else if (sql.charAt(i) == '?') {
				   String key = getKey("Sql");
				   segmentSql.append("#{parameter.")
				   	.append(key)
				   	.append("}");
				   if (index >= params.length) {
					   new Exception("few params").printStackTrace();
				   }
				   this.parameter.put(key, params[index ++]);
			   } else {
				   segmentSql.append(sql.charAt(i));
			   }
		  }
		  this.segmentSql.add(segmentSql.toString()); 
		  return this;
	}
}
