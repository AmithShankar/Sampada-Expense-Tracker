package com.expenseTracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.expenseTracker.entity.Categories;

@Repository
public interface CategoryRepository extends JpaRepository<Categories, Long> {

	List<Categories> findByUserid(String userId);

	
}
