package com.hexaware.fastx.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.hexaware.fastx.entities.Cancellation;


public interface ICancellationService {
	
	public Cancellation cancelBooking(Cancellation cancellation);
    public Cancellation getCancellationByBookingId(int bookingId);
    public List<Cancellation> getCancellationsByUserId(int userId);
    public List<Cancellation> getCancellationsByStatus(String refundStatus);
    public boolean isBookingCancelled(int bookingId);
    public BigDecimal getTotalRefundsIssuedByDate(LocalDate cancellationDate);

}