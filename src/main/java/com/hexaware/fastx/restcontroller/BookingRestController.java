package com.hexaware.fastx.restcontroller;

import com.hexaware.fastx.dto.BookingDto;
import com.hexaware.fastx.entities.Booking;
import com.hexaware.fastx.service.IBookingService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/bookings")
public class BookingRestController {

    @Autowired
    private IBookingService service;

    @PostMapping("/add")
    public Booking addBooking( @Valid @RequestBody BookingDto dto) {
    	   log.info("Adding booking for user ID: {}", dto.getUserId());
           return service.addBooking(dto);
       }

    @PutMapping("/update")
    public Booking updateBooking( @Valid @RequestBody BookingDto dto) {
    	 log.info("Updating booking ID: {}", dto.getBookingId());
         return service.updateBooking(dto.toEntity());
     }

    @GetMapping("/get/{bookingId}")
    public Booking getBookingById(@PathVariable int bookingId) {
    	log.info("Fetching booking by ID: {}", bookingId);
        return service.getBookingById(bookingId);
    }

    @GetMapping("/getall")
    public List<Booking> getAllBookings() {
    	log.info("Fetching all bookings");
        return service.getAllBookings();
    }

    @DeleteMapping("/delete/{bookingId}")
    public String deleteBooking(@PathVariable int bookingId) {
    	log.info("Deleting booking ID: {}", bookingId);
        return service.deleteByBookingId(bookingId);
    }
    
 // ✅ Return bookings for the logged-in user
    @GetMapping("/my")
    public List<Booking> getMyBookings(Authentication authentication) {
        String email = authentication.getName(); 
        return service.findBookingsByUserEmail(email);
    }
    
	/*
	 * @GetMapping("/my") public List<Booking>
	 * getMyBookings(@AuthenticationPrincipal
	 * org.springframework.security.core.userdetails.User userDetails) {
	 * log.info("Fetching bookings for logged-in user: {}",
	 * userDetails.getUsername()); return
	 * service.getBookingsByUserEmail(userDetails.getUsername()); // implement this
	 * in service }
	 */


}

