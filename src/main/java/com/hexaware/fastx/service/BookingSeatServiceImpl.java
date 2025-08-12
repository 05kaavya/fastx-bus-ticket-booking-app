package com.hexaware.fastx.service;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.fastx.entities.BookingSeat;
import com.hexaware.fastx.repository.BookingSeatRepository;

@Service
public class BookingSeatServiceImpl implements IBookingSeatService {

    @Autowired
    BookingSeatRepository bookingSeatRepository;

    @Override
    public BookingSeat assignSeat(BookingSeat bookingSeat) {
        return bookingSeatRepository.save(bookingSeat);
    }

    @Override
    public List<BookingSeat> getSeatsByBookingId(int bookingId) {
        return bookingSeatRepository.findByBookingBookingId(bookingId);
    }
}