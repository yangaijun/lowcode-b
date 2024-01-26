package com.yaj.common.multipleselect;

import java.util.ArrayList; 
import java.util.Collection; 
import java.util.HashMap; 
import java.util.List;
import java.util.Map;
 
public class MultipleSelect {
	//select all columns what you want
	private String columns;
	//the from table name
	private String masterTable;
	// order by columns
	private String orderBy;
	//group by
	private String groupBy;
	//left join table names 
	private List<String> join;
	//where sql segment
	private String sqlSegment;
	//TableEntity array
	private TableEntity[] tes;
	//user custom where sql segments
	private List<WhereCustomSegment> whereCustomSegments = null;
	//avoid sql injection parameters
	private Map<String, Object> parameter = null;
	//limit lk
	private boolean addCustomFlag = true;
	//limit start
	private Integer start = null;
	//limit end
	private Integer end = null; 
	
	public static MultipleSelect newInstance(String otherColumns, Collection<?> entities) {
		return  MultipleFactory.makeSelect(otherColumns, entities);
	}
	public static MultipleSelect newInstance(String otherColumns, Object ...entities) {
		return  MultipleFactory.makeSelect(otherColumns, entities);
	}
	
	public Map<String, Object> getParameter() {
		return parameter;
	}
	public void setParameter(Map<String, Object> parameter) {
		this.parameter = parameter;
	}
	public void addParameter(Map<String, Object> parameter) {
		if (this.parameter == null) {
			this.parameter = new HashMap<>();
		}
		this.parameter.putAll(parameter);
	}
	public String getColumns() {
		return columns;
	}
	public void setColumns(String columns) {
		this.columns = columns;
	}
	public String getMasterTable() {
		return masterTable;
	}
	public void setMasterTable(String masterTable) {
		this.masterTable = masterTable;
	} 
	public List<String> getJoin() {
		return join;
	}
	public void setJoin(List<String> join) {
		this.join = join;
	}
	public MultipleSelect clearJoin() {
		this.join.clear();
		return this;
	}
	//TODO left : ${0}.companyId, right : ${3}.companyId
	public MultipleSelect addJoin(String left, String right) {
//		StringBuilder sb = new StringBuilder();   
//		String left$2 = MultipleFactory.getOtherColumnName(left, tes);
//		String right$2 = MultipleFactory.getOtherColumnName(right, tes);
//		 
//		System.out.println(left$2);
//		System.out.println(right$2);
		return this;
	}
	//get table,nick, column name by custom grammar ${0}.columnName
//	private void getTNCname(String batch) { 
//	}
	public String getSqlSegment() { 
		if (addCustomFlag) {
			addCustomFlag = false;
			this.setCustomWhere();
		}
		return sqlSegment.replaceAll("('.+--)|(--)|(\\|)|(%7C)", "");
	}
	public void setSqlSegment(String sqlSegment) {
		this.sqlSegment = sqlSegment;
	}
	private void setCustomWhere() {
		if (whereCustomSegments != null) {
			StringBuffer sb = new StringBuffer(sqlSegment);
			for (WhereCustomSegment i : whereCustomSegments) {
				if (parameter != null && i.getParameter() != null)
					addParameter(i.getParameter());
				for (String segment : i.getSegmentSql()) {
					sb.append(" ").append(segment);
				}
			} 
			for (TableEntity te : this.tes) {
				String logic = te.getLogicDelete();
				if (logic != null)
					sb.append(" AND ")
					  .append("(")
					  .append(te.getNickName())
					  .append(".")
					  .append(logic)
					  .append(" IS NULL")
					  .append(" OR ")
					  .append(te.getNickName())
					  .append(".")
					  .append(logic)
					  .append(" = ")
					  .append("0")
					  .append(")");
			}
			sqlSegment = sb.toString(); 
		}
	}
	private String parseColumns(String ...columns) {
		StringBuilder sb = new StringBuilder(); 
		for (String column : columns) {
			String[] t$2 = column.split(" ");
			String ob = MultipleFactory.getOtherColumnName(t$2[0], tes, null);
			if (ob != null) {
				sb.append(ob.split(" ")[0]);
				if (t$2.length == 2) {
					sb.append(" ").append(t$2[1]);
				}
				sb.append(",");
			}
		} 
		if (sb.length() != 0) {
			sb.deleteCharAt(sb.length() - 1);
		} 
		return sb.toString();
	}
	public String getOrderBy() {
		return orderBy;
	}
	public void setGroupBy(String ...columns) {
		this.groupBy = parseColumns(columns);
	}
	public String getGroupBy() {
		return this.groupBy;
	}
	//"${0}.orderBy asc", "${1}.cmss desc"
	public void setOrderBy(String ...columns) {
		this.orderBy = parseColumns(columns); 
	}
	public TableEntity[] getTes() {
		return tes;
	}
	public void setTes(TableEntity[] tes) {
		this.tes = tes;
	}
	public WhereCustomSegment where(String table) {
		String tableDeputyName = table.replaceAll("\\$\\{|}", "");
		TableEntity tableEntity = null;
		try {
			int tableIndex = Integer.parseInt(tableDeputyName);
			if (tableIndex < tes.length) 
				tableEntity = tes[tableIndex]; 
		} catch (Exception e) {  
			for (TableEntity te : tes) {
				String column = tableDeputyName.toLowerCase();
				if (column.equals(te.getNickName().toLowerCase()) || column.equals(te.getTableName().toLowerCase())) {
					tableEntity = te;
					break;
				}
			} 
		}
		if (tableEntity == null) {
			(new Exception("no table '" + table + "' be found,use default table : '0'")).printStackTrace();
			tableEntity = tes[0];
		}
		WhereCustomSegment whereCustomSegment = new WhereCustomSegment(tableEntity);
		if (whereCustomSegments == null) {
			whereCustomSegments = new ArrayList<>();
		}
		whereCustomSegments.add(whereCustomSegment);
		return whereCustomSegment; 
	}
	public Integer getStart() {
		return start;
	}
	public Integer getEnd() {
		return end;
	}
	public void setPage(Integer pageNo, Integer pageSize) {
		if (pageSize == null || pageSize <= 0 || pageNo == null || pageNo <= 0) {
			start = null; end = null;
		} else {
			start = (pageNo - 1) * pageSize;
			end = pageSize;
		}
	}  
//	public static void main(String[] args) {
//		MultipleSelect ms = MultipleSelect.newInstance("${plug}", new PlugSamePO(), new PlugPO());
//		String str = ms.getJoin().get(0);
//		ms.getJoin().set(0, "plug as plug on plug.plug_id = plugsame.last_plug_id");
//		System.out.println(ms.getJoin());
//	}
}
