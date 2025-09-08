package com.hexaware.fastx.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.fastx.entities.Bus;
import com.hexaware.fastx.entities.BusOperator;
import com.hexaware.fastx.exception.ResourceNotFoundException;
import com.hexaware.fastx.repository.BusRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Service implementation for managing Bus entities in the system.
 *
 * Responsibilities:
 * - Add new buses
 * - Retrieve buses by ID or name
 * - Update existing buses
 * - Fetch all buses
 * - Delete buses by their ID
 *
 * Utilizes BusRepository for persistence operations.
 * Throws ResourceNotFoundException when a requested bus is not found.
 *
 * Logging (via Lombok's @Slf4j) is used to track key operations 
 * for debugging and auditing purposes.
 */

@Slf4j
@Service
public class BusServiceImpl implements IBusService {

    @Autowired
    BusRepository busRepository;
    
    @Autowired
    IBusOperatorService busOperatorService;

    @Override
    public Bus addBus(Bus bus) {
        log.info("Adding bus: {}", bus.getBusName());
        
        
        if (bus.getOperator() == null || bus.getOperator().getOperatorId() == 0) {
            throw new IllegalArgumentException("Bus must have an operator assigned");
        }
        
		/*
		 * if (bus.getOperator() != null && bus.getOperator().getOperatorId() > 0) {
		 * BusOperator operator =
		 * busOperatorService.getOperatorById(bus.getOperator().getOperatorId());
		 * bus.setOperator(operator); } else { throw new
		 * ResourceNotFoundException("Operator ID is missing or invalid while adding bus"
		 * ); }
		 */
        return busRepository.save(bus);
    }

    @Override
    public Bus getBusById(int busId) {
    	log.info("Fetching bus by ID: {}", busId);
        return busRepository.findById(busId).orElseThrow(() -> new ResourceNotFoundException("Bus not found with ID: " + busId));

    }

    @Override
    public Bus findByName(String busName) {
    	log.info("Fetching bus by name: {}", busName);
    	Bus bus = busRepository.findByBusName(busName);
        if (bus == null) {
            throw new ResourceNotFoundException("Bus not found with name: " + busName);
        }
        return bus;
    }

    @Override
    public Bus updateBus(Bus bus) {
        log.info("Updating bus ID: {}", bus.getBusId());

    	if (!busRepository.existsById(bus.getBusId())) {
            throw new ResourceNotFoundException("Bus not found with ID: " + bus.getBusId());
        }
    	if (bus.getOperator() != null && bus.getOperator().getOperatorId() > 0) {
            BusOperator operator = busOperatorService.getOperatorById(bus.getOperator().getOperatorId());
            bus.setOperator(operator);
        }
        return busRepository.save(bus);
    }

    @Override
    public List<Bus> getAllBuses() {
    	log.info("Fetching all buses");
    	List<Bus> buses = busRepository.findAll();
        if (buses.isEmpty()) {
            throw new ResourceNotFoundException("No buses found");
        }
        return buses;
    }

    @Override
    public String deleteBus(int busId) {
    	log.info("Deleting bus ID: {}", busId);
    	Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with ID: " + busId));
    	busRepository.delete(bus);
        return "Bus deleted successfully " ;
    }
}

