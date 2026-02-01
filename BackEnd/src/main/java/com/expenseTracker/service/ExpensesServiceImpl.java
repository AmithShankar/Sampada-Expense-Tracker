package com.expenseTracker.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.expenseTracker.entity.Expenses;
import com.expenseTracker.repository.ExpensesRepository;
import com.expenseTracker.resources.ResponseModel;

@Service
public class ExpensesServiceImpl {

	private final ExpensesRepository eRepo;
	
    private static final Logger LOGGER = LoggerFactory.getLogger(ExpensesServiceImpl.class);

    public ExpensesServiceImpl(ExpensesRepository eRepo) {
    	this.eRepo = eRepo;
    }
    
	public ResponseModel getExpenses(String userId) {
		ResponseModel response = new ResponseModel();
		try {
			LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6); 
			List<Expenses> expenses = this.eRepo.findByUseridAndDateAfter(userId, sixMonthsAgo); 
			LOGGER.info(expenses.toString()); 
			response.setData(expenses != null ? expenses : new ArrayList<>());
		} catch (Exception e) {
			response.setErrors("Failed in getExpenses: " + e);
			LOGGER.error("Failed in getExpenses: " + e);
		}
		
		return response;
	}
	
	public Page<Expenses> getAllExpenses(String userId, Pageable pageable) {
		Pageable sortedPageable = PageRequest.of(
				pageable.getPageNumber(),
				pageable.getPageSize(),
				Sort.by("date").descending()
				);
		return eRepo.findByUserid(userId, sortedPageable);    
	}

	public ResponseModel getCustomExpenses(String userId, Integer duration) {
		ResponseModel response = new ResponseModel();
		try {
			LocalDateTime startDate = LocalDate.now().minusMonths(duration).withDayOfMonth(1).atStartOfDay();

	        LocalDateTime endDate = LocalDate.now().withDayOfMonth(1).atStartOfDay();

	        List<Expenses> expenses = eRepo.findByUseridAndDateBetween(userId, startDate, endDate);
			LOGGER.info(expenses.toString()); 
			response.setData(expenses != null ? expenses : new ArrayList<>());
		} catch (Exception e) {
			response.setErrors("Failed in getCustomExpenses: " + e);
			LOGGER.error("Failed in getCustomExpenses: " + e);
		}
		return response;
	}
	
	public ResponseModel getCurrentExpenses(String userId) {
		ResponseModel response = new ResponseModel();
		try {
			LocalDateTime startDate = LocalDate.now().withDayOfMonth(1).atStartOfDay();

	        LocalDateTime endDate = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()).atTime(23, 59, 59);

	        List<Expenses> expenses = eRepo.findByUseridAndDateBetween(userId, startDate, endDate);
			LOGGER.info(expenses.toString()); 
			response.setData(expenses != null ? expenses : new ArrayList<>());
		} catch (Exception e) {
			response.setErrors("Failed in getCurrentExpenses: " + e);
			LOGGER.error("Failed in getCurrentExpenses: " + e);
		}
		return response;
	}
}
