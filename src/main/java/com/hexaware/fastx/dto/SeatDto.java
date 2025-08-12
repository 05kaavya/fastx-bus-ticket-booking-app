package com.hexaware.fastx.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.hexaware.fastx.entities.Seat;

@Data
@NoArgsConstructor
public class SeatDto {
    private int seatId;

    @Min(value = 1, message = "Bus ID must be greater than 0")
    private int busId;

    @NotBlank(message = "Seat number cannot be blank")
    @Pattern(regexp = "^[A-Z]\\d{1,2}$", message = "Seat number must be like A1, B2, etc.")
    private String seatNumber;
    
    //give validation
    private String seatType;

    //validation
    private String seatStatus;

	
	  public Seat toEntity() { 
		  Seat seat = new Seat(); 
		  seat.setSeatId(this.seatId);
	  seat.setSeatNumber(this.seatNumber); 
	  seat.setSeatType(this.seatType);
	  seat.setSeatStatus(this.seatStatus); 
	  return seat; 
	  }
	 
}

