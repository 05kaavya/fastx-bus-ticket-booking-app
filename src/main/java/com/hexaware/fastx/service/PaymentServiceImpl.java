package com.hexaware.fastx.service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.hexaware.fastx.dto.BookingDto;
import com.hexaware.fastx.dto.PaymentDto;
import com.hexaware.fastx.entities.Booking;
import com.hexaware.fastx.entities.Payment;
import com.hexaware.fastx.entities.Route;
import com.hexaware.fastx.entities.User;
import com.hexaware.fastx.exception.ResourceNotFoundException;
import com.hexaware.fastx.repository.BookingRepository;
import com.hexaware.fastx.repository.PaymentRepository;
import com.hexaware.fastx.repository.RouteRepository;
import com.hexaware.fastx.repository.UserRepository;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import org.springframework.transaction.annotation.Transactional;

import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PaymentServiceImpl implements IPaymentService {

    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    BookingRepository bookingRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RouteRepository routeRepository;

    @Autowired
    private JavaMailSender mailSender;

    

    @Override
    @Transactional
    public Payment createPayment(PaymentDto paymentDto, Booking booking) {

        Payment payment = new Payment();
        payment.setAmountPaid(paymentDto.getAmountPaid());
        payment.setPaymentDate(paymentDto.getPaymentDate() != null 
                ? paymentDto.getPaymentDate() 
                : Timestamp.from(Instant.now()));
        payment.setPaymentStatus(paymentDto.getPaymentStatus());
        payment.setPaymentMethod(paymentDto.getPaymentMethod());
        payment.setBooking(booking);

        Payment savedPayment = paymentRepository.save(payment);

        // Send e-ticket if payment successful
        if ("Success".equalsIgnoreCase(savedPayment.getPaymentStatus())) {
            try {
                sendETicket(savedPayment);
            } catch (Exception e) {
                log.error("Failed to send e-ticket: {}", e.getMessage());
            }
        }

        return savedPayment;
    }



    // Reusable PDF generator (for email + download)
    public byte[] generateTicketPdf(Payment payment) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            Booking booking = payment.getBooking();

            document.add(new Paragraph("🎟️ FastX E-Ticket"));
            document.add(new Paragraph("Booking ID: " + booking.getBookingId()));
            document.add(new Paragraph("User: " + booking.getUser().getName()));
            document.add(new Paragraph("Email: " + booking.getUser().getEmail()));
            document.add(new Paragraph("Route: " + booking.getRoute().getOrigin() + " → " + booking.getRoute().getDestination()));
            document.add(new Paragraph("Travel Date: " + booking.getTravelDate()));
            document.add(new Paragraph("Total Paid: ₹" + payment.getAmountPaid()));
            document.add(new Paragraph("Payment ID: " + payment.getPaymentId()));
            document.add(new Paragraph("Status: " + payment.getPaymentStatus()));

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("Error generating PDF: {}", e.getMessage());
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    // Convenience wrapper for REST controller
    public byte[] generateTicketPdf(int paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + paymentId));
        return generateTicketPdf(payment);
    }

    public void sendETicket(Payment payment) throws Exception {
        Booking booking = payment.getBooking();

        // 1. Generate PDF in memory
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // 🎟️ Header
        document.add(new Paragraph("FASTX E-TICKET")
                .setFontSize(20)
                .setBold()
                .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));

        document.add(new Paragraph("--------------------------------------------------"));

        // Journey details
        document.add(new Paragraph("📍 Route: " + booking.getRoute().getOrigin() + " → " + booking.getRoute().getDestination()));
        document.add(new Paragraph("🚌 Bus: " + booking.getRoute().getBus().getBusName()));
        document.add(new Paragraph("📅 Travel Date: " + booking.getTravelDate().toLocalDateTime().toLocalDate()));
        document.add(new Paragraph("⏰ Departure: " + booking.getRoute().getDepartureTime().toLocalTime()));
        document.add(new Paragraph("⏰ Arrival: " + booking.getRoute().getArrivalTime().toLocalTime()));

        document.add(new Paragraph("--------------------------------------------------"));

        // Passenger details
        document.add(new Paragraph("👤 Passenger: " + booking.getUser().getName()));
        document.add(new Paragraph("📧 Email: " + booking.getUser().getEmail()));
        
        // FIXED: Use direct seats relationship instead of bookingSeats
        if (booking.getSeats() != null && !booking.getSeats().isEmpty()) {
            String seatNumbers = booking.getSeats().stream()
                    .map(seat -> seat.getSeatNumber())
                    .collect(Collectors.joining(", "));
            document.add(new Paragraph("💺 Seats: " + seatNumbers));
            document.add(new Paragraph("🧑 Passengers: " + booking.getSeats().size()));
        } else {
            document.add(new Paragraph("💺 Seats: N/A"));
            document.add(new Paragraph("🧑 Passengers: 0"));
        }

        document.add(new Paragraph("--------------------------------------------------"));

        // Payment
        document.add(new Paragraph("💳 Payment ID: " + payment.getPaymentId()));
        document.add(new Paragraph("💰 Amount Paid: ₹" + payment.getAmountPaid()));
        document.add(new Paragraph("✅ Status: " + payment.getPaymentStatus()));

        document.close();

        // 2. Send HTML email
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(booking.getUser().getEmail());
        helper.setSubject("🎟️ Your FastX E-Ticket (Booking ID: " + booking.getBookingId() + ")");

        // FIXED: Use direct seats relationship in HTML content
        String seatNumbersHtml = "N/A";
        int passengerCount = 0;
        
        if (booking.getSeats() != null && !booking.getSeats().isEmpty()) {
            seatNumbersHtml = booking.getSeats().stream()
                    .map(seat -> seat.getSeatNumber())
                    .collect(Collectors.joining(", "));
            passengerCount = booking.getSeats().size();
        }

        String htmlContent = "<h2 style='color:#2E86C1;'>FastX E-Ticket</h2>"
                + "<p>Hi <b>" + booking.getUser().getName() + "</b>,</p>"
                + "<p>Thank you for booking with <b>FastX</b>. Please find your ticket attached.</p>"
                + "<table style='border-collapse:collapse;width:100%;'>"
                + "<tr><td><b>Booking ID:</b></td><td>" + booking.getBookingId() + "</td></tr>"
                + "<tr><td><b>Route:</b></td><td>" + booking.getRoute().getOrigin() + " → " + booking.getRoute().getDestination() + "</td></tr>"
                + "<tr><td><b>Travel Date:</b></td><td>" + booking.getTravelDate().toLocalDateTime().toLocalDate() + "</td></tr>"
                + "<tr><td><b>Seats:</b></td><td>" + seatNumbersHtml + "</td></tr>"
                + "<tr><td><b>Passengers:</b></td><td>" + passengerCount + "</td></tr>"
                + "<tr><td><b>Amount Paid:</b></td><td>₹" + payment.getAmountPaid() + "</td></tr>"
                + "<tr><td><b>Status:</b></td><td style='color:green;'>" + payment.getPaymentStatus() + "</td></tr>"
                + "</table>"
                + "<br/><p style='color:#555;'>Please carry a valid ID proof while boarding.</p>";

        helper.setText(htmlContent, true);

        // Attach PDF
        helper.addAttachment("FastX-Ticket.pdf", new ByteArrayDataSource(baos.toByteArray(), "application/pdf"));

        mailSender.send(message);

        log.info("✅ E-ticket sent to {}", booking.getUser().getEmail());
    }

    @Override 
    public Payment getPaymentByBookingId(int bookingId) { 
        return paymentRepository.findByBookingBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for booking ID: " + bookingId));
    }
    
    @Override 
    public List<Payment> getPaymentsByUserId(int userId) {
        List<Payment> payments = paymentRepository.findByBookingUserUserId(userId);
        if (payments.isEmpty()) { 
            throw new ResourceNotFoundException("No payments found for user ID: " + userId); 
        }
        return payments; 
    }
    
    @Override
    public List<Payment> getPaymentsByPaymentStatus(String paymentStatus) { 
        List<Payment> payments = paymentRepository.findByPaymentStatus(paymentStatus); 
        if (payments.isEmpty()) { 
            throw new ResourceNotFoundException("No payments found with status: " + paymentStatus); 
        } 
        return payments; 
    }
    
    @Override
    public BigDecimal getTotalRevenueByDate(Timestamp paymentDate) {
        return paymentRepository.findTotalAmountByPaymentDate(paymentDate); 
    }
    
    @Override 
    public boolean isPaymentSuccessfulForBooking(int bookingId) {
        return paymentRepository.existsByBookingBookingIdAndPaymentStatus(bookingId, "Success"); 
    }

}









