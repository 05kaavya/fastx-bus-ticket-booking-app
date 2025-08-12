package com.hexaware.fastx.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@NoArgsConstructor
@Table(name="routes")
public class Route {
	
	 @Id
	    private int routeId;
       // private int busId;
	    private String origin;
	    private String destination;
	    private LocalDateTime departureTime;
	    private LocalDateTime arrivalTime;
	    private BigDecimal fare;
	    
	    @ManyToOne
	    @JoinColumn(name = "bus_id")
	    private Bus bus;

	    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL)
	    private List<Booking> bookings;
}
