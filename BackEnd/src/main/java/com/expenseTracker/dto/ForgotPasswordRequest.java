package com.expenseTracker.dto;

public class ForgotPasswordRequest {

    private String userid;
    private String newPassword;
    private String confirmPassword;

    public ForgotPasswordRequest(String userid, String newPassword, String confirmPassword) {
		super();
		this.userid = userid;
		this.newPassword = newPassword;
		this.confirmPassword = confirmPassword;
	}

    public ForgotPasswordRequest() {
    }
    
	public String getUserid() {
        return userid;
    }

    public void setUserid(String userid) {
        this.userid = userid;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

	@Override
	public String toString() {
		return "ForgotPasswordRequest [userid=" + userid + ", newPassword=" + newPassword + ", confirmPassword="
				+ confirmPassword + "]";
	}
}
