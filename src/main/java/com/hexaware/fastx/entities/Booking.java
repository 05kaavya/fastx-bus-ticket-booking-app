package com.hexaware.fastx.entities;

import java.math.BigDecimal;
import java.security.Timestamp;
//import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
//import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@NoArgsConstructor
@Table(name="bookings")
public class Booking {
	
	
	@Id
	 private int bookingId;
	 
	 private Timestamp bookingDate;
	 private BigDecimal totalAmount;
	 
	 
	 private String status;
	 
	 @ManyToOne
	    @JoinColumn(name = "user_id")
	    private User user;

	    @ManyToOne
	    @JoinColumn(name = "route_id")
	    private Route route;

	    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
	    private Payment payment;

	    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
	    private Cancellation cancellation;

	    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
	    private List<BookingSeat> bookingSeats;
}
