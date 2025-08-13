package com.hexaware.fastx.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Timestamp;
import com.hexaware.fastx.entities.Payment;

@Data
@NoArgsConstructor
public class PaymentDto {
    private int paymentId;

    @Min(value = 1, message = "Booking ID must be greater than 0")
    private int bookingId;

    @NotNull(message = "Amount paid cannot be null")
    private BigDecimal amountPaid;

    @NotNull(message = "Payment date cannot be null")
    private Timestamp paymentDate;

    @NotBlank(message = "Payment status cannot be blank")
    @Pattern(regexp = "^(Success|Failed|Pending|Refunded)$", message = "Status must be Success, Failed, Pending or Refunded")
    private String paymentStatus;

	
	  public Payment toEntity() { 
		  Payment payment = new Payment();
	  payment.setPaymentId(this.paymentId); 
	  payment.setAmountPaid(this.amountPaid);
	  payment.setPaymentDate(this.paymentDate);
	  payment.setPaymentStatus(this.paymentStatus); 
	  return payment; }
	 
}