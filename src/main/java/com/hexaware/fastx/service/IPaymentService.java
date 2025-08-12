package com.hexaware.fastx.service;

import java.math.BigDecimal;
import java.security.Timestamp;
//import java.time.LocalDate;
import java.util.List;

import com.hexaware.fastx.entities.Payment;

public interface IPaymentService {

	public Payment processPayment(Payment payment);
	public Payment getPaymentByBookingId(int bookingId);
	public List<Payment> getPaymentsByUserId(int userId);
	public List<Payment> getPaymentsByPaymentStatus(String paymentStatus);
	public BigDecimal getTotalRevenueByDate(Timestamp paymentDate);
	public boolean isPaymentSuccessfulForBooking(int bookingId);
}

