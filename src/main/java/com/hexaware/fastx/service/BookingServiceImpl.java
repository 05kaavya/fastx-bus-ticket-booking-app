package com.hexaware.fastx.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.fastx.entities.Booking;
import com.hexaware.fastx.repository.BookingRepository;

@Service
public class BookingServiceImpl implements IBookingService {

    @Autowired
    BookingRepository bookingRepository;

    @Override
    public Booking addBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    @Override
    public Booking updateBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    @Override
    public Booking getBookingById(int bookingId) {
        return bookingRepository.findById(bookingId).orElse(null);
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public String deleteByBookingId(int bookingId) {
        bookingRepository.deleteById(bookingId);
        return "Booking deleted successfully: " + bookingId;
    }
}
