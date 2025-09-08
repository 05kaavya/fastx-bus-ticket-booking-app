package com.hexaware.fastx.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Data
@NoArgsConstructor
public class PaymentDto {

    private int paymentId;

    @Min(value = 1, message = "User ID must be greater than 0")
    private int userId;

    @Min(value = 1, message = "Route ID must be greater than 0")
    private int routeId;

    @NotNull(message = "Travel date cannot be null")
    @Future(message = "Travel date must be in the future")
    private Timestamp travelDate;

    @NotNull(message = "Amount paid cannot be null")
    private BigDecimal amountPaid;

    @NotNull(message = "Payment date cannot be null")
    private Timestamp paymentDate;

    @NotBlank(message = "Payment status cannot be blank")
    @Pattern(regexp = "^(Success|Failed|Pending|Refunded)$", 
             message = "Status must be Success, Failed, Pending or Refunded")
    private String paymentStatus;

    @NotBlank(message = "Payment method cannot be blank")
    private String paymentMethod;
}



/*
 * package com.hexaware.fastx.dto;
 * 
 * import jakarta.validation.constraints.Min; import
 * jakarta.validation.constraints.NotBlank; import
 * jakarta.validation.constraints.NotNull; import
 * jakarta.validation.constraints.Pattern; import lombok.Data; import
 * lombok.NoArgsConstructor;
 * 
 * import java.math.BigDecimal; import java.sql.Timestamp;
 * 
 * import com.hexaware.fastx.entities.Booking; import
 * com.hexaware.fastx.entities.Payment;
 * 
 * @Data
 * 
 * @NoArgsConstructor public class PaymentDto { private int paymentId;
 * 
 * @Min(value = 1, message = "Booking ID must be greater than 0") private int
 * bookingId;
 * 
 * @NotNull(message = "Amount paid cannot be null") private BigDecimal
 * amountPaid;
 * 
 * @NotNull(message = "Payment date cannot be null") private Timestamp
 * paymentDate;
 * 
 * @NotBlank(message = "Payment status cannot be blank")
 * 
 * @Pattern(regexp = "^(Success|Failed|Pending|Refunded)$", message =
 * "Status must be Success, Failed, Pending or Refunded") private String
 * paymentStatus;
 * 
 * 
 * public Payment toEntity(Booking booking) { Payment payment = new Payment();
 * payment.setPaymentId(this.paymentId); payment.setAmountPaid(this.amountPaid);
 * payment.setPaymentDate(this.paymentDate);
 * payment.setPaymentStatus(this.paymentStatus); payment.setBooking(booking);
 * return payment; }
 * 
 * 
 * }
 */