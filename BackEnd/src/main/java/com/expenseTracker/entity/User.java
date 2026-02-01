package com.expenseTracker.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="users")
public class User {

	@Id
	@Column(name="userid", nullable = false, unique = true)
	private String userid;
	private String username;
	private String password;
	private String email;
	private String role;

	@Column(name = "default_currency")
	private String defaultCurrency;
	
	public User(String userid, String username, String password, String email, String role, String defaultCurrency) {
		super();
		this.userid = userid;
		this.username = username;
		this.password = password;
		this.email = email;
		this.role = role;
		this.defaultCurrency = defaultCurrency;
	}

	public User() {
	}

	
	public String getDefaultCurrency() {
		return defaultCurrency;
	}

	public void setDefaultCurrency(String defaultCurrency) {
		this.defaultCurrency = defaultCurrency;
	}

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	@Override
	public String toString() {
		return "user [userid=" + userid + ", username=" + username + ", password=" + password + ", email=" + email
				+ ", role=" + role + "]";
	}
	
	
}
