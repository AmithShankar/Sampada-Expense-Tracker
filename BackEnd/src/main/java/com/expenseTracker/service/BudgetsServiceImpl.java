package com.expenseTracker.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.expenseTracker.entity.Budgets;
import com.expenseTracker.repository.BudgetsRepository;
import com.expenseTracker.resources.ResponseModel;

@Service
public class BudgetsServiceImpl {

	private BudgetsRepository bRepo;
	
	public BudgetsServiceImpl(BudgetsRepository bRepo) {
		this.bRepo = bRepo;
	}
	
	private static final Logger LOGGER = LoggerFactory.getLogger(BudgetsServiceImpl.class);

	public ResponseModel getBudgets(String userId) {
		ResponseModel response = new ResponseModel();
		try {
			String currentMonth = LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM yyyy", Locale.ENGLISH));

		    List<Budgets> budgets = bRepo.findByUseridAndMonth(userId, currentMonth);
			response.setData(budgets);
		} catch (Exception e) {
			response.setErrors("Failed in getBudgets: " + e);
			LOGGER.error("Failed in getBudgets: " + e);
		}
		return response;
	}
	
}
