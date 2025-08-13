package com.hexaware.fastx.restcontroller;

import com.hexaware.fastx.dto.SeatDto;
import com.hexaware.fastx.entities.Seat;
import com.hexaware.fastx.service.ISeatService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/seats")
public class SeatRestController {

    @Autowired
    private ISeatService service;

    @PostMapping("/add")
    public Seat addSeat(@RequestBody SeatDto dto) {
    	 log.info("Adding seat: {}", dto.getSeatNumber());
         return service.addSeat(dto.toEntity());
     }

    @PutMapping("/update")
    public Seat updateSeat(@RequestBody SeatDto dto) {
    	 log.info("Updating seat ID: {}", dto.getSeatId());
         return service.updateSeat(dto.toEntity());
     }

    @GetMapping("/bus/{busId}")
    public List<Seat> getSeatsByBusId(@PathVariable int busId) {
    	log.info("Fetching seats for bus ID: {}", busId);
        return service.getSeatsByBusId(busId);
    }

    @DeleteMapping("/delete/{seatId}")
    public String deleteSeat(@PathVariable int seatId) {
    	log.info("Deleting seat ID: {}", seatId);
        return service.deleteSeat(seatId);
    }

    @GetMapping("/bus/{busId}/status/{seatStatus}")
    public List<Seat> getSeatsByBusIdAndSeatStatus(@PathVariable int busId, @PathVariable String seatStatus) {
    	log.info("Fetching seats for bus ID: {} with status: {}", busId, seatStatus);
        return service.getSeatsByBusIdAndSeatStatus(busId, seatStatus);
    }

    @GetMapping("/bus/{busId}/type/{seatType}")
    public List<Seat> getSeatsByBusIdAndSeatType(@PathVariable int busId, @PathVariable String seatType) {
        log.info("Fetching seats for bus ID: {} with type: {}", busId, seatType);
        return service.getSeatsByBusIdAndSeatType(busId, seatType);
    }

    @GetMapping("/status/{seatStatus}")
    public List<Seat> getSeatsBySeatStatus(@PathVariable String seatStatus) {
    	 log.info("Fetching seats with status: {}", seatStatus);
        return service.getSeatsBySeatStatus(seatStatus);
    }

    @GetMapping("/type/{seatType}")
    public List<Seat> getSeatsBySeatType(@PathVariable String seatType) {
    	log.info("Fetching seats with type: {}", seatType);
        return service.getSeatsBySeatType(seatType);
    }
}

