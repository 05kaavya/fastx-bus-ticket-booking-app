package com.hexaware.fastx.restcontroller;

import com.hexaware.fastx.dto.BusDto;
import com.hexaware.fastx.entities.Bus;
import com.hexaware.fastx.service.IBusService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/buses")
public class BusRestController {

    @Autowired
    private IBusService service;

    @PreAuthorize("hasAuthority('OPERATOR')")
    @PostMapping("/add")
    public Bus addBus(@RequestBody BusDto dto) {
    	 log.info("Adding bus: {}", dto.getBusName());
         return service.addBus(dto.toEntity());
     }
    

    @PreAuthorize("hasAnyAuthority('USER','ADMIN','OPERATOR')")
    @GetMapping("/get/{busId}")
    public Bus getBusById(@PathVariable int busId) {
    	  log.info("Fetching bus ID: {}", busId);
        return service.getBusById(busId);
    }

    @PreAuthorize("hasAnyAuthority('USER','ADMIN','OPERATOR')")
    @GetMapping("/name/{busName}")
    public Bus getBusByName(@PathVariable String busName) {
    	log.info("Fetching bus by name: {}", busName);
        return service.findByName(busName);
    }

    @PreAuthorize("hasAuthority('OPERATOR')")
    @PutMapping("/update")
    public Bus updateBus(@RequestBody BusDto dto) {
    	 log.info("Updating bus ID: {}", dto.getBusId());
         return service.updateBus(dto.toEntity());
     }

    @PreAuthorize("hasAnyAuthority('USER','ADMIN','OPERATOR')")
    @GetMapping("/getall")
    public List<Bus> getAllBuses() {
    	log.info("Fetching all buses");
        return service.getAllBuses();
    }

    @PreAuthorize("hasAuthority('OPERATOR')")
    @DeleteMapping("/delete/{busId}")
    public String deleteBus(@PathVariable int busId) {
    	 log.info("Deleting bus ID: {}", busId);
        return service.deleteBus(busId);
    }
}

