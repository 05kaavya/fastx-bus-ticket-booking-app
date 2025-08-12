package com.hexaware.fastx.entities;

import java.util.List;

import jakarta.persistence.CascadeType;
//import jakarta.persistence.Column;
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
@Table(name="buses")
public class Bus {
	
	
	@Id
	 private int busId;
	 private String busName;
	 private String busNumber;
     private String busType;
     private int totalSeats;
     
    
     private String amenities;
     
     @ManyToOne
     @JoinColumn(name = "operator_id")
     private BusOperator operator;

     @OneToMany(mappedBy = "bus", cascade = CascadeType.ALL)
     private List<Route> routes;

     @OneToMany(mappedBy = "bus", cascade = CascadeType.ALL)
     private List<Seat> seats;
}
