package com.yaj.common.response;


import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import com.yaj.common.inspect.transferobject.TransferObjectInspect;
import com.yaj.core.exception.BaseExceptionErrorEnum;

import java.util.Map;

/**
 * 用于预处理httpMessageConverter
 */
@ControllerAdvice //作用于controller中使用了注解@RequestMapping的方法
public class DataResponseBodyAdvice implements ResponseBodyAdvice {
    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        //过滤swagger
        if(returnType.getMethod().toString().contains("swagger")){
            return false;
        }
        return true;
    } 
    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType, Class selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
    	if(((ServletServerHttpRequest) request).getServletRequest().getServletPath().toString().equals("/error")){
            if(((Map)body).get("message") != null) {
                return new ResponseData<>(BaseExceptionErrorEnum.SYSTEM_ERROR.getCode(), ((Map)body).get("message").toString());
            } else {
                return new ResponseData<>(BaseExceptionErrorEnum.SYSTEM_ERROR.getCode(), BaseExceptionErrorEnum.SYSTEM_ERROR.getMessage());
            }
        }

        if (returnType.hasMethodAnnotation(ExceptionHandler.class)) { //处理异常，可以再添加一个异常处理的类，用于处理异常返回格式
            return body;
        } else {
            if(TransferObjectInspect.check(body)){
            	if(ResponseData.class.isInstance(body)){
                    return body;
                }
                return new ResponseData<>(body);
            } else {
                return body;
            }
        }
    }
}
