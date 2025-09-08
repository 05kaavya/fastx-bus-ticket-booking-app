package com.hexaware.fastx.restcontroller;

import com.hexaware.fastx.dto.BusOperatorDto;
import com.hexaware.fastx.dto.RouteDto;
import com.hexaware.fastx.entities.Booking;
import com.hexaware.fastx.entities.Bus;
import com.hexaware.fastx.entities.BusOperator;
import com.hexaware.fastx.entities.Route;
import com.hexaware.fastx.entities.User;
import com.hexaware.fastx.service.IBusOperatorService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/bus-operators")
public class BusOperatorRestController {

    @Autowired
    private IBusOperatorService service;

    // ✅ Get current operator ID from authentication
    private int getCurrentOperatorId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        String email = authentication.getName();
        return service.getOperatorByEmail(email).getOperatorId();
    }

    @PostMapping("/add")
    public BusOperator addOperator(@RequestBody BusOperatorDto dto) {
        log.info("Adding bus operator: {}", dto.getOperatorName());
        return service.addOperator(dto.toEntity());
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/get/{operatorId}")
    public BusOperator getOperatorById(@PathVariable int operatorId) {
        return service.getOperatorById(operatorId);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/getall")
    public List<BusOperator> getAllOperators() {
        return service.getAllOperators();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/delete/{operatorId}")
    public String deleteOperator(@PathVariable int operatorId) {
        return service.deleteOperatorById(operatorId);
    }

    // ✅ Get all buses under a specific operator
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/{operatorId}/buses")
    public List<Bus> getBusesByOperator(@PathVariable int operatorId) {
        return service.getBusesByOperatorId(operatorId);
    }

    // ✅ Get all buses under the current operator
    @GetMapping("/my-buses")
    @PreAuthorize("hasAuthority('OPERATOR')")
    public List<Bus> getMyBuses() {
        try {
            int operatorId = getCurrentOperatorId();
            return service.getBusesByOperatorId(operatorId);
        } catch (Exception e) {
            log.error("Failed to load buses for current operator", e);
            throw new RuntimeException("Unable to load your buses. " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('OPERATOR')")
    @GetMapping("/my-routes")
    public List<Route> getMyRoutes() {
        return service.getRoutesByOperatorId(getCurrentOperatorId());
    }

    @PreAuthorize("hasAuthority('OPERATOR')")
    @GetMapping("/my-bookings")
    public List<Booking> getMyBookings() {
        return service.getBookingsByOperatorId(getCurrentOperatorId());
    }

    @PreAuthorize("hasAuthority('OPERATOR')")
    @GetMapping("/my-passengers")
    public List<User> getMyPassengers() {
        return service.getPassengersByOperatorId(getCurrentOperatorId());
    }
    
    @PreAuthorize("hasAuthority('OPERATOR')")
    @PostMapping("/my-buses/add")
    public Bus addBus(@RequestBody Bus bus) {
        int operatorId = getCurrentOperatorId();
        BusOperator operator = service.getOperatorById(operatorId);
        bus.setOperator(operator);  // ✅ attach operator
        return service.addBus(bus);
    }
    
 // ✅ Update bus (only if owned by current operator)
    @PreAuthorize("hasAuthority('OPERATOR')")
    @PutMapping("/my-buses/update")
    public Bus updateBus(@RequestBody Bus bus) {
        int operatorId = getCurrentOperatorId();
        return service.updateBusForOperator(bus, operatorId);
    }

    // ✅ Delete bus (only if owned by current operator)
    @PreAuthorize("hasAuthority('OPERATOR')")
    @DeleteMapping("/my-buses/delete/{busId}")
    public String deleteBus(@PathVariable int busId) {
        int operatorId = getCurrentOperatorId();
        return service.deleteBusForOperator(busId, operatorId);
    }
    
    @PreAuthorize("hasAuthority('OPERATOR')")
    @PostMapping("/my-routes/add")
    public Route addRoute(@RequestBody RouteDto dto) {
        int operatorId = getCurrentOperatorId();
        Bus bus = service.getBusById(dto.getBusId()); // make sure service has this method

        // Check ownership
        if (bus.getOperator().getOperatorId() != operatorId) {
            throw new RuntimeException("Not authorized to add route for this bus");
        }

        Route route = dto.toEntity();
        route.setBus(bus);
        return service.addRoute(route);
    }

    @PreAuthorize("hasAuthority('OPERATOR')")
    @PutMapping("/my-routes/update")
    public Route updateRoute(@RequestBody RouteDto dto) {
        int operatorId = getCurrentOperatorId();
        return service.updateRouteForOperator(dto.toEntity(), operatorId);
    }

    @PreAuthorize("hasAuthority('OPERATOR')")
    @DeleteMapping("/my-routes/delete/{routeId}")
    public String deleteRoute(@PathVariable int routeId) {
        int operatorId = getCurrentOperatorId();
        return service.deleteRouteForOperator(routeId, operatorId);
    }
}



