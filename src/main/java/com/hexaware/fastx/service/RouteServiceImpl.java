package com.hexaware.fastx.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.fastx.entities.Route;
import com.hexaware.fastx.exception.ResourceNotFoundException;
import com.hexaware.fastx.repository.RouteRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class RouteServiceImpl implements IRouteService {

    @Autowired
    RouteRepository routeRepository;

    @Override
    public Route addRoute(Route route) {
        log.info("Adding new route: {} to {}", route.getOrigin(), route.getDestination());

        return routeRepository.save(route);
    }

    @Override
    public Route getRouteById(int routeId) {
    	log.info("Fetching route by ID: {}", routeId);
        return routeRepository.findById(routeId).orElseThrow(() -> new ResourceNotFoundException("Route not found with ID: " + routeId));
    }

    @Override
    public List<Route> getAllRoutes() {
    	 log.info("Fetching all routes");
    	List<Route> routes = routeRepository.findAll();
        if (routes.isEmpty()) {
            throw new ResourceNotFoundException("No routes found");
        }
        return routes;
    }

    @Override
    public String deleteRoute(int routeId) {
    	log.info("Deleting route ID: {}", routeId);
    	Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with ID: " + routeId));
    	routeRepository.delete(route);
        return "Route deleted successfully";
    }
}
