package com.hexaware.fastx.service;

import java.math.BigDecimal;
import java.security.Timestamp;
//import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.fastx.entities.Payment;
import com.hexaware.fastx.repository.PaymentRepository;

@Service
public class PaymentServiceImpl implements IPaymentService {

    @Autowired
    PaymentRepository paymentRepository;

    @Override
    public Payment processPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    @Override
    public Payment getPaymentByBookingId(int bookingId) {
        return paymentRepository.findByBookingBookingId(bookingId);
    }

    @Override
    public List<Payment> getPaymentsByUserId(int userId) {
        return paymentRepository.findByBookingUserUserId(userId);
    }

    @Override
    public List<Payment> getPaymentsByPaymentStatus(String paymentStatus) {
        return paymentRepository.findByPaymentStatus(paymentStatus);
    }

    @Override
    public BigDecimal getTotalRevenueByDate(Timestamp paymentDate) {
        return paymentRepository.findTotalAmountByPaymentDate(paymentDate);
    }

    @Override
    public boolean isPaymentSuccessfulForBooking(int bookingId) {
        return paymentRepository.existsByBookingBookingIdAndPaymentStatus(bookingId, "Paid");
    }
}