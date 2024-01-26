package com.yaj.core.util.codec;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.Security;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.KeyAgreement;
import javax.crypto.KeyGenerator;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;

public class EncrypAES {
	
	//KeyGenerator 提供对称密钥生成器的功能，支持各种算法
	private KeyGenerator keygen;
	//SecretKey 负责保存对称密钥
	private SecretKey deskey;
	//Cipher负责完成加密或解密工作
	private Cipher c;
	//该字节数组负责保存加密的结果
	private byte[] cipherByte;
	//key
	private final String key="~!@#$%20160415~123456";
	
	public EncrypAES() throws NoSuchAlgorithmException, NoSuchPaddingException{
		Security.addProvider(new com.sun.crypto.provider.SunJCE());
		//实例化支持DES算法的密钥生成器(算法名称命名需按规定，否则抛出异常)
		keygen = KeyGenerator.getInstance("AES");
		//生成密钥
		keygen.init(128,new SecureRandom(key.getBytes()));
		deskey = keygen.generateKey();
		//生成Cipher对象,指定其支持的DES算法
		c = Cipher.getInstance("AES");
	}
	
	/**
	 * 对字符串加密
	 * 
	 * @param str
	 * @return
	 * @throws InvalidKeyException
	 * @throws IllegalBlockSizeException
	 * @throws BadPaddingException
	 */
	public byte[] Encrytor(String str) throws InvalidKeyException,
			IllegalBlockSizeException, BadPaddingException {
		// 根据密钥，对Cipher对象进行初始化，ENCRYPT_MODE表示加密模式
		c.init(Cipher.ENCRYPT_MODE, deskey);
		byte[] src = str.getBytes();
		// 加密，结果保存进cipherByte
		cipherByte = c.doFinal(src);
		return cipherByte;
	}

	/**
	 * 对字符串解密
	 * 
	 * @param buff
	 * @return
	 * @throws InvalidKeyException
	 * @throws IllegalBlockSizeException
	 * @throws BadPaddingException
	 */
	public byte[] Decryptor(byte[] buff) throws InvalidKeyException,
			IllegalBlockSizeException, BadPaddingException {
		// 根据密钥，对Cipher对象进行初始化，DECRYPT_MODE表示加密模式
		c.init(Cipher.DECRYPT_MODE, deskey);
		cipherByte = c.doFinal(buff);
		return cipherByte;
	}

	/**
	 * @param args
	 * @throws NoSuchPaddingException 
	 * @throws NoSuchAlgorithmException 
	 * @throws BadPaddingException 
	 * @throws IllegalBlockSizeException 
	 * @throws InvalidKeyException 
	 */
	public static void main(String[] args) throws Exception {
		Base64 base64 = new Base64();
		EncrypAES de1 = new EncrypAES();
		String msg ="123";
		byte[] encontent = de1.Encrytor(msg);
		byte[] decontent = de1.Decryptor(encontent);
		System.out.println("明文是:" + msg);
		System.out.println("加密后:" + new String(encontent));
		String base64str=new String(base64.encode(encontent));
		System.out.println("加密后Base64编码:" + base64str);
		System.out.println("base64解码后密文:" + new String(base64.decode(base64str.getBytes())));
		System.out.println("解密后明文:" + new String(de1.Decryptor(base64.decode(base64str.getBytes()))));
	}

}
