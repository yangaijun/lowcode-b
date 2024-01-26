package com.yaj.freedomen.business.user.controller;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import com.yaj.freedomen.business.page.service.PageService;
import lombok.Data;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.yaj.common.cache.RedisKeys;
import com.yaj.common.cache.RedisManager;
import com.yaj.common.cache.RedisTimes;
import com.yaj.common.cos.CosUtil;
import com.yaj.common.email.EmailUtil;
import com.yaj.common.exception.BusinessException;
import com.yaj.common.exception.BusinessExceptionErrorEnum;
import com.yaj.common.threadlocal.ThreadlocalManager;
import com.yaj.core.util.BeanUtil;
import com.yaj.core.util.PasswordUtil;
import com.yaj.core.util.TokenUtil;
import com.yaj.freedomen.business.project.service.ProjectService;
import com.yaj.freedomen.business.user.entity.params.RegisterParam;
import com.yaj.freedomen.business.user.entity.params.SendEmailParam;
import com.yaj.freedomen.business.user.entity.po.UserPO;
import com.yaj.freedomen.business.user.service.UserService;
import com.yaj.freedomen.config.SystemData;
 
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@Api(value="user")
@EnableAutoConfiguration
@RestController
@RequestMapping(value="/User")
public class UserController {
	@Resource
	private UserService userService;
	@Resource
	private ProjectService projectService;

	@Resource
	private PageService pageService;

	@Resource
    private EmailUtil emailUtil;
	
	@Resource
	private RedisManager redisManager;
	@Data
	static class CountVO {
		private Integer userCount;
		private Integer projectCount;
		private Integer pageCount;
		private Integer downCount;
	}

	@ApiOperation(value="统计", notes="统计")
	@RequestMapping(value="/count", method=RequestMethod.POST)
	public Object count() {
		 Integer userCount = userService.selectCount(new EntityWrapper<>());
		 Integer projectCount = projectService.selectCount(new EntityWrapper<>());
		 Integer pageCount = pageService.selectCount(new EntityWrapper<>());


		 EntityWrapper<UserPO> wrapper = new EntityWrapper<>();
		 wrapper.setSqlSelect("sum(download_count) as downCount");

		BigDecimal downCount = (BigDecimal)userService.selectMaps(wrapper).get(0).get("downCount");

		 CountVO countVO = new CountVO();
		 countVO.setUserCount(userCount);
		 countVO.setProjectCount(projectCount);
		 countVO.setPageCount(pageCount);
		 countVO.setDownCount(downCount.intValue());

		 return countVO;

	}
	/**
	 *添加 
	 * @throws IOException 
	 **/
	@ApiOperation(value="添加",notes="添加")
	@RequestMapping(value="/upload", method=RequestMethod.POST)
    public Object upload(
    		@RequestParam("file") MultipartFile[] files) throws IOException {
		Integer userId = ThreadlocalManager.getThreadContext().getUserId();
		if (userId == null || userId.equals(SystemData.guestUserId)) {
			throw new BusinessException(BusinessExceptionErrorEnum.UPLOAD_NO_LOGIN_ERROR);
		}

		String[] keys = CosUtil.uploadFile(files);
		
        if (keys.length > 0) {
        	return keys[0];
        } else {
        	return null;
        }
    }
	/**
	 * 上传组件
	 * @param files
	 * @return
	 * @throws IOException
	 */
	@ApiOperation(value="添加",notes="添加")
	@RequestMapping(value="/uploadComponent", method=RequestMethod.POST)
    public Object uploadComponent(
    		@RequestParam("files") MultipartFile[] files, @RequestParam("homePath") String homePath/*暂时不用*/) throws IOException { 
		
		String key = CosUtil.uploadComponent(files);
		
    	return key;
    }
	/**
	 *添加 
	 * @throws IOException 
	 **/
	@ApiOperation(value="添加",notes="添加")
	@RequestMapping(value="/uploads", method=RequestMethod.POST)
    public Object uploads(
    		@RequestParam("file") MultipartFile[] files) throws IOException {
        return CosUtil.uploadFile(files);
    }

    /**
	 *修改
	 **/
	@ApiOperation(value="修改",notes="修改")
	@RequestMapping(value="/update", method=RequestMethod.POST)
    public Object updateUser(@RequestBody UserPO user) {
		if (user.getUserId() != null && !user.getUserId().equals(ThreadlocalManager.getThreadContext().getUserId())) {
			throw new BusinessException(BusinessExceptionErrorEnum.NO_ACCESS_AUTH);
		}

        userService.updateById(user);
        return user;
    } 
	/**
	 * info
	 */
	@ApiOperation(value="个人信息",notes="个人信息")
	@RequestMapping(value="/info", method=RequestMethod.POST)
    public Object updateInfo() {
        return userService.selectById(ThreadlocalManager.getThreadContext().getUserId());
    } 
    /**
	 *查找
	 **/
	@ApiOperation(value="查找",notes="查找")
	@RequestMapping(value="/select", method = RequestMethod.POST)
    public Object retrieveUser(@RequestBody UserPO user) {
        return userService.selectList(new EntityWrapper<>(user));
    }
	/**
	 *删除
	 **/
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
	@ApiOperation(value="删除", notes="删除")
	@RequestMapping(value="/delete", method=RequestMethod.POST)
    public Object deleteUser(@RequestBody List<UserPO> userList) {
        return null;
    } 
	
