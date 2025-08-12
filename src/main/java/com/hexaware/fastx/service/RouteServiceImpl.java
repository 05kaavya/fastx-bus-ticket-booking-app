package com.hexaware.fastx.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.fastx.entities.Route;
import com.hexaware.fastx.repository.RouteRepository;

@Service
public class RouteServiceImpl implements IRouteService {

    @Autowired
    RouteRepository routeRepository;

    @Override
    public Route addRoute(Route route) {
        return routeRepository.save(route);
    }

    @Override
    public Route getRouteById(int routeId) {
        return routeRepository.findById(routeId).orElse(null);
    }

    @Override
    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    @Override
    public String deleteRoute(int routeId) {
        routeRepository.deleteById(routeId);
        return "Route deleted successfully: " + routeId;
    }
}
