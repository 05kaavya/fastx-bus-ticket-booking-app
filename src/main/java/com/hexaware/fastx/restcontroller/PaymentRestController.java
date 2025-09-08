package com.hexaware.fastx.restcontroller;

import com.hexaware.fastx.dto.BookingDto;
//import com.hexaware.fastx.dto.BookingPaymentRequestDto;
import com.hexaware.fastx.dto.PaymentDto;
import com.hexaware.fastx.entities.Booking;
import com.hexaware.fastx.entities.Payment;
import com.hexaware.fastx.service.IBookingService;
import com.hexaware.fastx.service.IPaymentService;
import com.hexaware.fastx.service.ISeatService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;


import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/payments")
public class PaymentRestController {

    @Autowired
    private IPaymentService service;
    
    @Autowired
    private IBookingService bookingService;
    
    @Autowired
    private ISeatService seatService;
    
    @Autowired
    private ObjectMapper objectMapper;


    /**
     * Process payment + create booking in one API.
     */
    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/process")
    public Map<String, Object> processPayment(
            @Valid @RequestBody Map<String, Object> request) {

        // Extract Booking and Payment DTOs from request
    	BookingDto bookingDto = objectMapper.convertValue(request.get("booking"), BookingDto.class);

        PaymentDto paymentDto = objectMapper.convertValue(request.get("payment"), PaymentDto.class);

        log.info("Processing booking + payment for user: {}", bookingDto.getUserId());

        // 1. Create booking
        Booking booking = bookingService.addBooking(bookingDto);

        // 2. Create payment linked to booking
        Payment payment = service.createPayment(paymentDto, booking);
        

        // 3. Mark seats as booked ✅
        if (bookingDto.getSeatIds() != null && !bookingDto.getSeatIds().isEmpty()) {
            

            seatService.markSeatsAsBooked(
                bookingDto.getSeatIds(),
                bookingDto.getBusId()
            );
        }

        // Response
        Map<String, Object> response = new HashMap<>();
        response.put("booking", booking);
        response.put("payment", payment);
        return response;
    }


    /**
     * Download ticket PDF by paymentId.
     */
    @PreAuthorize("hasAnyAuthority('USER','ADMIN')")
    @GetMapping("/ticket/{paymentId}")
    public ResponseEntity<byte[]> downloadTicket(@PathVariable int paymentId) {
        log.info("Downloading ticket for payment ID: {}", paymentId);

        byte[] pdfBytes = service.generateTicketPdf(paymentId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=eticket.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @PreAuthorize("hasAnyAuthority('USER','ADMIN')")
    @GetMapping("/booking/{bookingId}")
    public Payment getPaymentByBookingId(@PathVariable int bookingId) {
        log.info("Fetching payment for booking ID: {}", bookingId);
        return service.getPaymentByBookingId(bookingId);
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/user/{userId}")
    public List<Payment> getPaymentsByUserId(@PathVariable int userId) {
        return service.getPaymentsByUserId(userId);
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/status/{paymentStatus}")
    public List<Payment> getPaymentsByPaymentStatus(@PathVariable String paymentStatus) {
        log.info("Fetching payments with status: {}", paymentStatus);
        return service.getPaymentsByPaymentStatus(paymentStatus);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/totalRevenue/{paymentDate}")
    public BigDecimal getTotalRevenueByDate(@PathVariable Timestamp paymentDate) {
        return service.getTotalRevenueByDate(paymentDate);
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/isSuccessful/{bookingId}")
    public boolean isPaymentSuccessfulForBooking(@PathVariable int bookingId) {
        log.info("Checking if payment is successful for booking ID: {}", bookingId);
        return service.isPaymentSuccessfulForBooking(bookingId);
    }
}



/*
 * package com.hexaware.fastx.restcontroller;
 * 
 * import com.hexaware.fastx.dto.PaymentDto; import
 * com.hexaware.fastx.entities.Payment; import
 * com.hexaware.fastx.service.IPaymentService;
 * 
 * import jakarta.validation.Valid; import lombok.extern.slf4j.Slf4j;
 * 
 * import org.springframework.beans.factory.annotation.Autowired; import
 * org.springframework.web.bind.annotation.*;
 * 
 * import java.math.BigDecimal; import java.sql.Timestamp; import
 * java.util.List;
 * 
 * @Slf4j
 * 
 * @RestController
 * 
 * @RequestMapping("/api/payments") public class PaymentRestController {
 * 
 * @Autowired private IPaymentService service;
 * 
 * 
 * @PostMapping("/process") public Payment processPayment(@RequestBody @Valid
 * PaymentDto dto) { log.info("Processing payment for user: {} on route: {}",
 * dto.getUserId(), dto.getRouteId()); return service.processPayment(dto); }
 * 
 * 
 * @GetMapping("/booking/{bookingId}") public Payment
 * getPaymentByBookingId(@PathVariable int bookingId) {
 * log.info("Fetching payment for booking ID: {}", bookingId); return
 * service.getPaymentByBookingId(bookingId); }
 * 
 * @GetMapping("/user/{userId}") public List<Payment>
 * getPaymentsByUserId(@PathVariable int userId) { return
 * service.getPaymentsByUserId(userId); }
 * 
 * @GetMapping("/status/{paymentStatus}") public List<Payment>
 * getPaymentsByPaymentStatus(@PathVariable String paymentStatus) {
 * log.info("Fetching payments with status: {}", paymentStatus); return
 * service.getPaymentsByPaymentStatus(paymentStatus); }
 * 
 * @GetMapping("/totalRevenue/{paymentDate}") public BigDecimal
 * getTotalRevenueByDate(@PathVariable Timestamp paymentDate) { return
 * service.getTotalRevenueByDate(paymentDate); }
 * 
 * @GetMapping("/isSuccessful/{bookingId}") public boolean
 * isPaymentSuccessfulForBooking(@PathVariable int bookingId) {
 * log.info("Checking if payment is successful for booking ID: {}", bookingId);
 * return service.isPaymentSuccessfulForBooking(bookingId); } }
 */