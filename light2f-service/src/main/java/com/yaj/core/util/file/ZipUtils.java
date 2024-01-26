package com.yaj.core.util.file;

import java.io.BufferedInputStream; 
import java.io.File;
import java.io.FileInputStream;  
import java.io.OutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class ZipUtils { 
	 
	public static void makeZipFileModel(File sourceFile, OutputStream os) { 
		try (ZipOutputStream zos = new ZipOutputStream(os)) {
            writeZip(sourceFile, "", zos);
        } catch (Exception e) {
            e.printStackTrace(); 
        }  
	}
	/**
     * ���������ļ���ѹ��
     *
     * @param file       Դ�ļ�Ŀ¼
     * @param parentPath ѹ���ļ�Ŀ¼
     * @param zos        �ļ���
     */
    public static void writeZip(File file, String parentPath, ZipOutputStream zos) {
        if (file.isDirectory()) {
            //Ŀ¼
            parentPath += file.getName() + File.separator;
            File[] files = file.listFiles();
            for (File f : files) {
                writeZip(f, parentPath, zos);
            }
        } else {
            try (BufferedInputStream bis = new BufferedInputStream(new FileInputStream(file))) {
                ZipEntry zipEntry = new ZipEntry(parentPath + file.getName());
                zos.putNextEntry(zipEntry);
                int len;
                byte[] buffer = new byte[1024 * 10];
                while ((len = bis.read(buffer, 0, buffer.length)) != -1) {
                    zos.write(buffer, 0, len);
                    zos.flush();
                }
            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException(e.getMessage(), e.getCause());
            }
        } 
    }
}
