package com.yaj.common.multipleselect.service;

import javax.annotation.Resource;
import org.springframework.stereotype.Service;

import com.yaj.common.multipleselect.MultipleResult;
import com.yaj.common.multipleselect.MultipleSelect;
import com.yaj.common.multipleselect.Page;
import com.yaj.common.multipleselect.mapper.MultipleMapper;
 
 
@Service
public class MultipleService {
	@Resource
	private MultipleMapper mapper;

    public MultipleResult multipleSelect(MultipleSelect param) {
    	MultipleResult result = new MultipleResult(); 
    	result.setData(mapper.mulSelect(param));
    	
    	if (param.getStart() != null && param.getEnd() != null) {
    		Integer total = mapper.countMulSelect(param);
    		Page page = new Page();
    		page.setPageNo(param.getStart() / param.getEnd() + 1);
    		page.setPageSize(param.getEnd());
    		page.setTotal(total);
    		result.setPage(page);
    	}
    	return result;
    }
}
