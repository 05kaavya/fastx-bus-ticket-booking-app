package com.hexaware.fastx.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.fastx.entities.Bus;
import com.hexaware.fastx.repository.BusRepository;

@Service
public class BusServiceImpl implements IBusService {

    @Autowired
    BusRepository busRepository;

    @Override
    public Bus addBus(Bus bus) {
        return busRepository.save(bus);
    }

    @Override
    public Bus getBusById(int busId) {
        return busRepository.findById(busId).orElse(null);
    }

    @Override
    public Bus findByName(String busName) {
        return busRepository.findByBusName(busName);
    }

    @Override
    public Bus updateBus(Bus bus) {
        return busRepository.save(bus);
    }

    @Override
    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }

    @Override
    public String deleteBus(int busId) {
        busRepository.deleteById(busId);
        return "Bus deleted successfully: " + busId;
    }
}

