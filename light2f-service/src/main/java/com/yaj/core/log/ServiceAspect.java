package com.yaj.core.log;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import com.yaj.common.threadlocal.ThreadlocalContext;
import com.yaj.common.threadlocal.ThreadlocalManager;
import com.yaj.core.log.base.AopBeanPropertitisUtil;
import com.yaj.core.log.base.BaseLogAspect;
import com.yaj.core.log.tools.LogHelper;

import java.util.Arrays;

/**
 * @author ...
 * @Description: 日志记录AOP实现
 */
@Aspect
@Component
public class ServiceAspect extends BaseLogAspect{  

	@Pointcut("execution( * com.yaj.freedomen.business.*.service.*.*(..))")
	public void pointCutAt() {

	}

	@Before("pointCutAt()")
	public void beforeAction(JoinPoint joinPoint) {  

		LogHelper.log("");
		
		StringBuffer info = new StringBuffer(formatInfo(joinPoint));
		info.append("  -  Service-Begin...");
		printLog(info.toString());
		printLog("[service].[in] <== " + Arrays.toString(joinPoint.getArgs()));
		printLog("[service].[in] <== " + AopBeanPropertitisUtil.convertToString(joinPoint.getArgs())); 
	}
	
	@Around("pointCutAt()")
	 public Object around(ProceedingJoinPoint point) throws Throwable {
		long startTimeMillis = System.currentTimeMillis(); // 记录方法开始执行的时间
		Object retVal=null;
		try {
			retVal=point.proceed();
		} catch(Exception e) {
			String classname=point.getTarget().getClass().getName();
			
			String serviceName=classname.substring(classname.lastIndexOf('.')+1);
			String methodName=point.getSignature().getName();
			
			LogHelper.log(getLogDesc()+" - [Service Exception] "+serviceName+"."+methodName+" ",e);
			
			ThreadlocalContext threadlocalContext = ThreadlocalManager.getThreadContext();
			if(threadlocalContext == null){
				threadlocalContext = new ThreadlocalContext();
			}
			threadlocalContext.setBusinessExceptionHashCode(e.hashCode());
			ThreadlocalManager.setThreadContext(threadlocalContext); 
			printLog(" - Service-End.(Cost:" + (System.currentTimeMillis() - startTimeMillis) + "ms)"); 
			throw e;
		}
		return retVal;
   }

	@AfterReturning(returning = "ret", pointcut = "pointCutAt()")
	public void doAfterReturning(JoinPoint joinPoint,Object ret) throws Throwable { 
		 StringBuffer info= new StringBuffer(formatInfo(joinPoint)); 
		 printLog("[service].[out] ==> "+Arrays.toString(joinPoint.getArgs()));
		 printLog("[service].[out] ==> "+AopBeanPropertitisUtil.convertToString(ret));
		 printLog(info.toString()); 
	}

	private String formatInfo(JoinPoint joinPoint) {
		String classname = joinPoint.getTarget().getClass().getName();
		return "execute service - [" + classname.substring(classname.lastIndexOf('.') + 1) + "].[" + joinPoint.getSignature().getName() + "]";
	} 
	/**
	 * 写入日志
	 * 
	 * @param log
	 */
	private void printLog(String log) {
		LogHelper.log(getLogDesc(), log);
	}

}
