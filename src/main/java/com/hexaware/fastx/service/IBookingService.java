package com.hexaware.fastx.service;

import java.util.List;

import com.hexaware.fastx.dto.BookingDto;
import com.hexaware.fastx.entities.Booking;

public interface IBookingService {

	public Booking addBooking(BookingDto bookingDto);
	public Booking updateBooking(Booking booking);
    public Booking getBookingById(int bookingId);
    public List<Booking> getAllBookings();
    public String deleteByBookingId(int bookingId);
    public List<Booking> getBookingsByUserEmail(String email);

     
}