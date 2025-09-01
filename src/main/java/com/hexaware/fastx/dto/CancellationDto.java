package com.hexaware.fastx.dto;


//import jakarta.persistence.Column;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Timestamp;

//import org.hibernate.annotations.CreationTimestamp;

import com.hexaware.fastx.entities.Booking;
import com.hexaware.fastx.entities.Cancellation;
import com.hexaware.fastx.entities.Payment;

@Data
@NoArgsConstructor
public class CancellationDto {
    private int cancellationId;

    @Min(value = 1, message = "Booking ID must be greater than 0")
    private int bookingId;
    
    @Min(value = 1, message = "Payment ID must be greater than 0")  // ✅ new
    private int paymentId;

    
    @NotNull(message = "Cancellation date cannot be null")
    private Timestamp cancellationDate;

    @NotNull(message = "Refund amount cannot be null")
    private BigDecimal refundAmount;

    private String refundStatus;
    private String reason;

	
	  public Cancellation toEntity() {
	  Cancellation cancellation = new Cancellation(); 
	  cancellation.setCancellationId(this.cancellationId);
	  cancellation.setCancellationDate(this.cancellationDate);
	  cancellation.setRefundAmount(this.refundAmount);
	  cancellation.setRefundStatus(this.refundStatus);
	  cancellation.setReason(this.reason);
	  
	  if (this.bookingId > 0) {
          Booking booking = new Booking();
          booking.setBookingId(this.bookingId);
          cancellation.setBooking(booking);
      }

      if (this.paymentId > 0) {
          Payment payment = new Payment();
          payment.setPaymentId(this.paymentId);
          cancellation.setPayment(payment);
      }
	  return cancellation; }
	 
}
