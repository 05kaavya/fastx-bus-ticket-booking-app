package com.hexaware.fastx.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.fastx.entities.Route;

@Repository
public interface RouteRepository extends JpaRepository<Route,Integer>{

	List<Route> findByBusOperatorOperatorId(int operatorId);

	
}