/*age com.hexaware.fastx.service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.hexaware.fastx.dto.PaymentDto;
import com.hexaware.fastx.entities.Booking;
import com.hexaware.fastx.entities.Payment;
import com.hexaware.fastx.entities.Route;
import com.hexaware.fastx.entities.User;
import com.hexaware.fastx.exception.ResourceNotFoundException;
import com.hexaware.fastx.repository.BookingRepository;
import com.hexaware.fastx.repository.PaymentRepository;
import com.hexaware.fastx.repository.RouteRepository;
import com.hexaware.fastx.repository.UserRepository;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;

import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PaymentServiceImpl implements IPaymentService {

    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    BookingRepository bookingRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RouteRepository routeRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public Payment processPayment(PaymentDto paymentDto) {
        // Step 1: Create booking if not already created
        User user = userRepository.findById(paymentDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + paymentDto.getUserId()));

        Route route = routeRepository.findById(paymentDto.getRouteId())
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with ID: " + paymentDto.getRouteId()));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoute(route);
        booking.setBookingDate(Timestamp.from(Instant.now()));
        booking.setTotalAmount(paymentDto.getAmountPaid());
        booking.setStatus("Confirmed");
        booking.setTravelDate(paymentDto.getTravelDate());

        Booking savedBooking = bookingRepository.save(booking);

        // Step 2: Create payment linked to booking
        Payment payment = new Payment();
        payment.setAmountPaid(paymentDto.getAmountPaid());
        payment.setPaymentDate(paymentDto.getPaymentDate() != null ? paymentDto.getPaymentDate() : Timestamp.from(Instant.now()));
        payment.setPaymentStatus(paymentDto.getPaymentStatus());
        payment.setPaymentMethod(paymentDto.getPaymentMethod());
        payment.setBooking(savedBooking);

        Payment savedPayment = paymentRepository.save(payment);

        // Step 3: Send email with e-ticket if payment is successful
        if ("Success".equalsIgnoreCase(savedPayment.getPaymentStatus())) {
            try {
                sendETicket(savedPayment);
            } catch (Exception e) {
                log.error("Failed to send e-ticket: {}", e.getMessage());
            }
        }

        return savedPayment;
    }

    // Reusable PDF generator (for email + download)
    public byte[] generateTicketPdf(Payment payment) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            Booking booking = payment.getBooking();

            document.add(new Paragraph("🎟️ FastX E-Ticket"));
            document.add(new Paragraph("Booking ID: " + booking.getBookingId()));
            document.add(new Paragraph("User: " + booking.getUser().getName()));
            document.add(new Paragraph("Email: " + booking.getUser().getEmail()));
            document.add(new Paragraph("Route: " + booking.getRoute().getOrigin() + " → " + booking.getRoute().getDestination()));
            document.add(new Paragraph("Travel Date: " + booking.getTravelDate()));
            document.add(new Paragraph("Total Paid: ₹" + payment.getAmountPaid()));
            document.add(new Paragraph("Payment ID: " + payment.getPaymentId()));
            document.add(new Paragraph("Status: " + payment.getPaymentStatus()));

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("Error generating PDF: {}", e.getMessage());
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    // Convenience wrapper for REST controller
    public byte[] generateTicketPdf(int paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + paymentId));
        return generateTicketPdf(payment);
    }

    public void sendETicket(Payment payment) throws Exception {
        Booking booking = payment.getBooking();

        // 1. Generate PDF in memory
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // 🎟️ Header
        document.add(new Paragraph("FASTX E-TICKET")
                .setFontSize(20)
                .setBold()
                .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));

        document.add(new Paragraph("--------------------------------------------------"));

        // Journey details
        document.add(new Paragraph("📍 Route: " + booking.getRoute().getOrigin() + " → " + booking.getRoute().getDestination()));
        document.add(new Paragraph("🚌 Bus: " + booking.getRoute().getBus().getBusName()));
        document.add(new Paragraph("📅 Travel Date: " + booking.getTravelDate().toLocalDateTime().toLocalDate()));
        //document.add(new Paragraph("📅 Travel Date: " + booking.getTravelDate().toLocalDate()));
        document.add(new Paragraph("⏰ Departure: " + booking.getRoute().getDepartureTime().toLocalTime()));
        document.add(new Paragraph("⏰ Arrival: " + booking.getRoute().getArrivalTime().toLocalTime()));

        document.add(new Paragraph("--------------------------------------------------"));

        // Passenger details
        document.add(new Paragraph("👤 Passenger: " + booking.getUser().getName()));
        document.add(new Paragraph("📧 Email: " + booking.getUser().getEmail()));
        document.add(new Paragraph("💺 Seats: " +
                booking.getBookingSeats().stream()
                       .map(bs -> bs.getSeat().getSeatNumber())
                       .reduce((a, b) -> a + ", " + b).orElse("N/A")));
        document.add(new Paragraph("🧑 Passengers: " + booking.getBookingSeats().size()));

        document.add(new Paragraph("--------------------------------------------------"));

        // Payment
        document.add(new Paragraph("💳 Payment ID: " + payment.getPaymentId()));
        document.add(new Paragraph("💰 Amount Paid: ₹" + payment.getAmountPaid()));
        document.add(new Paragraph("✅ Status: " + payment.getPaymentStatus()));

        document.close();

        // 2. Send HTML email
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(booking.getUser().getEmail());
        helper.setSubject("🎟️ Your FastX E-Ticket (Booking ID: " + booking.getBookingId() + ")");

        String htmlContent = "<h2 style='color:#2E86C1;'>FastX E-Ticket</h2>"
                + "<p>Hi <b>" + booking.getUser().getName() + "</b>,</p>"
                + "<p>Thank you for booking with <b>FastX</b>. Please find your ticket attached.</p>"
                + "<table style='border-collapse:collapse;width:100%;'>"
                + "<tr><td><b>Booking ID:</b></td><td>" + booking.getBookingId() + "</td></tr>"
                + "<tr><td><b>Route:</b></td><td>" + booking.getRoute().getOrigin() + " → " + booking.getRoute().getDestination() + "</td></tr>"
                + "<tr><td><b>Travel Date:</b></td><td>" + booking.getTravelDate().toLocalDateTime().toLocalDate() + "</td></tr>"
                + "<tr><td><b>Seats:</b></td><td>" + booking.getBookingSeats().stream()
                .map(bs -> bs.getSeat().getSeatNumber()).reduce((a, b) -> a + ", " + b).orElse("N/A") + "</td></tr>"
                + "<tr><td><b>Amount Paid:</b></td><td>₹" + payment.getAmountPaid() + "</td></tr>"
                + "<tr><td><b>Status:</b></td><td style='color:green;'>" + payment.getPaymentStatus() + "</td></tr>"
                + "</table>"
                + "<br/><p style='color:#555;'>Please carry a valid ID proof while boarding.</p>";

        helper.setText(htmlContent, true);

        // Attach PDF
        helper.addAttachment("FastX-Ticket.pdf", new ByteArrayDataSource(baos.toByteArray(), "application/pdf"));

        mailSender.send(message);

        log.info("✅ E-ticket sent to {}", booking.getUser().getEmail());
    }


    
    @Override 
    public Payment getPaymentByBookingId(int bookingId) { return
    		  paymentRepository.findByBookingBookingId(bookingId) .orElseThrow(() -> new
    		  ResourceNotFoundException("Payment not found for booking ID: " + bookingId));
    		  }
    		  
    		  @Override 
    		  public List<Payment> getPaymentsByUserId(int userId) {
    		  List<Payment> payments = paymentRepository.findByBookingUserUserId(userId);
    		  if (payments.isEmpty()) { throw new
    		  ResourceNotFoundException("No payments found for user ID: " + userId); }
    		  return payments; }
    		  
    		  @Override
    		  public List<Payment> getPaymentsByPaymentStatus(String
    		  paymentStatus) { List<Payment> payments =
    		  paymentRepository.findByPaymentStatus(paymentStatus); if (payments.isEmpty())
    		  { throw new ResourceNotFoundException("No payments found with status: " +
    		  paymentStatus); } return payments; }
    		  
    		  @Override
    		  public BigDecimal getTotalRevenueByDate(Timestamp paymentDate) {
    		  return paymentRepository.findTotalAmountByPaymentDate(paymentDate); }
    		  
    		  @Override 
    		  public boolean isPaymentSuccessfulForBooking(int bookingId) {
    		  return paymentRepository.existsByBookingBookingIdAndPaymentStatus(bookingId,
    		 "Success"); }
    
}
*/

