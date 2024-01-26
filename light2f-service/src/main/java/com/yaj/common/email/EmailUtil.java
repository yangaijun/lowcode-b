package com.yaj.common.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class EmailUtil {
	@Value("${spring.mail.from}")
	private String from;
	
	@Autowired
    private JavaMailSender mailSender;
	
	public void sendMessage(String to, String subject, String content) { 
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from); // 设置发送发
        msg.setTo(to); // 设置接收方
        msg.setSubject(subject); // 设置邮件主题
        msg.setText(content); // 设置邮件内容
        // 发送邮件
        mailSender.send(msg);
    } 
}
