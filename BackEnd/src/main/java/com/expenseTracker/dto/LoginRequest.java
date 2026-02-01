package com.expenseTracker.dto;

public class LoginRequest {
    public String userid;
    public String password;
    
	public LoginRequest(String userid, String password) {
		super();
		this.userid = userid;
		this.password = password;
	}
	public String getuserid() {
		return userid;
	}
	public void setuserid(String userid) {
		this.userid = userid;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
    
}