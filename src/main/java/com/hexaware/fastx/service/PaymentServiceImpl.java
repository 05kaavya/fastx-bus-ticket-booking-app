package com.hexaware.fastx.service;

import java.math.BigDecimal;
import java.sql.Timestamp;
//import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.fastx.dto.PaymentDto;
import com.hexaware.fastx.entities.Booking;
import com.hexaware.fastx.entities.Payment;
import com.hexaware.fastx.exception.ResourceNotFoundException;
import com.hexaware.fastx.repository.BookingRepository;
import com.hexaware.fastx.repository.PaymentRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Service implementation for managing and processing payments in the system.
 *
 * Responsibilities:
 * - Process and store new payment records
 * - Retrieve payments by booking ID, user ID, or payment status
 * - Calculate total revenue for a given date
 * - Check if a booking has a successful payment
 *
 *
 * Logging (via Lombok's @Slf4j) is used to track key service actions for
 * debugging, monitoring, and auditing purposes.
 */

@Slf4j
@Service
public class PaymentServiceImpl implements IPaymentService {

    @Autowired
    PaymentRepository paymentRepository;
    
    BookingRepository bookingRepository;

    @Override
    public Payment processPayment(PaymentDto paymentDto) {
    	 Payment payment = new Payment();
    	    payment.setAmountPaid(paymentDto.getAmountPaid());
    	    payment.setPaymentDate(paymentDto.getPaymentDate());
    	    payment.setPaymentStatus(paymentDto.getPaymentStatus());

    	    Booking booking = bookingRepository.findById(paymentDto.getBookingId())
    	        .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
    	    payment.setBooking(booking);

        log.info("Processing payment for booking ID: {}", payment.getBooking().getBookingId());

        return paymentRepository.save(payment);
    }

    @Override
    public Payment getPaymentByBookingId(int bookingId) {
    	log.info("Fetching payment by booking ID: {}", bookingId);
        return paymentRepository.findByBookingBookingId(bookingId) .orElseThrow(() -> new ResourceNotFoundException("Payment not found for booking ID: " + bookingId));
    }

    @Override
    public List<Payment> getPaymentsByUserId(int userId) {
    	log.info("Fetching payments for user ID: {}", userId);
    	List<Payment> payments = paymentRepository.findByBookingUserUserId(userId);
        if (payments.isEmpty()) {
            throw new ResourceNotFoundException("No payments found for user ID: " + userId);
        }
        return payments;
    }

    @Override
    public List<Payment> getPaymentsByPaymentStatus(String paymentStatus) {
    	log.info("Fetching payments with status: {}", paymentStatus);
    	List<Payment> payments = paymentRepository.findByPaymentStatus(paymentStatus);
        if (payments.isEmpty()) {
            throw new ResourceNotFoundException("No payments found with status: " + paymentStatus);
        }
        return payments;
    }

    @Override
    public BigDecimal getTotalRevenueByDate(Timestamp paymentDate) {
    	log.info("Calculating total revenue for date: {}", paymentDate);
        return paymentRepository.findTotalAmountByPaymentDate(paymentDate);
    }

    @Override
    public boolean isPaymentSuccessfulForBooking(int bookingId) {
    	 log.info("Checking payment success for booking ID: {}", bookingId);
        return paymentRepository.existsByBookingBookingIdAndPaymentStatus(bookingId, "Paid");
    }
}