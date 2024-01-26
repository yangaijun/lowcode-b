package com.yaj.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order; 
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import com.yaj.common.filter.AuthFilter;
import com.yaj.common.interceptor.WebIntercepter;

/**
 * web配置
 *
 * @date 2017-08-23 15:48
 */
@Configuration
public class WebConfig extends WebMvcConfigurerAdapter {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 多个拦截器组成一个拦截器链
        // addPathPatterns 用于添加拦截规则
        // excludePathPatterns 用户排除拦截
        registry.addInterceptor(new WebIntercepter()).addPathPatterns("/**");
        super.addInterceptors(registry);
    }

//    @Bean
//    @Order(1)
//    public CorsFilter corsFilter() {
//    	UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        CorsConfiguration corsConfiguration = new CorsConfiguration();
//        corsConfiguration.addAllowedOrigin("*"); // 1
//        corsConfiguration.addAllowedHeader("*"); // 2
//        corsConfiguration.addAllowedMethod("*"); // 3
//        source.registerCorsConfiguration("/**", corsConfiguration); // 4
//        return new CorsFilter(source);
//    }
    
    @Bean
    @Order(2)
//    @ConditionalOnProperty(prefix = RestProperties.REST_PREFIX, name = "auth-open", havingValue = "true", matchIfMissing = true)
    public AuthFilter jwtAuthenticationTokenFilter() {
        return new AuthFilter();
    }

}
