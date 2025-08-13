
package com.hexaware.fastx.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.fastx.entities.BusOperator;
import com.hexaware.fastx.exception.ResourceNotFoundException;
import com.hexaware.fastx.repository.BusOperatorRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class BusOperatorServiceImpl implements IBusOperatorService {

    @Autowired
    BusOperatorRepository busOperatorRepository;

    @Override
    public BusOperator addOperator(BusOperator operator) {
    	log.info("Adding bus operator: {}", operator.getOperatorName());
        return busOperatorRepository.save(operator);
    }

    @Override
    public BusOperator getOperatorById(int operatorId) {
    	 log.info("Fetching bus operator by ID: {}", operatorId);
        return busOperatorRepository.findById(operatorId) .orElseThrow(() -> new ResourceNotFoundException("Bus operator not found with ID: " + operatorId));
    }

    @Override
    public List<BusOperator> getAllOperators() {
    	log.info("Fetching all bus operators");
    	List<BusOperator> operators = busOperatorRepository.findAll();
        if (operators.isEmpty()) {
            throw new ResourceNotFoundException("No bus operators found");
        }
        return operators;
    }

    @Override
    public String deleteOperatorById(int operatorId) {
    	log.info("Deleting bus operator ID: {}", operatorId);
    	BusOperator operator =busOperatorRepository.findById(operatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Bus operator not found with ID: " + operatorId));
    	busOperatorRepository.delete(operator);
        return "Bus Operator deleted successfully";
    }
}

