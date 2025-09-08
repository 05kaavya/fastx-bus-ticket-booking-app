package com.hexaware.fastx.entities;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "bookings")
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // ✅ Global ignore for proxies
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int bookingId;

    @Column(nullable = false)
    private Timestamp travelDate;

    @Column(nullable = false, updatable = false, insertable = true)
    private Timestamp bookingDate = new Timestamp(System.currentTimeMillis());

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Column(nullable = false, length = 20)
    private String status;   // Confirmed, Pending, Cancelled

    @Column(nullable = false)
    private int passengerCount;

    // 🔗 Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "bookings"})
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "buses", "bookings"})
    private Route route;

    // ✅ Many-to-many with seats
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "booking_seats",
        joinColumns = @JoinColumn(name = "booking_id"),
        inverseJoinColumns = @JoinColumn(name = "seat_id")
    )
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "bookings"})
    private List<Seat> seats;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "booking"})
    private Payment payment;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "booking"})
    private Cancellation cancellation;

    // Manual getter/setter for seats (sometimes safer with ManyToMany)
    public List<Seat> getSeats() {
        return seats;
    }

    public void setSeats(List<Seat> seats) {
        this.seats = seats;
    }
}


/*
 * package com.hexaware.fastx.entities;
 * 
 * import java.math.BigDecimal; import java.sql.Timestamp; import
 * java.util.List;
 * 
 * import com.fasterxml.jackson.annotation.JsonIdentityInfo; import
 * com.fasterxml.jackson.annotation.JsonIgnoreProperties; import
 * com.fasterxml.jackson.annotation.JsonInclude; import
 * com.fasterxml.jackson.annotation.ObjectIdGenerators;
 * 
 * import jakarta.persistence.Entity; import jakarta.persistence.FetchType;
 * import jakarta.persistence.GeneratedValue; import
 * jakarta.persistence.GenerationType; import jakarta.persistence.Id; import
 * jakarta.persistence.JoinColumn; import jakarta.persistence.ManyToOne; import
 * jakarta.persistence.OneToMany; import jakarta.persistence.OneToOne; import
 * jakarta.persistence.Table; import lombok.Data; import
 * lombok.NoArgsConstructor;
 * 
 * @Entity
 * 
 * @Data
 * 
 * @NoArgsConstructor
 * 
 * @Table(name = "bookings")
 * 
 * @JsonInclude(JsonInclude.Include.NON_NULL)
 * 
 * @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class,
 * property = "bookingId") public class Booking {
 * 
 * @Id
 * 
 * @GeneratedValue(strategy = GenerationType.IDENTITY) private int bookingId;
 * 
 * private Timestamp bookingDate; private BigDecimal totalAmount; private String
 * status;
 * 
 * @ManyToOne(fetch = FetchType.LAZY)
 * 
 * @JoinColumn(name = "user_id")
 * 
 * @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) private User
 * user;
 * 
 * @ManyToOne(fetch = FetchType.LAZY)
 * 
 * @JoinColumn(name = "route_id")
 * 
 * @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) private Route
 * route;
 * 
 * @OneToOne(mappedBy = "booking", fetch = FetchType.LAZY)
 * 
 * @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) private
 * Payment payment;
 * 
 * @OneToOne(mappedBy = "booking", fetch = FetchType.LAZY)
 * 
 * @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) private
 * Cancellation cancellation;
 * 
 * @OneToMany(mappedBy = "booking", fetch = FetchType.LAZY)
 * 
 * @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) private
 * List<BookingSeat> bookingSeats;
 * 
 * }
 */

