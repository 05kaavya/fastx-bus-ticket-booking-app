package com.hexaware.fastx.dto;


import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BookingPaymentRequestDto {

    @NotNull(message = "Booking details cannot be null")
    @Valid
    private BookingDto booking;

    @NotNull(message = "Payment details cannot be null")
    @Valid
    private PaymentDto payment;
    
    
}
