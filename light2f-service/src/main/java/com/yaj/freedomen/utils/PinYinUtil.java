package com.yaj.freedomen.utils;

import net.sourceforge.pinyin4j.PinyinHelper;
import net.sourceforge.pinyin4j.format.HanyuPinyinCaseType;
import net.sourceforge.pinyin4j.format.HanyuPinyinOutputFormat;
import net.sourceforge.pinyin4j.format.HanyuPinyinToneType;
import net.sourceforge.pinyin4j.format.HanyuPinyinVCharType;
import net.sourceforge.pinyin4j.format.exception.BadHanyuPinyinOutputFormatCombination;

public class PinYinUtil {
	public static String getAllPinyin(String hanzi) {
        HanyuPinyinOutputFormat format = new HanyuPinyinOutputFormat();
        format.setCaseType(HanyuPinyinCaseType.LOWERCASE);
        format.setToneType(HanyuPinyinToneType.WITHOUT_TONE);
        format.setVCharType(HanyuPinyinVCharType.WITH_U_UNICODE);
        char[] hanYuArr = hanzi.trim().toCharArray();
        StringBuilder pinYin = new StringBuilder();
        try {
            for (int i = 0, len = hanYuArr.length; i < len; i++) {
                if (Character.toString(hanYuArr[i]).matches("[\\u4E00-\\u9FA5]+")) {
                    String[] pys = PinyinHelper.toHanyuPinyinStringArray(hanYuArr[i], format);
                    String py = Character.toUpperCase(pys[0].charAt(0)) + pys[0].substring(1);
                    pinYin.append(py);
                } else {
                	pinYin.append(hanYuArr[i]);
                }
            }
        } catch (BadHanyuPinyinOutputFormatCombination badHanyuPinyinOutputFormatCombination) {
            badHanyuPinyinOutputFormatCombination.printStackTrace();
        }
        String regEx="[\n`~!@#$%^&*()+=|{}':;',\\[\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。， 、？]";
        return pinYin.toString().replaceAll(regEx, "");
    }  
}
