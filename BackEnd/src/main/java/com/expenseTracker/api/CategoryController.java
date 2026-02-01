package com.expenseTracker.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expenseTracker.entity.Budgets;
import com.expenseTracker.entity.Categories;
import com.expenseTracker.repository.CategoryRepository;
import com.expenseTracker.resources.ResponseModel;
import com.expenseTracker.service.CategoryServiceImpl;

@RestController
@RequestMapping("/category")
public class CategoryController {
	
	private CategoryServiceImpl cService;
	private CategoryRepository cRepo;
	
	public CategoryController(CategoryServiceImpl cService, CategoryRepository cRepo) {
		this.cService = cService;
		this.cRepo = cRepo;
	}
	
	private static final Logger LOGGER = LoggerFactory.getLogger(CategoryController.class);
	
	@GetMapping("/getCategories/{userId}")
	public ResponseModel getCategories(@PathVariable String userId) {
		ResponseModel response = new ResponseModel();
		try {
			response = this.cService.getCategories(userId);
		}	catch (Exception e) {
			response.setErrors("Error while getting category: " + e.getMessage());
		}		
		return response;
	}
	
	@PostMapping("/addCategory")
	public ResponseModel addCategory(@RequestBody Categories categories) {
		LOGGER.info(categories.toString());
		ResponseModel response = new ResponseModel();
		try {
			cRepo.save(categories);

			response.setData("Category Added successfully");
			response.setErrors(null);
		} catch (Exception e) {
			response.setErrors("Error while adding Category: " + e.getMessage());
		}
		return response;
	}
	
	@PostMapping("/updateCategory")
	public ResponseModel updateCategory(@RequestBody Categories categories) {
		LOGGER.info(categories.toString());
		ResponseModel response = new ResponseModel();
		try {
			cRepo.save(categories);

			response.setData("Category Updated successfully");
			response.setErrors(null);
		} catch (Exception e) {
			response.setErrors("Error while updating Category: " + e.getMessage());
		}
		return response;
	}
	
	@DeleteMapping("/deleteCategory/{id}")
	public ResponseModel deleteCategory(@PathVariable Long id) {
		ResponseModel response = new ResponseModel();
		try {
			cRepo.deleteById(id);
			response.setData("Expense Deleted successfully");
			response.setErrors(null);
		} catch (Exception e) {
			response.setErrors("Error while deleting Category: " + e.getMessage());
		}
		return response;
	}
}
