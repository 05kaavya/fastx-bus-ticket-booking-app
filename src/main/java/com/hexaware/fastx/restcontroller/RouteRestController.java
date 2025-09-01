package com.hexaware.fastx.restcontroller;

import com.hexaware.fastx.dto.RouteDto;
import com.hexaware.fastx.entities.Route;
import com.hexaware.fastx.service.IRouteService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/routes")
public class RouteRestController {

    @Autowired
    private IRouteService service;

    @PostMapping("/add")
    public Route addRoute(@RequestBody RouteDto dto) {
    	log.info("Adding new route: {}", dto.getOrigin() + " -> " + dto.getDestination());
        return service.addRoute(dto.toEntity());
    }

    @GetMapping("/get/{routeId}")
    public Route getRouteById(@PathVariable int routeId) {
    	 log.info("Fetching route ID: {}", routeId);
        return service.getRouteById(routeId);
    }

    @GetMapping("/getall")
    public List<Route> getAllRoutes() {
    	 log.info("Fetching all routes");
        return service.getAllRoutes();
    }

    @DeleteMapping("/delete/{routeId}")
    public String deleteRoute(@PathVariable int routeId) {
    	log.info("Deleting route ID: {}", routeId);
        return service.deleteRoute(routeId);
    }
}

