package com.hexaware.fastx.entities;

import java.math.BigDecimal;
import java.sql.Timestamp;
//import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

//import jakarta.persistence.CascadeType;
//import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
	 
	 @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "user_id")
	    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	    private User user;

	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "route_id")
	    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	    private Route route;

	    // Payment/Cancellation own the FK to Booking
	    @OneToOne(mappedBy = "booking", fetch = FetchType.LAZY)
	    private Payment payment;

	    @OneToOne(mappedBy = "booking", fetch = FetchType.LAZY)
	    private Cancellation cancellation;

	    @OneToMany(mappedBy = "booking", fetch = FetchType.LAZY)
	    private List<BookingSeat> bookingSeats;
}