/*
 * package com.hexaware.fastx.service;
 * 
 * import java.math.BigDecimal; import java.sql.Timestamp; import
 * java.util.List;
 * 
 * import org.springframework.beans.factory.annotation.Autowired; import
 * org.springframework.mail.javamail.JavaMailSender; import
 * org.springframework.mail.javamail.MimeMessageHelper; import
 * org.springframework.stereotype.Service;
 * 
 * import com.hexaware.fastx.dto.PaymentDto; import
 * com.hexaware.fastx.entities.Booking; //import
 * com.hexaware.fastx.entities.BookingSeat; import
 * com.hexaware.fastx.entities.Payment; import
 * com.hexaware.fastx.entities.Route; //import com.hexaware.fastx.entities.Seat;
 * import com.hexaware.fastx.entities.User; import
 * com.hexaware.fastx.exception.ResourceNotFoundException; import
 * com.hexaware.fastx.repository.BookingRepository; import
 * com.hexaware.fastx.repository.PaymentRepository; import
 * com.hexaware.fastx.repository.RouteRepository; import
 * com.hexaware.fastx.repository.SeatRepository; import
 * com.hexaware.fastx.repository.UserRepository; import
 * com.itextpdf.io.source.ByteArrayOutputStream; import
 * com.itextpdf.kernel.pdf.PdfDocument; import
 * com.itextpdf.kernel.pdf.PdfWriter; import com.itextpdf.layout.Document;
 * import com.itextpdf.layout.element.Paragraph;
 * 
 * import jakarta.mail.internet.MimeMessage; import
 * jakarta.mail.util.ByteArrayDataSource; import lombok.extern.slf4j.Slf4j;
 * 
 * @Slf4j
 * 
 * @Service public class PaymentServiceImpl implements IPaymentService {
 * 
 * @Autowired private PaymentRepository paymentRepository;
 * 
 * @Autowired private BookingRepository bookingRepository;
 * 
 * @Autowired private UserRepository userRepository;
 * 
 * @Autowired private RouteRepository routeRepository;
 * 
 * @Autowired private SeatRepository seatRepository;
 * 
 * @Autowired private JavaMailSender mailSender;
 * 
 * @Override public Payment processPayment(PaymentDto paymentDto) { // 1. Create
 * Booking first Booking booking = new Booking(); booking.setBookingDate(new
 * Timestamp(System.currentTimeMillis())); // Now
 * booking.setTravelDate(paymentDto.getTravelDate());
 * booking.setTotalAmount(paymentDto.getAmountPaid());
 * booking.setStatus("Confirmed");
 * 
 * // set user + route User user = new User();
 * user.setUserId(paymentDto.getUserId()); booking.setUser(user);
 * 
 * Route route = new Route(); route.setRouteId(paymentDto.getRouteId());
 * booking.setRoute(route);
 * 
 * Booking savedBooking = bookingRepository.save(booking);
 * 
 * // 2. Create Payment for booking Payment payment = new Payment();
 * payment.setAmountPaid(paymentDto.getAmountPaid());
 * payment.setPaymentDate(paymentDto.getPaymentDate());
 * payment.setPaymentStatus(paymentDto.getPaymentStatus());
 * payment.setPaymentMethod(paymentDto.getPaymentMethod());
 * payment.setBooking(savedBooking);
 * 
 * Payment savedPayment = paymentRepository.save(payment);
 * 
 * log.info("✅ Payment processed successfully for Booking ID {}",
 * savedBooking.getBookingId());
 * 
 * // 3. Send e-ticket if successful if
 * ("Success".equalsIgnoreCase(savedPayment.getPaymentStatus())) { try {
 * sendETicket(savedPayment); } catch (Exception e) {
 * log.error("Failed to send e-ticket: {}", e.getMessage()); } }
 * 
 * return savedPayment; }
 * 
 * 
 * // 👉 Helper method: generate PDF and email it public void
 * sendETicket(Payment payment) throws Exception { Booking booking =
 * payment.getBooking();
 * 
 * ByteArrayOutputStream baos = new ByteArrayOutputStream(); PdfWriter writer =
 * new PdfWriter(baos); PdfDocument pdf = new PdfDocument(writer); Document
 * document = new Document(pdf);
 * 
 * document.add(new Paragraph("🎟️ FastX E-Ticket")); document.add(new
 * Paragraph("Booking ID: " + booking.getBookingId())); document.add(new
 * Paragraph("User: " + booking.getUser().getName())); document.add(new
 * Paragraph("Route: " + booking.getRoute().getOrigin() + " → " +
 * booking.getRoute().getDestination())); document.add(new
 * Paragraph("Travel Date: " + booking.getTravelDate())); document.add(new
 * Paragraph("Seats: " + booking.getBookingSeats().stream() .map(bs ->
 * bs.getSeat().getSeatNumber()) .reduce((s1, s2) -> s1 + ", " +
 * s2).orElse("N/A"))); document.add(new Paragraph("Total Paid: ₹" +
 * payment.getAmountPaid())); document.add(new Paragraph("Status: " +
 * payment.getPaymentStatus()));
 * 
 * document.close();
 * 
 * MimeMessage message = mailSender.createMimeMessage(); MimeMessageHelper
 * helper = new MimeMessageHelper(message, true);
 * 
 * helper.setTo(booking.getUser().getEmail());
 * helper.setSubject("Your FastX E-Ticket"); helper.setText("Hi " +
 * booking.getUser().getName() + ",\n\nPlease find your E-Ticket attached.",
 * false);
 * 
 * helper.addAttachment("eticket.pdf", new
 * ByteArrayDataSource(baos.toByteArray(), "application/pdf"));
 * 
 * mailSender.send(message);
 * 
 * log.info("📧 E-ticket sent to {}", booking.getUser().getEmail()); }
 * 
 * @Override public Payment getPaymentByBookingId(int bookingId) { return
 * paymentRepository.findByBookingBookingId(bookingId) .orElseThrow(() -> new
 * ResourceNotFoundException("Payment not found for booking ID: " + bookingId));
 * }
 * 
 * @Override public List<Payment> getPaymentsByUserId(int userId) {
 * List<Payment> payments = paymentRepository.findByBookingUserUserId(userId);
 * if (payments.isEmpty()) { throw new
 * ResourceNotFoundException("No payments found for user ID: " + userId); }
 * return payments; }
 * 
 * @Override public List<Payment> getPaymentsByPaymentStatus(String
 * paymentStatus) { List<Payment> payments =
 * paymentRepository.findByPaymentStatus(paymentStatus); if (payments.isEmpty())
 * { throw new ResourceNotFoundException("No payments found with status: " +
 * paymentStatus); } return payments; }
 * 
 * @Override public BigDecimal getTotalRevenueByDate(Timestamp paymentDate) {
 * return paymentRepository.findTotalAmountByPaymentDate(paymentDate); }
 * 
 * @Override public boolean isPaymentSuccessfulForBooking(int bookingId) {
 * return paymentRepository.existsByBookingBookingIdAndPaymentStatus(bookingId,
 * "Success"); } }
 */

