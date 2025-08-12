package com.hexaware.fastx.restcontroller;

import com.hexaware.fastx.dto.PaymentDto;
import com.hexaware.fastx.entities.Payment;
import com.hexaware.fastx.service.IPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.security.Timestamp;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentRestController {

    @Autowired
    private IPaymentService service;

    @PostMapping("/process")
    public Payment processPayment(@RequestBody PaymentDto dto) {
        Payment payment = dto.toEntity();
        return service.processPayment(payment);
    }

    @GetMapping("/booking/{bookingId}")
    public Payment getPaymentByBookingId(@PathVariable int bookingId) {
        return service.getPaymentByBookingId(bookingId);
    }

    @GetMapping("/user/{userId}")
    public List<Payment> getPaymentsByUserId(@PathVariable int userId) {
        return service.getPaymentsByUserId(userId);
    }

    @GetMapping("/status/{paymentStatus}")
    public List<Payment> getPaymentsByPaymentStatus(@PathVariable String paymentStatus) {
        return service.getPaymentsByPaymentStatus(paymentStatus);
    }

    @GetMapping("/totalRevenue/{paymentDate}")
    public BigDecimal getTotalRevenueByDate(@PathVariable Timestamp paymentDate) {
        return service.getTotalRevenueByDate(paymentDate);
    }

    @GetMapping("/isSuccessful/{bookingId}")
    public boolean isPaymentSuccessfulForBooking(@PathVariable int bookingId) {
        return service.isPaymentSuccessfulForBooking(bookingId);
    }
}
