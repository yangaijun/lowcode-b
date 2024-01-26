package com.yaj.common.generate;

import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import com.yaj.common.generate.base.GenerateFileUtil; 
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/generate")
@ConditionalOnProperty(prefix = "base", name = "generate", havingValue = "true")
public class GenerateController {
	@Autowired
	private GenerateService generateService;
	
	@Value("${spring.datasource.url}")
	private String databaseUrl;

	@ApiOperation(value = "代码生成器", notes = "代码生成器")
	@RequestMapping(value = "/index")
	public ModelAndView index(String schema, String[] table,String moduleName,String target) throws IOException {

	    String moduleBasePath = GenerateFileUtil.mergePath(System.getProperty("user.dir"),"src","main","java","com","yaj");

		if(schema == null) {
			schema = databaseUrl.substring(databaseUrl.lastIndexOf("/")+1,databaseUrl.indexOf("?"));
		}
		if(table != null) {
			 generateService.processGeneretion(schema,moduleName,moduleBasePath,table);
		}
		
		Map<String, String[]> map = new HashMap<>();
//		String url = PropertiesListenerConfig.getProperty("spring.datasource.url");
		List<String> list = generateService.getAllTableNames(schema);
		String[] tableNames = (String[]) list.toArray(new String[list.size()]);
		map.put("tableNames", tableNames);
		return new ModelAndView("/generate/index.html", map);
	}
}
