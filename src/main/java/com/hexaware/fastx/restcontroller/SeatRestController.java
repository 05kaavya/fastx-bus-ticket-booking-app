package com.hexaware.fastx.restcontroller;

import com.hexaware.fastx.dto.SeatAvailabilityRequest;
import com.hexaware.fastx.dto.SeatDto;
import com.hexaware.fastx.entities.Seat;
//import com.hexaware.fastx.entities.Seat;
import com.hexaware.fastx.service.ISeatService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

//import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/seats")
public class SeatRestController {

    @Autowired
    private ISeatService service;

    @PreAuthorize("hasAuthority('OPERATOR')")
    @PostMapping("/add")
    public SeatDto addSeat(@RequestBody SeatDto dto) {
    	 log.info("Adding seat: {}", dto.getSeatNumber());
         return SeatDto.fromEntity(service.addSeat(dto));
     }

    @PreAuthorize("hasAuthority('OPERATOR')")
    @PutMapping("/update")
    public SeatDto updateSeat(@RequestBody SeatDto dto) {
    	 log.info("Updating seat ID: {}", dto.getSeatId());
    	 return SeatDto.fromEntity(service.updateSeat(dto));
     }

    @PreAuthorize("hasAnyAuthority('USER','ADMIN','OPERATOR')")
    @GetMapping("/bus/{busId}")
    public List<SeatDto> getSeatsByBusId(@PathVariable int busId) {
    	log.info("Fetching seats for bus ID: {}", busId);
    	 return service.getSeatsByBusId(busId)
                 .stream()
                 .map(SeatDto::fromEntity)
                 .toList();
    }

    @PreAuthorize("hasAuthority('OPERATOR')")
    @DeleteMapping("/delete/{seatId}")
    public String deleteSeat(@PathVariable int seatId) {
    	log.info("Deleting seat ID: {}", seatId);
        return service.deleteSeat(seatId);
    }

    @PreAuthorize("hasAnyAuthority('USER','ADMIN','OPERATOR')")
    @GetMapping("/bus/{busId}/status/{seatStatus}")
    public List<SeatDto> getSeatsByBusIdAndSeatStatus(@PathVariable int busId, @PathVariable String seatStatus) {
    	log.info("Fetching seats for bus ID: {} with status: {}", busId, seatStatus);
    	 return service.getSeatsByBusIdAndSeatStatus(busId, seatStatus)
                 .stream()
                 .map(SeatDto::fromEntity)
                 .toList();    }

    @PreAuthorize("hasAnyAuthority('USER','ADMIN','OPERATOR')")
    @GetMapping("/bus/{busId}/type/{seatType}")
    public List<SeatDto> getSeatsByBusIdAndSeatType(@PathVariable int busId, @PathVariable String seatType) {
        log.info("Fetching seats for bus ID: {} with type: {}", busId, seatType);
        return service.getSeatsByBusIdAndSeatType(busId, seatType)
                .stream()
                .map(SeatDto::fromEntity)
                .toList();
    }

    
    @PreAuthorize("hasAnyAuthority('USER','ADMIN','OPERATOR')")
    @GetMapping("/status/{seatStatus}")
    public List<SeatDto> getSeatsBySeatStatus(@PathVariable String seatStatus) {
    	 log.info("Fetching seats with status: {}", seatStatus);
    	 return service.getSeatsBySeatStatus(seatStatus)
                 .stream()
                 .map(SeatDto::fromEntity)
                 .toList();
    }

    @PreAuthorize("hasAnyAuthority('USER','ADMIN','OPERATOR')")
    @GetMapping("/type/{seatType}")
    public List<SeatDto> getSeatsBySeatType(@PathVariable String seatType) {
    	log.info("Fetching seats with type: {}", seatType);
    	 return service.getSeatsBySeatType(seatType)
                 .stream()
                 .map(SeatDto::fromEntity)
                 .toList();
    }
    
    // New endpoint: Get seats by bus ID and specific date
    @PreAuthorize("hasAnyAuthority('USER','ADMIN','OPERATOR')")
    @GetMapping("/bus/{busId}/date/{date}")
    public ResponseEntity<List<Seat>> getSeatsByBusAndDate(
            @PathVariable int busId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(service.getSeatsByBusIdAndDate(busId, date));
    }


    // New endpoint: Verify seat availability for specific date
    @PreAuthorize("hasAnyAuthority('USER','ADMIN','OPERATOR')")
    @PostMapping("/verify-availability")
    public ResponseEntity<Map<String, Object>> verifySeatsAvailability(@RequestBody SeatAvailabilityRequest request) {
        log.info("Verifying seat availability for bus ID: {}, date: {}, seat IDs: {}", 
                request.getBusId(), request.getDate(), request.getSeatIds());
        
        Map<String, Object> result = service.verifySeatsAvailability(
                request.getBusId(), 
                request.getDate(), 
                request.getSeatIds()
        );
        
        return ResponseEntity.ok(result);
    }

    // New endpoint: Bulk update seats for a bus
    @PreAuthorize("hasAnyAuthority('USER','ADMIN','OPERATOR')")
    @PostMapping("/bus/{busId}/bulk")
    public ResponseEntity<String> bulkUpdateSeats(
            @PathVariable int busId,
            @RequestBody List<SeatDto> seats) {
        log.info("Bulk updating {} seats for bus ID: {}", seats.size(), busId);
        service.bulkUpdateSeats(busId, seats);
        return ResponseEntity.ok("Seats updated successfully");
    }

    // New endpoint: Update seat status
    @PreAuthorize("hasAuthority('OPERATOR')")
    @PutMapping("/{seatId}/status")
    public ResponseEntity<SeatDto> updateSeatStatus(
            @PathVariable int seatId,
            @RequestParam String status) {
        log.info("Updating seat ID: {} status to: {}", seatId, status);
        SeatDto updatedSeat = SeatDto.fromEntity(service.updateSeatStatus(seatId, status));
        return ResponseEntity.ok(updatedSeat);
    }
}

