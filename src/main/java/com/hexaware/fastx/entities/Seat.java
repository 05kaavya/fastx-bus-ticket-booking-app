package com.hexaware.fastx.entities;

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
@Table(name="seats")
public class Seat {
	
	@Id
	private int seatId;
  //  private int busId;
    private String seatNumber;
    
    
    private String seatStatus;
    
    
    private String seatType;
    
    @ManyToOne
    @JoinColumn(name = "bus_id")
    private Bus bus;

    @OneToMany(mappedBy = "seat", cascade = CascadeType.ALL)
    private List<BookingSeat> bookingSeats;
}
