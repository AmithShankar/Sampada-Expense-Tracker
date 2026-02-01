package com.expenseTracker.resources;

public class ResponseModel {
	private Object data;
	private String errors;
	private String warnings;
	private String informations;
	private String authorization;
	private Paging paging;
	
	public ResponseModel() {
	}
	
	public ResponseModel(String data, String errors, String warnings, String informations, String authorization,
			Paging paging) {
		super();
		this.data = data;
		this.errors = errors;
		this.warnings = warnings;
		this.informations = informations;
		this.authorization = authorization;
		this.paging = paging;
	}

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}

	public String getErrors() {
		return errors;
	}

	public void setErrors(String errors) {
		this.errors = errors;
	}

	public String getWarnings() {
		return warnings;
	}

	public void setWarnings(String warnings) {
		this.warnings = warnings;
	}

	public String getInformations() {
		return informations;
	}

	public void setInformations(String informations) {
		this.informations = informations;
	}

	public String getAuthorization() {
		return authorization;
	}

	public void setAuthorization(String authorization) {
		this.authorization = authorization;
	}

	public Paging getPaging() {
		return paging;
	}

	public void setPaging(Paging paging) {
		this.paging = paging;
	}
}
