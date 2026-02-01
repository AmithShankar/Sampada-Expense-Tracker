package com.expenseTracker.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.expenseTracker.entity.Budgets;
import com.expenseTracker.entity.Categories;
import com.expenseTracker.repository.BudgetsRepository;
import com.expenseTracker.repository.CategoryRepository;
import com.expenseTracker.resources.ResponseModel;

@Service
public class CategoryServiceImpl {

	private CategoryRepository cRepo;
	private BudgetsRepository bRepo;
	
	public CategoryServiceImpl(CategoryRepository cRepo, BudgetsRepository bRepo) {
		this.cRepo = cRepo;
		this.bRepo = bRepo;
	}
	
	private static final Logger LOGGER = LoggerFactory.getLogger(CategoryServiceImpl.class);
			
	public ResponseModel getCategories(String userId) {
		ResponseModel response = new ResponseModel();
		try {
			List<Categories> categories = this.cRepo.findByUserid(userId);
			for (Categories cat : categories) {
				String currentMonth = LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM yyyy", Locale.ENGLISH));
			    Budgets budget = bRepo.findByCategory_IdAndUseridAndMonth(cat.getId(), cat.getUserid(), currentMonth);
			    if (budget != null) {
			        cat.setBudget(budget.getAmount());
			    }
			}
			response.setData(categories);
		} catch (Exception e) {
			response.setErrors("Failed in getCategories: " + e);
			LOGGER.error("Failed in getCategories: " + e);
		}
		return response;
	}

}
