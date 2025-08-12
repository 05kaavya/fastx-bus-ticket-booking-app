package com.hexaware.fastx.service;

import java.util.List;

import com.hexaware.fastx.entities.Booking;

public interface IBookingService {

	public Booking addBooking(Booking booking);
	public Booking updateBooking(Booking booking);
    public Booking getBookingById(int bookingId);
    public List<Booking> getAllBookings();
    public String deleteByBookingId(int bookingId);
     
}