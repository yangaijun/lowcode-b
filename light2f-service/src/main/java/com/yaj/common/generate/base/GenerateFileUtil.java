package com.yaj.common.generate.base;

import java.io.*;
import java.util.Arrays;
import java.util.stream.Collectors;

public class GenerateFileUtil {

    public static String mergePath(String... paths){
        return Arrays.asList(paths).stream().collect(Collectors.joining(File.separator));
    }

    public static void writeToFile(String content, String path) throws IOException {
        writeToFile(content,path,false);
    }

    public static void writeToFile(String content, String path,boolean overwrite) throws IOException {
        File file = new File(path);
        if (file.isDirectory()) {
        	return;
        }
        if (content == null) {
        	file.mkdir();
        	return;
        }
        
        if (!file.getParentFile().exists()) {
            file.getParentFile().mkdirs();
        }
        
        if (!file.exists()) {
            file.createNewFile();
        } else {
            if(!overwrite){
                return;
            }
        }
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file), "utf8"));
        bw.write(content);
        bw.flush();
        bw.close();
    }

}
