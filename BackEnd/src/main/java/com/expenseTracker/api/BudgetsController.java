package com.expenseTracker.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expenseTracker.entity.Budgets;
import com.expenseTracker.repository.BudgetsRepository;
import com.expenseTracker.resources.ResponseModel;
import com.expenseTracker.service.BudgetsServiceImpl;

@RestController
@RequestMapping("/budgets")
public class BudgetsController {

	private BudgetsServiceImpl bService;
	private BudgetsRepository bRepo;
	
	public BudgetsController(BudgetsServiceImpl bService, BudgetsRepository bRepo) {
		this.bRepo = bRepo;
		this.bService = bService;
	}
	
	private static final Logger LOGGER = LoggerFactory.getLogger(BudgetsController.class);
	
	@GetMapping("/getBudgets/{userId}")
	public ResponseModel getBudgets(@PathVariable String userId) {
		ResponseModel response = new ResponseModel();
		try {
			response = this.bService.getBudgets(userId);
		}	catch (Exception e) {
			response.setErrors("Error while adding expense: " + e.getMessage());
		}		
		return response;
	}
	
	@PostMapping("/addBudget")
	public ResponseModel addBudget(@RequestBody Budgets budgets) {
		LOGGER.info(budgets.toString());
		ResponseModel response = new ResponseModel();
		try {
			bRepo.save(budgets);

			response.setData("Budget Added successfully");
			response.setErrors(null);
		} catch (Exception e) {
			response.setErrors("Error while adding Budget: " + e.getMessage());
		}
		return response;
	}
	
	@PostMapping("/updateBudget")
	public ResponseModel updateBudget(@RequestBody Budgets budgets) {
		LOGGER.info(budgets.toString());
		ResponseModel response = new ResponseModel();
		try {
			bRepo.save(budgets);
			bRepo.flush();
			
			response.setData("Budget Updated successfully");
			response.setErrors(null);
		}
		catch (DataIntegrityViolationException e) {
			if (e.getMostSpecificCause().getMessage().contains("idx_budgets_user_category_month")) {
				response.setErrors("Cannot have multiple budgets for same category");
			}
		}
		catch (Exception e) {
			response.setErrors("Error while updating Budget: " + e.getMessage());
		}
		return response;
	}
}
