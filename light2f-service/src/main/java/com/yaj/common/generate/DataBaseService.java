package com.yaj.common.generate;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
 
import com.mysql.jdbc.jdbc2.optional.MysqlDataSource;
import com.yaj.common.generate.base.DataBaseInfo; 

@Service
public class DataBaseService {
	private String getSelectTableSql (String tableSchema) {
		StringBuffer sb = new StringBuffer("SELECT table_name as tableName FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = '");
		sb.append(tableSchema).append("'");
		return sb.toString();
	}
	
	private String getSelectTableInfoSql (String tableSchema, String tableName) {
		StringBuffer sb = new StringBuffer("SELECT DISTINCT c.TABLE_NAME as tableName,COLUMN_NAME as columnName,ORDINAL_POSITION as ordinalPosition");
		
		sb.append(", ")
			.append("IS_NULLABLE as nullAble,DATA_TYPE as dataType,COLUMN_KEY as columnKey,COLUMN_COMMENT as columnComment, ")
			.append("TABLE_COMMENT AS tableComment ")
			.append("from information_schema.COLUMNS c ")
			.append("left join INFORMATION_SCHEMA.TABLES t ")
			.append("on c.TABLE_NAME=t.TABLE_NAME and c.TABLE_SCHEMA=t.TABLE_SCHEMA ")
			.append("where c.TABLE_NAME='").append(tableName).append("' ")
			.append("and c.table_schema='").append(tableSchema).append("'");
		
		return sb.toString();
		
	}
	
	private JdbcTemplate getJdbcTemplate(DataBaseInfo info) {
		MysqlDataSource dataSource = new MysqlDataSource(); 
		dataSource.setURL(info.getUrl());
		dataSource.setUser(info.getUsername());
		dataSource.setPassword(info.getPassword());
		JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
		return jdbcTemplate;
	}
	
	public List<String> getTableNames (DataBaseInfo info) {
		JdbcTemplate jdbcTemplate = this.getJdbcTemplate(info);
		String executeSql = getSelectTableSql(info.getTableSchema());
		return jdbcTemplate.query(executeSql, new RowMapper<String>() {
			@Override
			public String mapRow(ResultSet resultSet, int rowNum) throws SQLException {
				return resultSet.getString(1);
			}
		}); 
	} 

	public List<List<TableInfo>> getTablesInfo(DataBaseInfo info, List<String> tableNames) {
		JdbcTemplate jdbcTemplate = this.getJdbcTemplate(info);  
		List<List<TableInfo>> allInfos = new ArrayList<>();
		
		for (String tableName : tableNames) {
			String excuteSql = getSelectTableInfoSql(info.getTableSchema(), tableName);
			List<TableInfo> infos = jdbcTemplate.query(excuteSql, new RowMapper<TableInfo>() {
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
			allInfos.add(infos);
		}
		
		return allInfos;
	}
	//测试数据库联通性
	public boolean testConnection(DataBaseInfo info){
		try {
			this.getJdbcTemplate(info).getDataSource().getConnection();
			return true;
		} catch (SQLException e) {
			return false;
		}
	}
}
