package com.hexaware.fastx.entities;

import java.math.BigDecimal;
import java.security.Timestamp;

//import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@NoArgsConstructor
@Table(name="payments")
public class Payment {

	@Id
	private int paymentId;
   // private int bookingId;
    private BigDecimal amountPaid;
    private Timestamp paymentDate;
    
    
    private String paymentStatus;
    
    @OneToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;
}
