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
public class ControllerAspect extends BaseLogAspect {
	private long startTimeMillis = 0; // 开始时间
	private long endTimeMillis = 0; // 结束时间
	
	@Pointcut("execution( * com.yaj.freedomen.business.*.controller.*.*(..))")
	public void pointCutAt() {}

	@Before("pointCutAt()")
	public void beforeAction(JoinPoint joinPoint) {
		startTimeMillis = System.currentTimeMillis(); // 记录方法开始执行的时间

		StringBuffer info = new StringBuffer(formatInfo(joinPoint));
		info.append("  -  Controller-Begin...");
		printLog(info.toString());
		printLog("[controller].[in] <== " + Arrays.toString(joinPoint.getArgs()));
		printLog("[controller].[in] <== " + AopBeanPropertitisUtil.convertToString(joinPoint.getArgs()));

	}
	
	@Around("pointCutAt()")
	public Object around(ProceedingJoinPoint point) throws Throwable {
		Object retVal=null;
		try {
			retVal = point.proceed();
		} catch(Exception e) {
			
			ThreadlocalContext threadlocalContext = ThreadlocalManager.getThreadContext();
			
			if(threadlocalContext!=null && threadlocalContext.getBusinessExceptionHashCode()!=e.hashCode()){
				 
				String classname=point.getTarget().getClass().getName();
				
				String controllerName=classname.substring(classname.lastIndexOf('.') + 1);
				String methodName=point.getSignature().getName();
				
				LogHelper.log(getLogDesc()+" - [Controller Exception] " + controllerName + "."+methodName + " ",e);
			}
			
			throw e;
		}
		return retVal;
   }

	@AfterReturning(returning = "ret", pointcut = "pointCutAt()")
	public void doAfterReturning(JoinPoint joinPoint,Object ret) throws Throwable {
		 endTimeMillis = System.currentTimeMillis(); // 记录方法执行完成的时间
		 StringBuffer info= new StringBuffer(formatInfo(joinPoint));
		 info.append(" - Controller-End.(Cost:"+(endTimeMillis-startTimeMillis)+"ms)");
		 printLog("[controller].[out] ==> " + Arrays.toString(joinPoint.getArgs()));
		 printLog("[controller].[out] ==> " + AopBeanPropertitisUtil.convertToString(ret));
		 printLog(info.toString());
	}

	private String formatInfo(JoinPoint joinPoint) {
		String classname = joinPoint.getTarget().getClass().getName();
		return "execute controller - [" + classname.substring(classname.lastIndexOf('.') + 1) + "].[" + joinPoint.getSignature().getName() + "]";
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
