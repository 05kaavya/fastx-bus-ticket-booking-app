package com.hexaware.fastx.restcontroller;

import com.hexaware.fastx.dto.BookingDto;
import com.hexaware.fastx.entities.Booking;
import com.hexaware.fastx.service.IBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingRestController {

    @Autowired
    private IBookingService service;

    @PostMapping("/add")
    public Booking addBooking(@RequestBody BookingDto dto) {
        Booking booking = dto.toEntity();
        return service.addBooking(booking);
    }

    @PutMapping("/update")
    public Booking updateBooking(@RequestBody BookingDto dto) {
        Booking booking = dto.toEntity();
        return service.updateBooking(booking);
    }

    @GetMapping("/get/{bookingId}")
    public Booking getBookingById(@PathVariable int bookingId) {
        return service.getBookingById(bookingId);
    }

    @GetMapping("/getall")
    public List<Booking> getAllBookings() {
        return service.getAllBookings();
    }

    @DeleteMapping("/delete/{bookingId}")
    public String deleteBooking(@PathVariable int bookingId) {
        return service.deleteByBookingId(bookingId);
    }
}

