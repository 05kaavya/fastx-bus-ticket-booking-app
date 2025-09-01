package com.hexaware.fastx.restcontroller;

import com.hexaware.fastx.dto.SeatDto;
//import com.hexaware.fastx.entities.Seat;
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
    public SeatDto addSeat(@RequestBody SeatDto dto) {
    	 log.info("Adding seat: {}", dto.getSeatNumber());
         return SeatDto.fromEntity(service.addSeat(dto));
     }

    @PutMapping("/update")
    public SeatDto updateSeat(@RequestBody SeatDto dto) {
    	 log.info("Updating seat ID: {}", dto.getSeatId());
    	 return SeatDto.fromEntity(service.updateSeat(dto));
     }

    @GetMapping("/bus/{busId}")
    public List<SeatDto> getSeatsByBusId(@PathVariable int busId) {
    	log.info("Fetching seats for bus ID: {}", busId);
    	 return service.getSeatsByBusId(busId)
                 .stream()
                 .map(SeatDto::fromEntity)
                 .toList();
    }

    @DeleteMapping("/delete/{seatId}")
    public String deleteSeat(@PathVariable int seatId) {
    	log.info("Deleting seat ID: {}", seatId);
        return service.deleteSeat(seatId);
    }

    @GetMapping("/bus/{busId}/status/{seatStatus}")
    public List<SeatDto> getSeatsByBusIdAndSeatStatus(@PathVariable int busId, @PathVariable String seatStatus) {
    	log.info("Fetching seats for bus ID: {} with status: {}", busId, seatStatus);
    	 return service.getSeatsByBusIdAndSeatStatus(busId, seatStatus)
                 .stream()
                 .map(SeatDto::fromEntity)
                 .toList();    }

    @GetMapping("/bus/{busId}/type/{seatType}")
    public List<SeatDto> getSeatsByBusIdAndSeatType(@PathVariable int busId, @PathVariable String seatType) {
        log.info("Fetching seats for bus ID: {} with type: {}", busId, seatType);
        return service.getSeatsByBusIdAndSeatType(busId, seatType)
                .stream()
                .map(SeatDto::fromEntity)
                .toList();
    }

    @GetMapping("/status/{seatStatus}")
    public List<SeatDto> getSeatsBySeatStatus(@PathVariable String seatStatus) {
    	 log.info("Fetching seats with status: {}", seatStatus);
    	 return service.getSeatsBySeatStatus(seatStatus)
                 .stream()
                 .map(SeatDto::fromEntity)
                 .toList();
    }

    @GetMapping("/type/{seatType}")
    public List<SeatDto> getSeatsBySeatType(@PathVariable String seatType) {
    	log.info("Fetching seats with type: {}", seatType);
    	 return service.getSeatsBySeatType(seatType)
                 .stream()
                 .map(SeatDto::fromEntity)
                 .toList();
    }
}

