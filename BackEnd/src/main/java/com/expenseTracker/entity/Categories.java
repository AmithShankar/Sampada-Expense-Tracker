package com.expenseTracker.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name="categories")
public class Categories {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	private String name;
	
	@Column(name="color_code")
	private String colorCode;
	
	@Column(name="category_icon")
	private Integer categoryIcon;
	private String userid;
	
	@Transient
	private BigDecimal budget;
	
	public Categories() {
	}

	public Categories(Long id, String name, String colorCode, Integer categoryIcon, String userid, BigDecimal budget) {
		super();
		this.id = id;
		this.name = name;
		this.colorCode = colorCode;
		this.categoryIcon = categoryIcon;
		this.userid = userid;
		this.budget = budget;
	}

	public BigDecimal getBudget() {
		return budget;
	}

	public void setBudget(BigDecimal budget) {
		this.budget = budget;
	}

	public String getUserid() {
		return userid;
	}


	public void setUserid(String userid) {
		this.userid = userid;
	}


	public Integer getCategoryIcon() {
		return categoryIcon;
	}

	public void setCategoryIcon(Integer categoryIcon) {
		this.categoryIcon = categoryIcon;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getColorCode() {
		return colorCode;
	}

	public void setColorCode(String colorCode) {
		this.colorCode = colorCode;
	}

	@Override
	public String toString() {
		return "Categories [id=" + id + ", name=" + name + ", colorCode=" + colorCode + ", categoryIcon=" + categoryIcon
				+ ", userid=" + userid + ", budget=" + budget + "]";
	}
}
