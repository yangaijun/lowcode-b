package com.yaj.common.multipleselect;

import java.util.List;
import java.util.Map;

public class MultipleResult {
	private List<Map<String, Object>> data;
	private Page page; 
	
	public List<Map<String, Object>> getData() {
		return data;
	}
	public void setData(List<Map<String, Object>> data) {
		this.data = data;
	}
	public Page getPage() {
		return page;
	}
	public void setPage(Page page) {
		this.page = page;
	}
	public void setPage(Integer total, Integer pageNo, Integer pageSize) {
		if (this.page == null) {
			this.page = new Page();
		}
		
		if (total != null) {
			this.page.setTotal(total);
		}
		if (pageNo != null) {
			this.page.setPageNo(pageNo);
		}
		if (pageSize != null) {
			this.page.setPageSize(pageSize);
		}
	} 
}
