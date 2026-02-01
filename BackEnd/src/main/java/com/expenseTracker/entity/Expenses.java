package com.expenseTracker.entity;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;

import org.hibernate.annotations.UpdateTimestamp;

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
@Table(name="expenses")
public class Expenses {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	private String userid;
	
	@ManyToOne
	@JoinColumn(name="category_id", referencedColumnName="id")
	private Categories category;
	private BigDecimal amount;
	private String currency;
	private LocalDateTime date;
	
	@Column(name="payment_method")
	private String paymentMethod;
	private String notes;
	
	@Column(name="created_at", insertable = false, updatable = false)
	private Timestamp createdAt;
	
	@UpdateTimestamp
	@Column(name="updated_at", updatable = false)
	private Timestamp updatedAt;

	@Column(name="is_recurring")
	private Boolean isRecurring;
	
	//Jackson mapping: categoryId -> Categories.id
    @JsonProperty("categoryId")
    public void setCategoryId(Long categoryId) {
        if (this.category == null) {
            this.category = new Categories();
        }
        this.category.setId(categoryId);
    }

	public Expenses(Long id, String userid, Categories category, BigDecimal amount, String currency, LocalDateTime date,
			String paymentMethod, String notes, Timestamp createdAt, Timestamp updatedAt, Boolean isRecurring) {
		super();
		this.id = id;
		this.userid = userid;
		this.category = category;
		this.amount = amount;
		this.currency = currency;
		this.date = date;
		this.paymentMethod = paymentMethod;
		this.notes = notes;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.isRecurring = isRecurring;
	}

	public Expenses() {
	}

	public Timestamp getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
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

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	public LocalDateTime getDate() {
		return date;
	}

	public void setDate(LocalDateTime date) {
		this.date = date;
	}

	public String getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public Timestamp getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Timestamp updatedAt) {
		this.updatedAt = updatedAt;
	}

	public Boolean getIsRecurring() {
		return isRecurring;
	}

	public void setIsRecurring(Boolean isRecurring) {
		this.isRecurring = isRecurring;
	}

	@Override
	public String toString() {
		return "Expenses [id=" + id + ", userid=" + userid + ", category=" + category + ", amount=" + amount
				+ ", currency=" + currency + ", date=" + date + ", paymentMethod=" + paymentMethod + ", notes=" + notes
				+ ", updatedAt=" + updatedAt + ", isRecurring=" + isRecurring + "]";
	}
	
	
}
