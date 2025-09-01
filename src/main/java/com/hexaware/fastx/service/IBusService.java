package com.hexaware.fastx.service;

import java.util.List;

import com.hexaware.fastx.entities.Bus;

public interface IBusService {
	
	    public Bus addBus(Bus bus);
	    public Bus getBusById(int busId);
	    public Bus findByName(String busName);
	    public Bus updateBus(Bus bus);
	    public List<Bus> getAllBuses();
	    public String deleteBus(int busId);

}
