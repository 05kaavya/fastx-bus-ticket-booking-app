package com.hexaware.fastx.restcontroller;

import com.hexaware.fastx.dto.BookingSeatDto;
import com.hexaware.fastx.entities.BookingSeat;
import com.hexaware.fastx.service.IBookingSeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/booking-seats")
public class BookingSeatRestController {

    @Autowired
    private IBookingSeatService service;

    @PostMapping("/assign")
    public BookingSeat assignSeat(@RequestBody BookingSeatDto dto) {
        BookingSeat bookingSeat = dto.toEntity();
        return service.assignSeat(bookingSeat);
    }

    @GetMapping("/booking/{bookingId}")
    public List<BookingSeat> getSeatsByBookingId(@PathVariable int bookingId) {
        return service.getSeatsByBookingId(bookingId);
    }
}
