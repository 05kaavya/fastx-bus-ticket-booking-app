package com.hexaware.fastx.service;

import java.util.List;

import com.hexaware.fastx.entities.BookingSeat;

public interface IBookingSeatService {

	    public BookingSeat assignSeat(BookingSeat bookingSeat);
	    public List<BookingSeat> getSeatsByBookingId(int bookingId);
}