/*
 * package com.hexaware.fastx.service;
 * 
 * import java.math.BigDecimal; import java.sql.Timestamp; //import
 * java.time.LocalDate; import java.util.List;
 * 
 * 
 * import org.springframework.beans.factory.annotation.Autowired; import
 * org.springframework.mail.javamail.JavaMailSender; import
 * org.springframework.mail.javamail.MimeMessageHelper; import
 * org.springframework.stereotype.Service;
 * 
 * import com.hexaware.fastx.dto.PaymentDto; import
 * com.hexaware.fastx.entities.Booking; import
 * com.hexaware.fastx.entities.Payment; import
 * com.hexaware.fastx.exception.ResourceNotFoundException; import
 * com.hexaware.fastx.repository.BookingRepository; import
 * com.hexaware.fastx.repository.PaymentRepository; import
 * com.itextpdf.io.source.ByteArrayOutputStream; import
 * com.itextpdf.kernel.pdf.PdfDocument; import
 * com.itextpdf.kernel.pdf.PdfWriter; import com.itextpdf.layout.Document;
 * import com.itextpdf.layout.element.Paragraph; import
 * jakarta.mail.internet.MimeMessage; import
 * jakarta.mail.util.ByteArrayDataSource; import lombok.extern.slf4j.Slf4j;
 * 
 *//**
	 * Service implementation for managing and processing payments in the system.
	 *
	 * Responsibilities: - Process and store new payment records - Retrieve payments
	 * by booking ID, user ID, or payment status - Calculate total revenue for a
	 * given date - Check if a booking has a successful payment
	 *
	 *
	 * Logging (via Lombok's @Slf4j) is used to track key service actions for
	 * debugging, monitoring, and auditing purposes.
	 *//*
		 * 
		 * @Slf4j
		 * 
		 * @Service public class PaymentServiceImpl implements IPaymentService {
		 * 
		 * @Autowired PaymentRepository paymentRepository;
		 * 
		 * @Autowired BookingRepository bookingRepository;
		 * 
		 * @Autowired private JavaMailSender mailSender;
		 * 
		 * @Override public Payment processPayment(PaymentDto paymentDto) { // Fetch the
		 * managed booking entity Booking booking =
		 * bookingRepository.findById(paymentDto.getBookingId()) .orElseThrow(() -> new
		 * ResourceNotFoundException( "Booking not found with ID: " +
		 * paymentDto.getBookingId()));
		 * 
		 * // Convert DTO to entity with booking Payment payment =
		 * paymentDto.toEntity(booking); Payment savedPayment =
		 * paymentRepository.save(payment);
		 * 
		 * log.info("Processing payment for booking ID: {}", booking.getBookingId());
		 * 
		 * // ✅ Generate e-ticket PDF + send email if payment is successful if
		 * ("Success".equalsIgnoreCase(savedPayment.getPaymentStatus())) { try {
		 * sendETicket(savedPayment); } catch (Exception e) {
		 * log.error("Failed to send e-ticket: {}", e.getMessage()); } }
		 * 
		 * return paymentRepository.save(payment); }
		 * 
		 * // 👉 Helper method: generate PDF and email it public void
		 * sendETicket(Payment payment) throws Exception { Booking booking =
		 * payment.getBooking();
		 * 
		 * // 1. Generate PDF in memory ByteArrayOutputStream baos = new
		 * ByteArrayOutputStream(); PdfWriter writer = new PdfWriter(baos); PdfDocument
		 * pdf = new PdfDocument(writer); Document document = new Document(pdf);
		 * 
		 * document.add(new Paragraph("🎟️ FastX E-Ticket")); document.add(new
		 * Paragraph("Booking ID: " + booking.getBookingId())); document.add(new
		 * Paragraph("User: " + booking.getUser().getName())); document.add(new
		 * Paragraph("Route: " + booking.getRoute().getOrigin() + " → " +
		 * booking.getRoute().getDestination())); document.add(new
		 * Paragraph("Total Paid: ₹" + payment.getAmountPaid())); document.add(new
		 * Paragraph("Status: " + payment.getPaymentStatus()));
		 * 
		 * document.close();
		 * 
		 * // 2. Send email MimeMessage message = mailSender.createMimeMessage();
		 * MimeMessageHelper helper = new MimeMessageHelper(message, true);
		 * 
		 * helper.setTo(booking.getUser().getEmail());
		 * helper.setSubject("Your FastX E-Ticket"); helper.setText("Hi " +
		 * booking.getUser().getName() + ",\n\nPlease find your E-Ticket attached.",
		 * false);
		 * 
		 * // attach PDF helper.addAttachment("eticket.pdf", new
		 * ByteArrayDataSource(baos.toByteArray(), "application/pdf"));
		 * 
		 * mailSender.send(message);
		 * 
		 * log.info("✅ E-ticket sent to {}", booking.getUser().getEmail()); }
		 * 
		 * 
		 * @Override public Payment getPaymentByBookingId(int bookingId) {
		 * 
		 * log.info("Fetching payment by booking ID: {}", bookingId); return
		 * paymentRepository.findByBookingBookingId(bookingId) .orElseThrow(() -> new
		 * ResourceNotFoundException("Payment not found for booking ID: " + bookingId));
		 * 
		 * }
		 * 
		 * @Override public List<Payment> getPaymentsByUserId(int userId) {
		 * log.info("Fetching payments for user ID: {}", userId); List<Payment> payments
		 * = paymentRepository.findByBookingUserUserId(userId); if (payments.isEmpty())
		 * { throw new ResourceNotFoundException("No payments found for user ID: " +
		 * userId); } return payments; }
		 * 
		 * @Override public List<Payment> getPaymentsByPaymentStatus(String
		 * paymentStatus) { log.info("Fetching payments with status: {}",
		 * paymentStatus); List<Payment> payments =
		 * paymentRepository.findByPaymentStatus(paymentStatus); if (payments.isEmpty())
		 * { throw new ResourceNotFoundException("No payments found with status: " +
		 * paymentStatus); } return payments; }
		 * 
		 * @Override public BigDecimal getTotalRevenueByDate(Timestamp paymentDate) {
		 * log.info("Calculating total revenue for date: {}", paymentDate); return
		 * paymentRepository.findTotalAmountByPaymentDate(paymentDate); }
		 * 
		 * @Override public boolean isPaymentSuccessfulForBooking(int bookingId) {
		 * log.info("Checking payment success for booking ID: {}", bookingId); return
		 * paymentRepository.existsByBookingBookingIdAndPaymentStatus(bookingId,
		 * "Paid"); } }
		 */