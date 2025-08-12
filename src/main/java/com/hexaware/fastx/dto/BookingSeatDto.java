package com.hexaware.fastx.dto;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.hexaware.fastx.entities.BookingSeat;

@Data
@NoArgsConstructor
public class BookingSeatDto {
	
	
    private int id;

    @Min(value = 1, message = "Booking ID must be greater than 0")
    @NotNull
    private int bookingId;

    @Min(value = 1, message = "Seat ID must be greater than 0")
    @NotNull
    private int seatId;

	
    public BookingSeat toEntity() { 
	BookingSeat bookingSeat = new BookingSeat();
	bookingSeat.setId(this.id); 
	return bookingSeat; 
		}
	 
}
