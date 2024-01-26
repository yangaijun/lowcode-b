package com.yaj.common.cos;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.qcloud.cos.COSClient;
import com.qcloud.cos.ClientConfig;
import com.qcloud.cos.auth.BasicCOSCredentials;
import com.qcloud.cos.auth.COSCredentials;
import com.qcloud.cos.exception.CosClientException;
import com.qcloud.cos.exception.CosServiceException;
import com.qcloud.cos.http.HttpProtocol;
import com.qcloud.cos.model.COSObjectSummary; 
import com.qcloud.cos.model.ListObjectsRequest;
import com.qcloud.cos.model.ObjectListing;
import com.qcloud.cos.model.ObjectMetadata;
import com.qcloud.cos.model.PutObjectRequest;
import com.qcloud.cos.region.Region; 
import com.qcloud.cos.transfer.TransferManager;
import com.qcloud.cos.transfer.TransferManagerConfiguration;
import com.yaj.core.log.tools.LogHelper;

@Component
public class CosUtil {
	private static String secretId = "11111111111111111111";
	private static String secretKey = "11111111111111111111111";
	
	private static String defaultBucketName = "flight-uimgs-1256372626"; 
	private static String defaultRegionName = "ap-nanjing";
	
	private static String componentBucketName = "flight-rcomponent-1256372626"; 
	private static String componentRegionName = "ap-shanghai";

	@Autowired
	private Environment env;
	
	private static String envName;
	
	@PostConstruct
	public void config() {
		envName = env.getProperty("base.env"); 
	}
	
	private static COSClient createCOSClient(String regionName) {
		COSCredentials cred = new BasicCOSCredentials(secretId, secretKey); 
		Region region = new Region(regionName);
		ClientConfig clientConfig = new ClientConfig(region); 
		clientConfig.setHttpProtocol(HttpProtocol.https);
		clientConfig.setHttpProxyPort(80);
		
		return new COSClient(cred, clientConfig);
	} 
 
	private static String[] upload(MultipartFile[] files, String regionName, String bucketName) throws IOException {  
		
		COSClient cosClient = createCOSClient(regionName);
		 
		String[] results = new String[files.length]; 
		int i = 0;
		for (MultipartFile file: files) {   
			//获取后缀
			String ext = "";
			int ofindex = file.getOriginalFilename().lastIndexOf(".");
			if (ofindex > 0) {
				ext = file.getOriginalFilename().substring(ofindex);
			}
			
			String key = envName + "_" + UUID.randomUUID().toString().replaceAll("-", "") + ext;
			results[i ++] = key; 
			PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, key, file.getInputStream(), new ObjectMetadata()); 
			cosClient.putObject(putObjectRequest);
		} 
		cosClient.shutdown();
		
		return results;
	} 
	
	//https://demo-mall-1256372626.cos.ap-chengdu.myqcloud.com/  [result]
	public static String[] uploadFile(MultipartFile[] files) throws IOException { 
		
		return upload(files, defaultRegionName, defaultBucketName);
		
	}
	private static TransferManager createTransferManager(String regionName) {

	    COSClient cosClient = createCOSClient(regionName);

	    // 对于使用公网传输且网络带宽质量不高的情况，建议减小该值，避免因网速过慢，造成请求超时。
	    ExecutorService threadPool = Executors.newFixedThreadPool(5); 
	    // 传入一个 threadpool, 若不传入线程池，默认 TransferManager 中会生成一个单线程的线程池。
	    TransferManager transferManager = new TransferManager(cosClient, threadPool); 
	    // 设置高级接口的配置项
	    // 分块上传阈值和分块大小分别为 5MB 和 1MB
	    TransferManagerConfiguration transferManagerConfiguration = new TransferManagerConfiguration();
	    transferManagerConfiguration.setMultipartUploadThreshold(1 * 1024 * 1024);
	    transferManagerConfiguration.setMinimumUploadPartSize(500 * 1024);
	    transferManager.setConfiguration(transferManagerConfiguration);

	    return transferManager;
	}
	public static String uploadComponent(MultipartFile[] files) throws IOException { 
		
		COSClient cosClient = createCOSClient(componentRegionName);
		 
		String UUIDHomePath = envName + "_" + UUID.randomUUID().toString().replaceAll("-", "");

		for (MultipartFile file: files) {   
			String key = UUIDHomePath + file.getOriginalFilename();
			PutObjectRequest putObjectRequest = new PutObjectRequest(componentBucketName, key, file.getInputStream(), new ObjectMetadata()); 
			cosClient.putObject(putObjectRequest);
		} 
		cosClient.shutdown();
		
		return UUIDHomePath; 
	}
	
	public static List<String> listFolderFileNames(String folderName, Boolean filterDist) {
		COSClient cosClient = createCOSClient(componentRegionName);
		
		ListObjectsRequest listObjectsRequest = new ListObjectsRequest();
		// 设置 bucket 名称
		listObjectsRequest.setBucketName(componentBucketName);
		// 设置列出的对象名以 prefix 为前缀
		listObjectsRequest.setPrefix(folderName);
		// 设置最大列出多少个对象, 一次 listobject 最大支持1000
		listObjectsRequest.setMaxKeys(1000);
		
		ObjectListing objectListing = null;
		
		try {
		    objectListing = cosClient.listObjects(listObjectsRequest);
		} catch (CosServiceException e) {
		    e.printStackTrace();
		} catch (CosClientException e) {
		    e.printStackTrace();
		}
		
		List<String> result = new ArrayList<>();
		
		if (objectListing != null) {
			List<COSObjectSummary> cosObjectSummaries = objectListing.getObjectSummaries(); 
			
			for (COSObjectSummary cosObjectSummary : cosObjectSummaries) { 
				String key = cosObjectSummary.getKey();
				System.out.println(key);
				if (filterDist && key.indexOf(folderName + "/dist") == 0) {
					continue;
				}   
				result.add(key); 
			}
		}
		
		cosClient.shutdown();
		
		return result;
	}
	private static void downloadFolder(String regionName, String bucketName, String fileUuid, File downloadFile) {
		TransferManager transferManager = createTransferManager(regionName); 
		
		try {  
			
		    transferManager.downloadDirectory(bucketName, "/" + fileUuid, downloadFile).waitForCompletion();
		    
		} catch (CosServiceException e) {
			LogHelper.log(e.getErrorMessage()); 
			LogHelper.log(e.getMessage()); 
		} catch (CosClientException e) {
			LogHelper.log(e.getMessage());
		} catch (InterruptedException e) {
			LogHelper.log(e.getMessage());
		}
 
		transferManager.shutdownNow(true); 
	}
	public static void downloadComponent(String plugUid, File file) {   
		
		downloadFolder(componentRegionName, componentBucketName, plugUid, file); 
	}
}
