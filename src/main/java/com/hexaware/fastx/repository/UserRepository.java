package com.hexaware.fastx.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hexaware.fastx.entities.User;

public interface UserRepository extends JpaRepository<User, Integer> {
	
	User findByEmailAndPassword(String email, String password);
	Optional<User> findByEmail(String email);
	  User findByName(String name);
	  boolean existsByEmail(String email);
	
	 
}

