/*
 * package com.hexaware.fastx.restcontroller;
 * 
 * import org.springframework.web.bind.annotation.GetMapping;
 * 
 * import com.hexaware.fastx.entities.Booking; import
 * com.hexaware.fastx.entities.Payment; import com.hexaware.fastx.entities.User;
 * import com.hexaware.fastx.service.PaymentServiceImpl;
 * 
 * public class EmailRestController {
 * 
 * @GetMapping("/test-email") public String testEmail() { try { Booking
 * dummyBooking = new Booking(); dummyBooking.setBookingId(101);
 * dummyBooking.setUser(new User(1, "Kaviya", "yourfriend@example.com")); // 👈
 * put a real email
 * 
 * Payment dummyPayment = new Payment(); dummyPayment.setAmountPaid(new
 * BigDecimal("500")); dummyPayment.setPaymentStatus("Success");
 * dummyPayment.setBooking(dummyBooking);
 * 
 * // call sendETicket directly PaymentServiceImpl.sendETicket(dummyPayment);
 * return "✅ Email sent successfully!"; } catch (Exception e) {
 * e.printStackTrace(); return "❌ Error: " + e.getMessage(); } }
 * 
 * 
 * }
 */
