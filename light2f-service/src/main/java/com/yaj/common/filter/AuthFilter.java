package com.yaj.common.filter;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.PathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import com.yaj.common.cache.RedisKeys;
import com.yaj.common.cache.RedisManager;
import com.yaj.common.cache.RedisTimes;
import com.yaj.common.config.properties.BaseProperties;
import com.yaj.common.exception.BusinessException;
import com.yaj.common.exception.BusinessExceptionErrorEnum;
import com.yaj.common.inspect.url.URLInspect;
import com.yaj.common.inspect.url.URLInspectTypeEnum;
import com.yaj.common.threadlocal.ThreadlocalContext;
import com.yaj.common.threadlocal.ThreadlocalManager;
import com.yaj.core.util.TokenUtil;
import com.yaj.freedomen.config.SystemData;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

public class AuthFilter extends OncePerRequestFilter { 
	
    @Autowired
    private BaseProperties baseProperties;
    
    @Autowired
    private RedisManager redisManager;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        String urlPath = request.getServletPath(); 
        //swager过滤&静态文件过滤
        if(URLInspect.check(urlPath, URLInspectTypeEnum.SWAGGER, URLInspectTypeEnum.STATIC_FILE, URLInspectTypeEnum.DAFAULT_NO_AUTH)){
            chain.doFilter(request, response);
            return;
        }
        //非授权请求过滤
        PathMatcher matcher = new AntPathMatcher();
        List<String> noAuthPathList = baseProperties.getNoAuthPath();
        for(int i = 0; i<noAuthPathList.size(); i++){
            if(matcher.match(noAuthPathList.get(i), urlPath)){
                chain.doFilter(request, response);
                return;
            }
        } 
        //需授权请求 
        String authToken = request.getHeader("token"); 
        Integer userId = TokenUtil.getUserId(authToken); 
        
        if (!TokenUtil.isValid(authToken)) {
            throw new BusinessException(BusinessExceptionErrorEnum.TOKEN_EXPIRED);
        }

        if (userId == null) {
            throw new BusinessException(BusinessExceptionErrorEnum.TOKEN_PARSE_ERROR);
        } else if (!userId.equals(SystemData.guestUserId)) {
            String cacheToken = redisManager.get(RedisKeys.getUserTokenKey(userId));

            if (cacheToken == null || !cacheToken.equals(authToken)) {
                throw new BusinessException(BusinessExceptionErrorEnum.TOKEN_PARSE_ERROR);
            }

            redisManager.set(RedisKeys.getOnlineHalfHourUserKey(userId), userId, RedisTimes.halfHour);
            redisManager.set(RedisKeys.getOnlineTodayUserKey(userId), userId, RedisTimes.today);

            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            redisManager.set(RedisKeys.getLastLoginDateUserKey(userId), format.format(Calendar.getInstance().getTime()), RedisTimes.twoWeek);
        }

        ThreadlocalContext threadlocalContext = new ThreadlocalContext(); 
            threadlocalContext.setUserId(userId);
        
        ThreadlocalManager.setThreadContext(threadlocalContext);
         
        chain.doFilter(request, response);
    }
}