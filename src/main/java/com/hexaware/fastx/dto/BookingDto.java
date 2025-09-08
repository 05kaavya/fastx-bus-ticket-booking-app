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
import java.util.List;
import java.util.stream.Collectors;

import com.hexaware.fastx.entities.Booking;
import com.hexaware.fastx.entities.Route;
import com.hexaware.fastx.entities.Seat;
import com.hexaware.fastx.entities.User;
//import com.itextpdf.layout.element.List;

@Data
@NoArgsConstructor
public class BookingDto {

    private int bookingId;

    @Min(value = 1, message = "User ID must be greater than 0")
    private int userId;

    @Min(value = 1, message = "Route ID must be greater than 0")
    private int routeId;
    
    @Min(value = 1, message = "Bus ID must be greater than 0")
    private int busId; 

    @NotNull(message = "Booking date cannot be null")
    private Timestamp bookingDate;

    @NotNull(message = "Travel date cannot be null")
    @Future(message = "Travel date must be in the future")
    private Timestamp travelDate;

    @NotNull(message = "Total amount cannot be null")
    private BigDecimal totalAmount;

    @NotBlank(message = "Status cannot be blank")
    @Pattern(regexp = "^(Confirmed|Cancelled|Pending)$", 
             message = "Status must be Confirmed, Cancelled, or Pending")
    private String status;
    
    private int passengerCount;
    
    private List<Integer> seatIds;

    public Booking toEntity() {
        Booking booking = new Booking();
        booking.setBookingId(this.bookingId);
        booking.setBookingDate(this.bookingDate);
        booking.setTravelDate(this.travelDate);
        booking.setPassengerCount(this.passengerCount);
        booking.setTotalAmount(this.totalAmount);
        booking.setStatus(this.status);

        if (this.userId > 0) {
            User user = new User();
            user.setUserId(this.userId);
            booking.setUser(user);
        }

        if (this.routeId > 0) {
            Route route = new Route();
            route.setRouteId(this.routeId);
            booking.setRoute(route);
        }
        
        if (this.seatIds != null && !this.seatIds.isEmpty()) {
            List<Seat> seats = this.seatIds.stream().map(id -> {
                Seat seat = new Seat();
                seat.setSeatId(id);
                return seat;
            }).collect(Collectors.toList());
            booking.setSeats(seats);
        }

        return booking;
    }

	
}


/*
 * package com.hexaware.fastx.dto;
 * 
 * 
 * import jakarta.validation.constraints.Future; import
 * jakarta.validation.constraints.Min; import
 * jakarta.validation.constraints.NotBlank; import
 * jakarta.validation.constraints.NotNull; import
 * jakarta.validation.constraints.Pattern; import lombok.Data; import
 * lombok.NoArgsConstructor;
 * 
 * import java.math.BigDecimal; import java.sql.Timestamp; import
 * com.hexaware.fastx.entities.Booking; import
 * com.hexaware.fastx.entities.Route; import com.hexaware.fastx.entities.User;
 * 
 * @Data
 * 
 * @NoArgsConstructor public class BookingDto {
 * 
 * private int bookingId;
 * 
 * @Min(value = 1, message = "User ID must be greater than 0") private int
 * userId;
 * 
 * @Min(value = 1, message = "Route ID must be greater than 0") private int
 * routeId;
 * 
 * 
 * 
 * @NotNull(message = "Booking date cannot be null")
 * 
 * @Future(message="Date should only be in future") private Timestamp
 * bookingDate;
 * 
 * @NotNull(message = "Total amount cannot be null") private BigDecimal
 * totalAmount;
 * 
 * @NotBlank(message = "Status cannot be blank")
 * 
 * @Pattern(regexp = "^(Confirmed|Cancelled|Pending)$", message =
 * "Status must be Confirmed, Cancelled, or Pending") private String status;
 * 
 * 
 * 
 * public Booking toEntity() { Booking booking = new Booking();
 * booking.setBookingId(this.bookingId);
 * booking.setBookingDate(this.bookingDate);
 * booking.setTotalAmount(this.totalAmount); booking.setStatus(this.status);
 * 
 * // Set only IDs for relations to avoid nulls or extra DB fetch if
 * (this.userId > 0) { User user = new User(); user.setUserId(this.userId);
 * booking.setUser(user); }
 * 
 * if (this.routeId > 0) { Route route = new Route();
 * route.setRouteId(this.routeId); booking.setRoute(route); }
 * 
 * return booking; }
 * 
 * 
 * }
 */
