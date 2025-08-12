
package com.hexaware.fastx.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.fastx.entities.BusOperator;
import com.hexaware.fastx.repository.BusOperatorRepository;

@Service
public class BusOperatorServiceImpl implements IBusOperatorService {

    @Autowired
    BusOperatorRepository busOperatorRepository;

    @Override
    public BusOperator addOperator(BusOperator operator) {
        return busOperatorRepository.save(operator);
    }

    @Override
    public BusOperator getOperatorById(int operatorId) {
        return busOperatorRepository.findById(operatorId).orElse(null);
    }

    @Override
    public List<BusOperator> getAllOperators() {
        return busOperatorRepository.findAll();
    }

    @Override
    public String deleteOperatorById(int operatorId) {
        busOperatorRepository.deleteById(operatorId);
        return "Bus Operator deleted successfully: " + operatorId;
    }
}

