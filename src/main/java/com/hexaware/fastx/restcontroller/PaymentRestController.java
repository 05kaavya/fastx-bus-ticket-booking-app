package com.hexaware.fastx.restcontroller;

import com.hexaware.fastx.dto.PaymentDto;
import com.hexaware.fastx.entities.Payment;
import com.hexaware.fastx.service.IPaymentService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/payments")
public class PaymentRestController {

    @Autowired
    private IPaymentService service;

    @PostMapping("/process")
    public Payment processPayment(@RequestBody PaymentDto dto) {
    	 log.info("Processing payment for booking ID: {}", dto.getBookingId());
         return service.processPayment(dto.toEntity());
     }

    @GetMapping("/booking/{bookingId}")
    public Payment getPaymentByBookingId(@PathVariable int bookingId) {
    	log.info("Fetching payment for booking ID: {}", bookingId);
        return service.getPaymentByBookingId(bookingId);
    }

    @GetMapping("/user/{userId}")
    public List<Payment> getPaymentsByUserId(@PathVariable int userId) {
        return service.getPaymentsByUserId(userId);
    }

    @GetMapping("/status/{paymentStatus}")
    public List<Payment> getPaymentsByPaymentStatus(@PathVariable String paymentStatus) {
    	log.info("Fetching payments with status: {}", paymentStatus);
        return service.getPaymentsByPaymentStatus(paymentStatus);
    }

    @GetMapping("/totalRevenue/{paymentDate}")
    public BigDecimal getTotalRevenueByDate(@PathVariable Timestamp paymentDate) {
        return service.getTotalRevenueByDate(paymentDate);
    }

    @GetMapping("/isSuccessful/{bookingId}")
    public boolean isPaymentSuccessfulForBooking(@PathVariable int bookingId) {
    	log.info("Checking if payment is successful for booking ID: {}", bookingId);
        return service.isPaymentSuccessfulForBooking(bookingId);
    }
}
