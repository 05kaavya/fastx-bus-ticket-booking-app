package com.hexaware.fastx.service;

import java.math.BigDecimal;
import java.sql.Timestamp;
//import java.time.LocalDate;
import java.util.List;

import com.hexaware.fastx.dto.BookingDto;
import com.hexaware.fastx.dto.PaymentDto;
import com.hexaware.fastx.entities.Booking;
import com.hexaware.fastx.entities.Payment;

public interface IPaymentService {

	//public Payment processBookingAndPayment(BookingDto bookingDto,PaymentDto paymentDto);
	public Payment getPaymentByBookingId(int bookingId);
	public List<Payment> getPaymentsByUserId(int userId);
	public List<Payment> getPaymentsByPaymentStatus(String paymentStatus);
	public BigDecimal getTotalRevenueByDate(Timestamp paymentDate);
	public boolean isPaymentSuccessfulForBooking(int bookingId);
	public byte[] generateTicketPdf(int paymentId);
	
	public Payment createPayment(PaymentDto paymentDto, Booking booking);
}

