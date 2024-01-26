package com.yaj.freedomen.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.List;

public class WriteUtil {

	public static Writer getWriter(File file) {
		return getWriter(file, false);
	}
	
	public static Writer getWriter(File file, boolean append) {
		FileOutputStream fis = null;
		OutputStreamWriter fw = null;
		try { 
			fis = new FileOutputStream(file, append); 
			fw = new OutputStreamWriter(fis, "UTF-8"); 
		} catch (Exception e) { }
		return fw;
	}
	
	public static String getFileContent(File file) { 
		StringBuffer sb = new StringBuffer();
        try (BufferedReader br = new BufferedReader(new FileReader(file))) { 
            for (String line = br.readLine(); line != null; line = br.readLine()) {
            	sb.append(line + "\n");  
            }
            br.close();
        } catch (Exception e) { 
        	e.printStackTrace();
        }
        return sb.toString();
	}
	
	public static String readFileAndInsert(File file, String preStrLine, List<String> inserts) {

		StringBuffer sb = new StringBuffer();
        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            for (line = br.readLine(); line != null; line = br.readLine()) {
            	sb.append(line + "\n"); 
                if (line.contains(preStrLine)) {
                	inserts.forEach(l -> {
                		sb.append(l  + "\n");
                	});
                }
            }
            
        } catch (Exception e) { 
        	e.printStackTrace();
        }  
        return sb.toString();
	}
	public static void closeWriter(Writer writer) {
		try {
			writer.close();
		} catch (IOException e) {}
	}
	public static String getSpace(int step) {
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < step * 4; i ++) {
			sb.append(" ");
		}
		return sb.toString();
	}
}
