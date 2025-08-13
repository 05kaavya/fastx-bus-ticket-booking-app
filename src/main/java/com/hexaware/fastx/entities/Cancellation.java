package com.hexaware.fastx.entities;

import java.math.BigDecimal;
import java.sql.Timestamp;
//import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name="cancellations")
public class Cancellation {

	@Id
	private int cancellationId;

    private Timestamp cancellationDate;
    private BigDecimal refundAmount; 
    
    @Column(columnDefinition = "ENUM('Pending','Refunded','Rejected')")
    private String refundStatus;
    private String reason;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Booking booking;

	
    
    
}