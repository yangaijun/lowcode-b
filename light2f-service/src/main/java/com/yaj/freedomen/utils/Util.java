package com.yaj.freedomen.utils;

public class Util {
    public static String useString(String ...params) {
        for (String param: params) {
            if (param != null && !param.equals("")) {
                return  param;
            }
        }
        return "";
    }
}
