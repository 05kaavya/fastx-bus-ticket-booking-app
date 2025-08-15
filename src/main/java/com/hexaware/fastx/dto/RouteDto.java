package com.hexaware.fastx.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.hexaware.fastx.entities.Bus;
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
    
    @Min(value = 1, message = "Distance must be greater than 0")
    private double distance;

    @NotNull(message = "Fare cannot be null")
    private BigDecimal fare;

	
    public Route toEntity() {
        Route route = new Route();
        route.setRouteId(this.routeId);
        route.setOrigin(this.origin);
        route.setDestination(this.destination);
        route.setDepartureTime(this.departureTime);
        route.setArrivalTime(this.arrivalTime);
        route.setDistance(this.distance);
        route.setFare(this.fare);

        // Link bus by ID
        if (this.busId != 0) {
            Bus bus = new Bus();
            bus.setBusId(this.busId);
            route.setBus(bus);
        }

        return route;
    }

	 
}
