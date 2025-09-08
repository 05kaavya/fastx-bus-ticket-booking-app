package com.hexaware.fastx.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.fastx.dto.BookingDto;
import com.hexaware.fastx.entities.Booking;
import com.hexaware.fastx.entities.Route;
import com.hexaware.fastx.entities.Seat;
import com.hexaware.fastx.entities.User;
import com.hexaware.fastx.exception.ResourceNotFoundException;
import com.hexaware.fastx.repository.BookingRepository;
import com.hexaware.fastx.repository.RouteRepository;
import com.hexaware.fastx.repository.SeatRepository;
import com.hexaware.fastx.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Service implementation for managing bookings in the system.
 * 
 * Responsibilities:
 * - Create new bookings
 * - Update existing bookings
 * - Retrieve bookings by ID or fetch all bookings
 * - Delete bookings by their ID
 * 
 * Utilizes BookingRepository for database operations.
 * Throws ResourceNotFoundException if the requested booking does not exist.
 * 
 * Logging via Lombok's @Slf4j is used to record booking creation, update, retrieval, and deletion activities.
 * 
 */

@Slf4j
@Service
public class BookingServiceImpl implements IBookingService {

    @Autowired
    BookingRepository bookingRepository;
    
    @Autowired
    SeatRepository seatRepository;
    

    @Autowired
    UserRepository userRepository;

    @Autowired
    RouteRepository routeRepository;

	/*
	 * @Override public Booking addBooking(Booking booking) {
	 * log.info("Adding booking for user ID: {}", booking.getUser().getUserId());
	 * 
	 * return bookingRepository.save(booking); }
	 */
    
    @Override
    public Booking addBooking(BookingDto bookingDto) {
        log.info("Adding booking for user ID: {}", bookingDto.getUserId());

        User user = userRepository.findById(bookingDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + bookingDto.getUserId()));

        Route route = routeRepository.findById(bookingDto.getRouteId())
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with ID: " + bookingDto.getRouteId()));

        Booking booking = bookingDto.toEntity();
        booking.setUser(user);
        booking.setRoute(route);
        
     // ✅ Fix passenger count
        if (bookingDto.getPassengerCount() > 0) {
            booking.setPassengerCount(bookingDto.getPassengerCount());
        } else if (booking.getSeats() != null) {
            booking.setPassengerCount(booking.getSeats().size());
        }

        
        if (bookingDto.getSeatIds() != null && !bookingDto.getSeatIds().isEmpty()) {
            List<Seat> seats = seatRepository.findAllById(bookingDto.getSeatIds());
            booking.setSeats(seats);
        }
        
        return bookingRepository.save(booking);
    }

    @Override
    public Booking updateBooking(Booking booking) {
        log.info("Updating booking ID: {}", booking.getBookingId());

    	if (!bookingRepository.existsById(booking.getBookingId())) {
            throw new ResourceNotFoundException("Booking not found with ID: " + booking.getBookingId());
        }
        return bookingRepository.save(booking);
    }

    @Override
    public Booking getBookingById(int bookingId) {
    	log.info("Fetching booking by ID: {}", bookingId);
        return bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
    }

    @Override
    public List<Booking> getAllBookings() {
    	log.info("Fetching all bookings");
    	List<Booking> bookings = bookingRepository.findAll();
        if (bookings.isEmpty()) {
            throw new ResourceNotFoundException("No bookings found");
        }
        return bookings;
    }

    @Override
    public String deleteByBookingId(int bookingId) {
    	log.info("Deleting booking with ID: {}", bookingId);
    	Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
    	bookingRepository.delete(booking);
       
        return "Booking deleted successfully " ;
    }
    
    @Override
    public List<Booking> findBookingsByUserEmail(String email) {
        return bookingRepository.findByUserEmail(email);
    }
	/*
	 * @Override public List<Booking> getBookingsByUserEmail(String email) { User
	 * user = userRepository.findByEmail(email).orElseThrow(); return
	 * bookingRepository.findByUser(user); }
	 */
}
