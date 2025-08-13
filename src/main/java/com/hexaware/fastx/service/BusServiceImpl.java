package com.hexaware.fastx.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.fastx.entities.Bus;
import com.hexaware.fastx.exception.ResourceNotFoundException;
import com.hexaware.fastx.repository.BusRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class BusServiceImpl implements IBusService {

    @Autowired
    BusRepository busRepository;

    @Override
    public Bus addBus(Bus bus) {
        log.info("Adding bus: {}", bus.getBusName());
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

