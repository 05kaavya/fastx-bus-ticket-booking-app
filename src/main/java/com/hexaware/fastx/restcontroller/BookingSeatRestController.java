package com.hexaware.fastx.restcontroller;

import com.hexaware.fastx.dto.BookingSeatDto;
import com.hexaware.fastx.entities.BookingSeat;
import com.hexaware.fastx.service.IBookingSeatService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/booking-seats")
@Slf4j
public class BookingSeatRestController {

    @Autowired
    private IBookingSeatService service;

    @PostMapping("/assign")
    public BookingSeatDto assignSeat(@RequestBody BookingSeatDto dto) {
        log.info("Assigning seat for booking ID: {}", dto.getBookingId());
        BookingSeat bookingSeat = service.assignSeat(dto.toEntity());
        return BookingSeatDto.fromEntity(bookingSeat);
    }

    @GetMapping("/booking/{bookingId}")
    public List<BookingSeatDto> getSeatsByBookingId(@PathVariable int bookingId) {
        log.info("Fetching seats for booking ID: {}", bookingId);
        return service.getSeatsByBookingId(bookingId)
                      .stream()
                      .map(BookingSeatDto::fromEntity)
                      .toList();
    }
}


/*
 * @Slf4j
 * 
 * @RestController
 * 
 * @RequestMapping("/api/booking-seats") public class BookingSeatRestController
 * {
 * 
 * @Autowired private IBookingSeatService service;
 * 
 * @PostMapping("/assign") public BookingSeat assignSeat(@RequestBody
 * BookingSeatDto dto) { log.info("Assigning seat for booking ID: {}",
 * dto.getBookingId()); return service.assignSeat(dto.toEntity()); }
 * 
 * @GetMapping("/booking/{bookingId}") public List<BookingSeat>
 * getSeatsByBookingId(@PathVariable int bookingId) {
 * log.info("Fetching seats for booking ID: {}", bookingId); return
 * service.getSeatsByBookingId(bookingId); } }
 */