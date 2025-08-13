package com.hexaware.fastx.service;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.fastx.entities.BookingSeat;
import com.hexaware.fastx.exception.ResourceNotFoundException;
import com.hexaware.fastx.repository.BookingSeatRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class BookingSeatServiceImpl implements IBookingSeatService {

    @Autowired
    BookingSeatRepository bookingSeatRepository;

    @Override
    public BookingSeat assignSeat(BookingSeat bookingSeat) {
    	log.info("Assigning seat {} for booking ID: {}", 
                bookingSeat.getSeat().getSeatNumber(), 
                bookingSeat.getBooking().getBookingId());
        return bookingSeatRepository.save(bookingSeat);
    }

    @Override
    public List<BookingSeat> getSeatsByBookingId(int bookingId) {
    	log.info("Fetching seats for booking ID: {}", bookingId);
    	 List<BookingSeat> bookingSeats = bookingSeatRepository.findByBookingBookingId(bookingId);
         if (bookingSeats.isEmpty()) {
             throw new ResourceNotFoundException("No seats found for booking ID: " + bookingId);
         }
        return bookingSeats;
    }
}