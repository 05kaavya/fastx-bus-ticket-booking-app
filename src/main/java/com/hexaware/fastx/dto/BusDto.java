package com.hexaware.fastx.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.hexaware.fastx.entities.Bus;

@Data
@NoArgsConstructor
public class BusDto {
    private int busId;

    @NotBlank(message = "Bus name cannot be blank")
    private String busName;

    @NotBlank(message = "Bus number cannot be blank")
    @Pattern(regexp = "^[A-Z]{2}\\d{2}[A-Z]{2}\\d{4}$", message = "Invalid bus number format (e.g., TN01AB1234)")
    private String busNumber;

    @NotBlank(message = "Bus type cannot be blank")
    private String busType;

    @Min(value = 1, message = "Total seats must be at least 1")
    private int totalSeats;

    //give validation
    private String amenities;

    @Min(value = 1, message = "Operator ID must be greater than 0")
    private int operatorId;

	
	  public Bus toEntity() {
	  Bus bus = new Bus(); 
	  bus.setBusId(this.busId);
	  bus.setBusName(this.busName); 
	  bus.setBusNumber(this.busNumber);
	  bus.setBusType(this.busType); 
	  bus.setTotalSeats(this.totalSeats);
	  bus.setAmenities(this.amenities); 
	  return bus; }
	 
}
