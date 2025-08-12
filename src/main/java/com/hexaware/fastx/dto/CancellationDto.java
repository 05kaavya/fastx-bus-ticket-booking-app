package com.hexaware.fastx.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.security.Timestamp;
import com.hexaware.fastx.entities.Cancellation;

@Data
@NoArgsConstructor
public class CancellationDto {
    private int cancellationId;

    @Min(value = 1, message = "Booking ID must be greater than 0")
    private int bookingId;

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
	  return cancellation; }
	 
}
