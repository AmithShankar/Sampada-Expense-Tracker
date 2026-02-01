package com.expenseTracker.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.expenseTracker.entity.Expenses;
import com.expenseTracker.repository.ExpensesRepository;
import com.expenseTracker.resources.Paging;
import com.expenseTracker.resources.ResponseModel;
import com.expenseTracker.service.ExpensesServiceImpl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/expenses")
public class ExpensesController {
	
	private final ExpensesServiceImpl eService;
	private final ExpensesRepository eRepo;
	
	public ExpensesController(ExpensesServiceImpl eService, ExpensesRepository eRepo) {
		this.eService = eService;
		this.eRepo = eRepo;
	}
	
	private static final Logger LOGGER = LoggerFactory.getLogger(ExpensesController.class);
	
	@PostMapping("/addExpenses")
	public ResponseModel addExpenses(@RequestBody Expenses expenses) {
		LOGGER.info(expenses.toString());
		ResponseModel response = new ResponseModel();
		try {
			eRepo.save(expenses);

			response.setData("Expense Added successfully");
			response.setErrors(null);
		} catch (Exception e) {
			response.setErrors("Error while adding expense: " + e.getMessage());
		}
		return response;
	}
    
	@GetMapping("/getAllExpenses")
	public ResponseModel getAllExpenses(@RequestParam String userId, Pageable pageable) {
		ResponseModel response = new ResponseModel();
		try {
			Page<Expenses> page = this.eService.getAllExpenses(userId, pageable);
			
			Paging paging = new Paging();
			paging.setPage(page.getNumber());
			paging.setSize(page.getSize());
			paging.setTotalElements(page.getTotalElements());
			paging.setTotalPages(page.getTotalPages());
			
			response.setData(page.getContent());
			response.setPaging(paging);
		} catch (Exception e) {
			response.setErrors("Error while getting getAllExpenses: " + e.getMessage());
		}
		return response;
	}
	
	@GetMapping("/getSixMonthsExpenses/{userId}")
	public ResponseModel getSixMonthsExpenses(@PathVariable String userId) {
		ResponseModel response = new ResponseModel();
		try {
			response = this.eService.getExpenses(userId);
			
		} catch (Exception e) {
			response.setData(null);
			response.setErrors("Error while getting getSixMonthsExpenses: " + e.getMessage());
		}
		return response;
	}
	
	@GetMapping("/getCustomExpenses/{userId}/{duration}")
	public ResponseModel getCustomExpenses(@PathVariable String userId, @PathVariable Integer duration) {
		ResponseModel response = new ResponseModel();
		try {
			response = this.eService.getCustomExpenses(userId, duration);
			
		} catch (Exception e) {
			response.setData(null);
			response.setErrors("Error while getting getCustomExpenses: " + e.getMessage());
		}
		return response;
	}
	
	@GetMapping("/getCurrentExpenses/{userId}")
	public ResponseModel getCurrentExpenses(@PathVariable String userId) {
		ResponseModel response = new ResponseModel();
		try {
			response = this.eService.getCurrentExpenses(userId);
			
		} catch (Exception e) {
			response.setData(null);
			response.setErrors("Error while getting getCurrentExpenses: " + e.getMessage());
		}
		return response;
	}
	
	@PostMapping("/updateExpense")
	public ResponseModel updateExpense(@RequestBody Expenses expenses) {
		LOGGER.info(expenses.toString());
		ResponseModel response = new ResponseModel();
		try {
			eRepo.save(expenses);

			response.setData("Expense Updated successfully");
			response.setErrors(null);
		} catch (Exception e) {
			response.setErrors("Error while updating expense: " + e.getMessage());
		}
		return response;
	}

	@DeleteMapping("/deleteExpense/{id}")
	public ResponseModel deleteExpense(@PathVariable Long id) {
		ResponseModel response = new ResponseModel();
		try {
			eRepo.deleteById(id);
			response.setData("Expense Deleted successfully");
			response.setErrors(null);
		} catch (Exception e) {
			response.setErrors("Error while deleting expense: " + e.getMessage());
		}
		return response;
	}
}
