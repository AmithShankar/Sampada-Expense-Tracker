package com.expenseTracker.entity;

import java.math.BigDecimal;
import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="budgets")
public class Budgets {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	private String userid;
	
	@ManyToOne
	@JoinColumn(name="category_id", referencedColumnName="id")
	private Categories category;
	private String month;
	private BigDecimal amount;
	private String currency;
	
	@Column(name="rollover_enabled")
	private Boolean rollOverEnabled;
	
	@Column(name="created_at", insertable = false, updatable = false)
	private Timestamp createdAt;
	
	//Jackson mapping: categoryId -> Categories.id
    @JsonProperty("categoryId")
    public void setCategoryId(Long categoryId) {
        if (this.category == null) {
            this.category = new Categories();
        }
        this.category.setId(categoryId);
    }

	public Budgets(Long id, String userid, Categories category, String month, BigDecimal amount, String currency,
			Boolean rollOverEnabled, Timestamp createdAt) {
		super();
		this.id = id;
		this.userid = userid;
		this.category = category;
		this.month = month;
		this.amount = amount;
		this.currency = currency;
		this.rollOverEnabled = rollOverEnabled;
		this.createdAt = createdAt;
	}
	
	public Budgets() {
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public Categories getCategory() {
		return category;
	}

	public void setCategory(Categories category) {
		this.category = category;
	}

	public String getMonth() {
		return month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public Boolean getRollOverEnabled() {
		return rollOverEnabled;
	}

	public void setRollOverEnabled(Boolean rollOverEnabled) {
		this.rollOverEnabled = rollOverEnabled;
	}

	public Timestamp getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	}

	@Override
	public String toString() {
		return "Budgets [id=" + id + ", userid=" + userid + ", category=" + category + ", month=" + month + ", amount="
				+ amount + ", currency=" + currency + ", rollOverEnabled=" + rollOverEnabled + ", createdAt="
				+ createdAt + "]";
	}
}
