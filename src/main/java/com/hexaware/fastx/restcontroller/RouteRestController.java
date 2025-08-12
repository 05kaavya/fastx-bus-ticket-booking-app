package com.hexaware.fastx.restcontroller;

import com.hexaware.fastx.dto.RouteDto;
import com.hexaware.fastx.entities.Route;
import com.hexaware.fastx.service.IRouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
public class RouteRestController {

    @Autowired
    private IRouteService service;

    @PostMapping("/add")
    public Route addRoute(@RequestBody RouteDto dto) {
        Route route = dto.toEntity();
        return service.addRoute(route);
    }

    @GetMapping("/get/{routeId}")
    public Route getRouteById(@PathVariable int routeId) {
        return service.getRouteById(routeId);
    }

    @GetMapping("/getall")
    public List<Route> getAllRoutes() {
        return service.getAllRoutes();
    }

    @DeleteMapping("/delete/{routeId}")
    public String deleteRoute(@PathVariable int routeId) {
        return service.deleteRoute(routeId);
    }
}

