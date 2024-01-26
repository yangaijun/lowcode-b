package com.yaj.freedomen.business.user.entity.params;

import com.yaj.freedomen.business.user.entity.po.UserPO;

public class RegisterParam extends UserPO {
	private String code;

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

}
