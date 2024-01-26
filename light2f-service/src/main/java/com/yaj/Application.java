package com.yaj;

import org.springframework.beans.factory.config.YamlPropertiesFactoryBean;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.SpringBootVersion;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer; 
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.core.SpringVersion;
import org.springframework.core.io.ClassPathResource;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController; 

import com.yaj.common.exception.BusinessException;
import com.yaj.common.exception.BusinessExceptionErrorEnum; 
import com.yaj.core.log.tools.LogHelper;

import java.io.IOException;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;

@SpringBootApplication
@RestController
@EnableTransactionManagement
@EnableAspectJAutoProxy
public class Application extends SpringBootServletInitializer {

//    public static void main(String[] args) {
//        String springVersion = SpringVersion.getVersion();
//        String springBootVersion = SpringBootVersion.getVersion();
//        System.out.println("Spring版本:"+springVersion+"\nSpringBoot版本:"+springBootVersion);
//    }
    public static void main(String[] args) throws IOException {
        SpringApplication application = new SpringApplication(Application.class);
        YamlPropertiesFactoryBean ypfb = new YamlPropertiesFactoryBean();
        String choosePorperties = System.getenv("OS");
        if (choosePorperties != null && choosePorperties.startsWith("Windows")) {
            ypfb.setResources(new ClassPathResource("application-local.yml"));
            ypfb.afterPropertiesSet();
            LogHelper.log(Application.class,"开发环境：加载到application-local.yml成功！");
        } else {
            ypfb.setResources(new ClassPathResource("application-prod.yml"));
            ypfb.afterPropertiesSet();
        }

        Properties p = ypfb.getObject();
        application.setDefaultProperties(p);
        application.run(args);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        YamlPropertiesFactoryBean ypfb = new YamlPropertiesFactoryBean();
        
        try {
            ypfb.setResources(new ClassPathResource("application-prod.yml"));
            ypfb.afterPropertiesSet();
        }catch(Exception e){
            LogHelper.log(Application.class,"生产环境:未加载到application-prod.yml文件！");
            throw e;
        } 
        Properties p = ypfb.getObject();
        application.properties(p);
        return application.sources(Application.class);
    }

    @RequestMapping("/")
    public String home() {
        return "Welcome!!!";
    }
    
    @RequestMapping("/404")
    public String error404() {
        return "404";
    }
    
    @RequestMapping("/500")
    public void handlerFilterError(HttpServletRequest request) { 
        throw new BusinessException(BusinessExceptionErrorEnum.TOKEN_EXPIRED);
    }
}









