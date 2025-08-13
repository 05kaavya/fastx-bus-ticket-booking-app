package com.hexaware.fastx.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

//import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


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
	    private double distance;
	    private BigDecimal fare;
	    
	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "bus_id")
	    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	    private Bus bus;

	    @OneToMany(mappedBy = "route", fetch = FetchType.LAZY)
	    @JsonIgnore
	    @ToString.Exclude
	    private List<Booking> bookings;
}
