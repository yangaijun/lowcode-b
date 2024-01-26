package com.yaj.core.util.file;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.UUID;

import com.yaj.core.log.tools.LogHelper;

public class FileUtils {

	
	/**
	* @Title: saveFile
	* @Description: 保存文件
	* @param @param inStream
	* @param @param path
	* @param @param fileName
	* @param @return    参数
	* @return boolean    返回类型
	* @throws
	* @author Orange
	* @date 2017年8月1日
	*/
	public boolean saveFile(InputStream inStream, String path, String fileName) {
		boolean retFlag = false;
		try {
			byte[] data = readInputStream(inStream);
			// new一个文件对象用来保存图片，默认保存当前工程根目录
			File file = new File(mergePath(path , fileName));
			// 创建输出流
			FileOutputStream outStream = new FileOutputStream(file);
			// 写入数据
			outStream.write(data);
			// 关闭输出流
			outStream.close();
			retFlag = true;
		} catch (Exception e) {
			LogHelper.log(FileUtils.class,e);
		}
		
		return retFlag;
	}
	
	public String generateFileName() {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmm");
		String timeStr = sdf.format(new java.util.Date());
		return timeStr+"_"+UUID.randomUUID().toString();
	}
	public String generateFileName(FileType fileType) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmm");
		String timeStr = sdf.format(new java.util.Date());
		return timeStr+"_"+UUID.randomUUID().toString()+"."+fileType.getValue();
	}

	
	/**
	* @Title: readInputStream
	* @Description: 转化输入流
	* @param @param inStream
	* @param @return
	* @param @throws Exception    参数
	* @return byte[]    返回类型
	* @throws
	* @author Orange
	* @date 2017年8月1日
	*/
	private byte[] readInputStream(InputStream inStream) throws Exception {
		ByteArrayOutputStream outStream = new ByteArrayOutputStream();
		// 创建一个Buffer字符串
		byte[] buffer = new byte[1024];
		// 每次读取的字符串长度，如果为-1，代表全部读取完毕
		int len = 0;
		// 使用一个输入流从buffer里把数据读取出来
		while ((len = inStream.read(buffer)) != -1) {
			// 用输出流往buffer里写入数据，中间参数代表从哪个位置开始读，len代表读取的长度
			outStream.write(buffer, 0, len);
		}
		// 关闭输入流
		inStream.close();
		// 把outStream里的数据写入内存
		return outStream.toByteArray();
	}
	
	
	/**
	* @Title: mergePath
	* @Description: 合并地址字符串
	* @param @param path1
	* @param @param path2
	* @param @return    参数
	* @return String    返回类型
	* @throws
	* @author Orange
	* @date 2017年8月1日
	*/
	private String mergePath(String path1,String path2) {
		if(path1.lastIndexOf('/')!=(path1.length()-1)) {
			path1 = path1+"/";
		}
		return path1.concat(path2);
	} 
}
