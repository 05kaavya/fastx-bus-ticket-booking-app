package com.hexaware.fastx.restcontroller;

import com.hexaware.fastx.dto.SeatDto;
import com.hexaware.fastx.entities.Seat;
import com.hexaware.fastx.service.ISeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
public class SeatRestController {

    @Autowired
    private ISeatService service;

    @PostMapping("/add")
    public Seat addSeat(@RequestBody SeatDto dto) {
        Seat seat = dto.toEntity();
        return service.addSeat(seat);
    }

    @PutMapping("/update")
    public Seat updateSeat(@RequestBody SeatDto dto) {
        Seat seat = dto.toEntity();
        return service.updateSeat(seat);
    }

    @GetMapping("/bus/{busId}")
    public List<Seat> getSeatsByBusId(@PathVariable int busId) {
        return service.getSeatsByBusId(busId);
    }

    @DeleteMapping("/delete/{seatId}")
    public String deleteSeat(@PathVariable int seatId) {
        return service.deleteSeat(seatId);
    }

    @GetMapping("/bus/{busId}/status/{seatStatus}")
    public List<Seat> getSeatsByBusIdAndSeatStatus(@PathVariable int busId, @PathVariable String seatStatus) {
        return service.getSeatsByBusIdAndSeatStatus(busId, seatStatus);
    }

    @GetMapping("/bus/{busId}/type/{seatType}")
    public List<Seat> getSeatsByBusIdAndSeatType(@PathVariable int busId, @PathVariable String seatType) {
        return service.getSeatsByBusIdAndSeatType(busId, seatType);
    }

    @GetMapping("/status/{seatStatus}")
    public List<Seat> getSeatsBySeatStatus(@PathVariable String seatStatus) {
        return service.getSeatsBySeatStatus(seatStatus);
    }

    @GetMapping("/type/{seatType}")
    public List<Seat> getSeatsBySeatType(@PathVariable String seatType) {
        return service.getSeatsBySeatType(seatType);
    }
}

