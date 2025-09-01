package com.hexaware.fastx.service;

import java.util.List;

import com.hexaware.fastx.entities.BusOperator;

public interface IBusOperatorService {
	
	public BusOperator addOperator(BusOperator operator);
    public BusOperator getOperatorById(int operatorId);
    public List<BusOperator> getAllOperators();
    public String deleteOperatorById(int operatorId);

}