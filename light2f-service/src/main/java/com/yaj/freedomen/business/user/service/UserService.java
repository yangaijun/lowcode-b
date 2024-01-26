package com.yaj.freedomen.business.user.service;

import org.springframework.stereotype.Service;
import javax.annotation.Resource;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;

import com.yaj.freedomen.business.user.entity.po.UserPO;
import com.yaj.freedomen.business.user.mapper.UserMapper;

/*
 * @Description: 
 * @date: 2021-04-15
 */
@Service
public class UserService extends ServiceImpl<UserMapper, UserPO> {

    @Resource
    UserMapper userMapper;
    
    private static final String seeds = "0123456789";
    
    public String getCode(int len) {
    	StringBuffer sb = new StringBuffer();
    	for (int i = 0; i < len; i ++) {
    		int index = (int)(Math.random() * seeds.length());
    		sb.append(seeds.charAt(index));
    	}
    	return sb.toString(); 
    } 
}
