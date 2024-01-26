package com.yaj.freedomen.business.plug.entity.vo;

public class SearchEntity {
	private Integer pageNo;
	private Integer pageSize;
	private Integer total;
	private String keyword;
	private Integer plugType;
	//all || null : 全部，use：已使用, self: 我的，fav： 收藏，star： 喜欢
	private String type;
	
	public Integer getPageNo() {
		return pageNo;
	}
	public void setPageNo(Integer pageNo) {
		this.pageNo = pageNo;
	}
	public Integer getPageSize() {
		return pageSize;
	}
	
	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}
	public Integer getTotal() {
		return total;
	}
	public void setTotal(Integer total) {
		this.total = total;
	}
	public String getKeyword() {
		return keyword;
	}
	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}
	public Integer getPlugType() {
		return plugType;
	}
	public void setPlugType(Integer plugType) {
		this.plugType = plugType;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	 

}
