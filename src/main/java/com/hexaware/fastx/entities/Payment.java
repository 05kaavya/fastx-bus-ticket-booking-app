package com.hexaware.fastx.entities;

import java.math.BigDecimal;
import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int paymentId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amountPaid;

    @Column(nullable = false)
    private Timestamp paymentDate;

    @Column(nullable = false, length = 20)
    private String paymentStatus;  // Success, Failed, Pending, Refunded

    @Column(nullable = false, length = 30)
    private String paymentMethod;  // Credit Card, UPI, NetBanking, etc.

    // ✅ Relationship with Booking
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "payment", "cancellation", "bookingSeats"})
    private Booking booking;
}


/*
 * package com.hexaware.fastx.entities;
 * 
 * import java.math.BigDecimal; import java.sql.Timestamp;
 * 
 * import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
 * 
 * import jakarta.persistence.*; import lombok.Data; import
 * lombok.NoArgsConstructor;
 * 
 * @Entity
 * 
 * @Data
 * 
 * @NoArgsConstructor
 * 
 * @Table(name = "payments") public class Payment {
 * 
 * @Id
 * 
 * @GeneratedValue(strategy = GenerationType.IDENTITY) private int paymentId;
 * 
 * @Column(nullable = false, precision = 10, scale = 2) private BigDecimal
 * amountPaid;
 * 
 * @Column(nullable = false) private Timestamp paymentDate;
 * 
 * @Column(nullable = false, length = 20) private String paymentStatus; //
 * Success, Failed, Pending, Refunded
 * 
 * @Column(nullable = false, length = 30) private String paymentMethod; //
 * Credit Card, UPI, NetBanking, etc.
 * 
 * // Relationship with booking
 * 
 * @OneToOne(fetch = FetchType.LAZY)
 * 
 * @JoinColumn(name = "booking_id", nullable = false, unique = true)
 * 
 * @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) private
 * Booking booking; }
 */

