package com.hexaware.fastx.service;

import java.math.BigDecimal;
import java.sql.Timestamp;
//import java.time.LocalDate;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.hexaware.fastx.dto.PaymentDto;
import com.hexaware.fastx.entities.Booking;
import com.hexaware.fastx.entities.Payment;
import com.hexaware.fastx.exception.ResourceNotFoundException;
import com.hexaware.fastx.repository.BookingRepository;
import com.hexaware.fastx.repository.PaymentRepository;
import com.itextpdf.io.source.ByteArrayOutputStream;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;
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
    
    @Autowired
    BookingRepository bookingRepository;
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Override
    public Payment processPayment(PaymentDto paymentDto) {
        // Fetch the managed booking entity
        Booking booking = bookingRepository.findById(paymentDto.getBookingId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Booking not found with ID: " + paymentDto.getBookingId()));

        // Convert DTO to entity with booking
        Payment payment = paymentDto.toEntity(booking);
        Payment savedPayment = paymentRepository.save(payment);
        
        log.info("Processing payment for booking ID: {}", booking.getBookingId());
        
        // ✅ Generate e-ticket PDF + send email if payment is successful
        if ("Success".equalsIgnoreCase(savedPayment.getPaymentStatus())) {
            try {
                sendETicket(savedPayment);
            } catch (Exception e) {
                log.error("Failed to send e-ticket: {}", e.getMessage());
            }
        }

        return paymentRepository.save(payment);
    }
    
 // 👉 Helper method: generate PDF and email it
    public void sendETicket(Payment payment) throws Exception {
        Booking booking = payment.getBooking();

        // 1. Generate PDF in memory
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("🎟️ FastX E-Ticket"));
        document.add(new Paragraph("Booking ID: " + booking.getBookingId()));
        document.add(new Paragraph("User: " + booking.getUser().getName()));
        document.add(new Paragraph("Route: " + booking.getRoute().getOrigin() + " → " + booking.getRoute().getDestination()));
        document.add(new Paragraph("Total Paid: ₹" + payment.getAmountPaid()));
        document.add(new Paragraph("Status: " + payment.getPaymentStatus()));

        document.close();
        
     // 2. Send email
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(booking.getUser().getEmail());
        helper.setSubject("Your FastX E-Ticket");
        helper.setText("Hi " + booking.getUser().getName() + ",\n\nPlease find your E-Ticket attached.", false);

     // attach PDF
        helper.addAttachment("eticket.pdf", new ByteArrayDataSource(baos.toByteArray(), "application/pdf"));

        mailSender.send(message);

        log.info("✅ E-ticket sent to {}", booking.getUser().getEmail());
    }
	/*
	 * @Override public Payment processPayment(PaymentDto paymentDto) { Payment
	 * payment = new Payment(); payment.setAmountPaid(paymentDto.getAmountPaid());
	 * payment.setPaymentDate(paymentDto.getPaymentDate());
	 * payment.setPaymentStatus(paymentDto.getPaymentStatus());
	 * 
	 * Booking booking = bookingRepository.findById(paymentDto.getBookingId())
	 * .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
	 * payment.setBooking(booking);
	 * 
	 * log.info("Processing payment for booking ID: {}",
	 * payment.getBooking().getBookingId());
	 * 
	 * return paymentRepository.save(payment); }
	 */

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