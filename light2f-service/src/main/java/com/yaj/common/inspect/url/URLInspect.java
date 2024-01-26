package com.yaj.common.inspect.url;

public class URLInspect {
	public static boolean check(String urlPath,URLInspectTypeEnum... types) {
		for(int i=0;i<types.length;i++){
			//swagger
			if(types[i].getType() == URLInspectTypeEnum.SWAGGER.getType()){
				if(urlPath.contains("swagger")||
						urlPath.equals("/v2/api-docs")||
						urlPath.equals("/configuration/security")||
						urlPath.equals("/configuration/ui")){
					return true;
				}
			}
			//静态文件
			if(types[i].getType() == URLInspectTypeEnum.STATIC_FILE.getType()){
				if(urlPath.toLowerCase().contains(".css")||
						urlPath.toLowerCase().contains(".js")||
						urlPath.toLowerCase().contains(".ico")){
					return true;
				}
			}
			//默认不需授权
			if(types[i].getType() == URLInspectTypeEnum.DAFAULT_NO_AUTH.getType()){
				if(urlPath.toLowerCase().equals("/")||
						urlPath.toLowerCase().equals("/health")||
						urlPath.toLowerCase().equals("/500")||
						urlPath.toLowerCase().equals("/404")){
					return true;
				}
			}

		}
		return false;
	} 
}

