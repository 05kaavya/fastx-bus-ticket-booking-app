package com.hexaware.fastx.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.hexaware.fastx.entities.Route;

@Data
@NoArgsConstructor
public class RouteDto {
    private int routeId;

    @Min(value = 1, message = "Bus ID must be greater than 0")
    private int busId;

    @NotBlank(message = "Origin cannot be blank")
    @Pattern(regexp = "^[A-Za-z ]+$", message = "Origin must contain only letters and spaces")
    private String origin;

    @NotBlank(message = "Destination cannot be blank")
    @Pattern(regexp = "^[A-Za-z ]+$", message = "Destination must contain only letters and spaces")
    private String destination;

    @NotNull(message = "Departure time cannot be null")
    private LocalDateTime departureTime;

    @NotNull(message = "Arrival time cannot be null")
    private LocalDateTime arrivalTime;

    @NotNull(message = "Fare cannot be null")
    private BigDecimal fare;

	
	  public Route toEntity() { 
		  Route route = new Route();
	  route.setRouteId(this.routeId); 
	  route.setOrigin(this.origin);
	  route.setDestination(this.destination);
	  route.setDepartureTime(this.departureTime);
	  route.setArrivalTime(this.arrivalTime); 
	  route.setFare(this.fare); 
	  return route; }
	 
}
