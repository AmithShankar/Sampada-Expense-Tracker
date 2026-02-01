package com.expenseTracker.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.expenseTracker.entity.Expenses;

public interface ExpensesRepository extends JpaRepository<Expenses, Long> {
    List<Expenses> findByUserid(String userid);

	Page<Expenses> findByUserid(String userId, Pageable pageable);

	List<Expenses> findByUseridAndDateAfter(String userId, LocalDateTime sixMonthsAgo);

	List<Expenses> findByUseridAndDateBetween(String userId, LocalDateTime startDate, LocalDateTime endDate);
}