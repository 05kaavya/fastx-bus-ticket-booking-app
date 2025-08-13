package com.hexaware.fastx.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

//import jakarta.persistence.CascadeType;
//import jakarta.persistence.Column;
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
@Table(name="buses")
public class Bus {
	
	
	@Id
	 private int busId;
	 private String busName;
	 private String busNumber;
     private String busType;
     private int totalSeats;
     
    
     private String amenities;
     
     @ManyToOne(fetch = FetchType.LAZY)
     @JoinColumn(name = "operator_id")
     @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
     private BusOperator operator;

     @OneToMany(mappedBy = "bus", fetch = FetchType.LAZY)
     @JsonIgnore
     @ToString.Exclude
     private List<Route> routes;

     @OneToMany(mappedBy = "bus", fetch = FetchType.LAZY)
     @JsonIgnore
     @ToString.Exclude
     private List<Seat> seats;
}
