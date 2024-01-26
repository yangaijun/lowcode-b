package com.yaj.common.startup;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.yaj.core.log.tools.LogHelper;


@Component
@Order(value=1)
public class StartupRunner implements CommandLineRunner{
	
	@Autowired
	private Environment env;
	
	@Override
    public void run(String... args) throws Exception {
        LogHelper.log(StartupRunner.class,"服务启动执行，执行加载数据等操作,Begin...");

        LogHelper.log(StartupRunner.class,"port:" + env.getProperty("server.port"));

		LogHelper.log(StartupRunner.class,"服务启动执行，执行加载数据等操作,End.");
    }

}