	private Map<String, Object> getLoginInfo(UserPO user) {
		 Map<String, Object> result = new HashMap<>();
	        result.put("user", user);
	        
	     String token = TokenUtil.createToken(user);
	     result.put("token", token);
	     
	     redisManager.set(RedisKeys.getUserTokenKey(user.getUserId()), token);
	     
	     return result;
	}
	/**
	 *登录
	 **/
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
	@ApiOperation(value="登录", notes="登录")
	@RequestMapping(value="/login", method=RequestMethod.POST)
    public Object login(@RequestBody UserPO user) { 
        String saltPassword = PasswordUtil.encodePassword(user.getUserPassword(), user.getUserEmail());
        user.setUserPassword(saltPassword);
        user = userService.selectOne(new EntityWrapper<>(user));
        if (user == null) {
        	throw new BusinessException(BusinessExceptionErrorEnum.USER_LOGIN_ERROR);
        }
 
        return getLoginInfo(user);
    }  
	/**
	 *获取临时token
	 **/
	@ApiOperation(value="获取临时token", notes="获取临时token")
	@RequestMapping(value="/guestToken", method=RequestMethod.POST)
    public Object guestToken() { 
		UserPO user = new UserPO(); 
			user.setUserId(SystemData.guestUserId);
			
        return TokenUtil.createToken(user);
    }
	/**
	 *获取临时token
	 **/ 
	@ApiOperation(value="refreshToken", notes="refreshToken")
	@RequestMapping(value="/refreshToken", method=RequestMethod.POST)
    public Object freshToken(HttpServletRequest request) { 
		String token = request.getHeader("token");
		
		Integer userId = TokenUtil.getUserId(token);
		String cacheToken = redisManager.get(RedisKeys.getUserTokenKey(userId));
		 
		if (cacheToken == null || !cacheToken.equals(token)) {
			throw new BusinessException(BusinessExceptionErrorEnum.TOKEN_PARSE_ERROR);
		}
		
		UserPO user = new UserPO();
		user.setUserId(userId);
		
		return getLoginInfo(user);
    } 
	 
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
	@ApiOperation(value="email", notes="email")
	@RequestMapping(value="/email", method=RequestMethod.POST)
    public Object sendEmail(@RequestBody SendEmailParam param) {  
        if (param.getUserEmail() == null) return -1;
        
        UserPO user = new UserPO();
        user.setUserEmail(param.getUserEmail()); 
        List<?> users = userService.selectList(new EntityWrapper<UserPO>(user));

        if (param.getSendType() == null) { 
        	if (!users.isEmpty()) {
            	throw new BusinessException(BusinessExceptionErrorEnum.EMAIL_EXIST);
            }
	        
	        String code = userService.getCode(4);  
	        emailUtil.sendMessage(user.getUserEmail(), "验证码 ", "您好，您的验证码是：" +  code);
	        redisManager.set(RedisKeys.getEmailKey(user.getUserEmail()), code, RedisTimes.fiveMinute);
        } else if (param.getSendType().equals("forget")) {
        	
        	if (users.isEmpty()) {
        		throw new BusinessException(BusinessExceptionErrorEnum.EMAIL_NOT_EXIST);
        	}
        	
        	String code = userService.getCode(6); 
        	emailUtil.sendMessage(user.getUserEmail(), "忘记密码", "您好，您忘记密码时的验证码是：" +  code);
        	redisManager.set(RedisKeys.getEmailForgetKey(user.getUserEmail()), code, RedisTimes.fiveMinute);
        }
        
        return 1;
    } 
	/**
	 *注冊
	 **/
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
	@ApiOperation(value="注册", notes="注册")
	@RequestMapping(value="/register", method=RequestMethod.POST)
    public Object register(@RequestBody RegisterParam param) { 
		if (param.getUserEmail() == null || param.getUserPassword() == null || param.getCode() == null)
			return -1;
		
		String code = redisManager.get(RedisKeys.getEmailKey(param.getUserEmail()));
		
		if (code != null && param.getCode().equals(code)) { 
			UserPO user = new UserPO();
			BeanUtil.copy(param, user);
			
			String saltPassword = PasswordUtil.encodePassword(user.getUserPassword(), user.getUserEmail());
		        user.setUserPassword(saltPassword);
		        user.setUserName(param.getUserEmail());
		        userService.insert(user);

		        
		        return getLoginInfo(user);
		} else {
			throw new BusinessException(BusinessExceptionErrorEnum.CODE_ERROR);
		} 
    }   
	/**
	 *注冊
	 **/
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
	@ApiOperation(value="忘记密码", notes="忘记密码")
	@RequestMapping(value="/forget", method=RequestMethod.POST)
    public Object forget(@RequestBody RegisterParam param) { 
		if (param.getUserEmail() == null || param.getUserPassword() == null || param.getCode() == null)
			return -1;
		
		String code = redisManager.get(RedisKeys.getEmailForgetKey(param.getUserEmail()));
		
		if (code != null && param.getCode().equals(code)) { 
			UserPO user = new UserPO();
			user.setUserEmail(param.getUserEmail());
			
			user = userService.selectOne(new EntityWrapper<UserPO>(user));
			
			String saltPassword = PasswordUtil.encodePassword(param.getUserPassword(), user.getUserEmail());
		        user.setUserPassword(saltPassword); 
		        userService.updateById(user); 
		        
		        return getLoginInfo(user);
		} else {
			throw new BusinessException(BusinessExceptionErrorEnum.CODE_ERROR);
		} 
    }  
}
