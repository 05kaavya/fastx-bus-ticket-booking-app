package com.hexaware.fastx.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.fastx.entities.Booking;
import com.hexaware.fastx.exception.ResourceNotFoundException;
import com.hexaware.fastx.repository.BookingRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class BookingServiceImpl implements IBookingService {

    @Autowired
    BookingRepository bookingRepository;

    @Override
    public Booking addBooking(Booking booking) {
        log.info("Adding booking for user ID: {}", booking.getUser().getUserId());

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
}
