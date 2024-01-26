package com.yaj.common.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.yaj.common.response.ResponseData;
import com.yaj.core.exception.BaseGlobalExceptionHandler;
import com.yaj.core.log.tools.LogHelper;

import javax.servlet.http.HttpServletResponse;

@ControllerAdvice
public class GlobalExceptionHandler extends BaseGlobalExceptionHandler {
    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody //在返回自定义相应类的情况下必须有，这是@ControllerAdvice注解的规定
    public ResponseData<Object> exceptionHandler(BusinessException e, HttpServletResponse response) {
        ResponseData<Object> rd;
        
        try {
            rd = new ResponseData<>();
        } catch (BusinessException e1) {
            return new ResponseData<>(e.getErrorCode(), e.getErrorMessage());
        }
        
        rd.setCode(e.getErrorCode());
        rd.setMessage(e.getErrorMessage()); 
        
        LogHelper.log(GlobalExceptionHandler.class, e);
        
        return rd;
    }

}
