package com.expenseTracker.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

@Entity
@Table(name = "expense_tags")
@IdClass(ExpenseTagId.class)
public class ExpenseTag {

	@Id
	@Column(name = "expense_id", nullable = false)
	private Long expenseId;

	@Id
	@Column(name = "tag_id", nullable = false)
	private Long tagId;

	public ExpenseTag() {
	}

	public ExpenseTag(Long expenseId, Long tagId) {
		super();
		this.expenseId = expenseId;
		this.tagId = tagId;
	}

	public Long getExpenseId() {
		return expenseId;
	}

	public void setExpenseId(Long expenseId) {
		this.expenseId = expenseId;
	}

	public Long getTagId() {
		return tagId;
	}

	public void setTagId(Long tagId) {
		this.tagId = tagId;
	}
}
