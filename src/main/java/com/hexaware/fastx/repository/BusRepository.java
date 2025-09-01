package com.hexaware.fastx.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hexaware.fastx.entities.Bus;

public interface BusRepository extends JpaRepository<Bus, Integer> {
	
    Bus findByBusName(String busName);
}