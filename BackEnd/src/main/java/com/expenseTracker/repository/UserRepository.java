package com.expenseTracker.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.expenseTracker.entity.User;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUserid(String userid);
}
