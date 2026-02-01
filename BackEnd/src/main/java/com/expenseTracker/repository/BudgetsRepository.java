package com.expenseTracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.expenseTracker.entity.Budgets;

@Repository
public interface BudgetsRepository extends JpaRepository<Budgets, Long>{

	List<Budgets> findByUserid(String userId);

	Budgets findByCategory_IdAndUserid(Long id, String userid);

	List<Budgets> findByUseridAndMonth(String userId, String currentMonth);

	Budgets findByCategory_IdAndUseridAndMonth(Long id, String userid, String currentMonth);

}
