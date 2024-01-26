package com.yaj.common.multipleselect.mapper;
 
import java.util.List;
import java.util.Map;

import com.yaj.common.multipleselect.MultipleSelect;
 
public interface MultipleMapper {
    public List<Map<String, Object>> mulSelect(MultipleSelect param);
    public Integer countMulSelect(MultipleSelect param);
}
