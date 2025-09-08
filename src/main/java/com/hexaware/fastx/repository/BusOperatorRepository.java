package com.hexaware.fastx.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hexaware.fastx.entities.BusOperator;

public interface BusOperatorRepository extends JpaRepository<BusOperator, Integer> {

	Optional<BusOperator> findByEmail(String email);

	Optional<BusOperator> findByOperatorName(String operatorName);
}
