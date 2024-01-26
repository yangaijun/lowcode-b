package com.yaj.freedomen.business.user.entity.params;

public class SendEmailParam { 
	private String userEmail;
	//null || default register, forget  注冊、忘記密碼
    private String sendType;
    
    public String getUserEmail() {
		return userEmail;
	}
	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}
	public String getSendType() {
		return sendType;
	}
	public void setSendType(String sendType) {
		this.sendType = sendType;
	}
	
}
