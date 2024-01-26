package com.yaj.core.util;

import com.yaj.freedomen.business.user.entity.po.UserPO;

import java.util.Date;

import com.auth0.jwt.JWT; 
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.DecodedJWT;

public class TokenUtil { 
	private final static String secret = "xldmEm40zaUm40aNsd04poah1me";
	//token 过期时间6小时
    private final static long expireTime = 6 * 60 * 60 * 1000;
    
	public static Integer getUserId(String token) {  
		if (token == null)
			return null;
		
		try {
            DecodedJWT jwt = JWT.decode(token); 
            return jwt.getClaim("userId").asInt();
        } catch (JWTDecodeException e) {
            return null;
        } 
	}
	
	public static boolean isValid(String token) {
		if (token == null)
			return false;
		
		try {
			DecodedJWT jwt = JWT.decode(token);  
			Date expiresAt = jwt.getExpiresAt();
			Date current = new Date(); 
			
            return current.before(expiresAt);  
        } catch (JWTDecodeException e) {
            return false;
        } 
	}

	public static String createToken(UserPO user) {
        Date date = new Date(System.currentTimeMillis() + expireTime);
        Algorithm algorithm = Algorithm.HMAC256(secret);
     
        return JWT.create()
            .withClaim("userId", user.getUserId())
            .withExpiresAt(date)
            .sign(algorithm);
    }
	
}
