package com.hexaware.fastx.restcontroller;

import com.hexaware.fastx.dto.BusDto;
import com.hexaware.fastx.entities.Bus;
import com.hexaware.fastx.service.IBusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buses")
public class BusRestController {

    @Autowired
    private IBusService service;

    @PostMapping("/add")
    public Bus addBus(@RequestBody BusDto dto) {
        Bus bus = dto.toEntity();
        return service.addBus(bus);
    }

    @GetMapping("/get/{busId}")
    public Bus getBusById(@PathVariable int busId) {
        return service.getBusById(busId);
    }

    @GetMapping("/name/{busName}")
    public Bus getBusByName(@PathVariable String busName) {
        return service.findByName(busName);
    }

    @PutMapping("/update")
    public Bus updateBus(@RequestBody BusDto dto) {
        Bus bus = dto.toEntity();
        return service.updateBus(bus);
    }

    @GetMapping("/getall")
    public List<Bus> getAllBuses() {
        return service.getAllBuses();
    }

    @DeleteMapping("/delete/{busId}")
    public String deleteBus(@PathVariable int busId) {
        return service.deleteBus(busId);
    }
}

