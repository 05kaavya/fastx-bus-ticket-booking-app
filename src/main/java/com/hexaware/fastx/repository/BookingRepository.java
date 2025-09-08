package com.hexaware.fastx.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hexaware.fastx.entities.Booking;

//import java.util.Date;
import java.util.List;
import java.sql.Timestamp;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByUserUserId(int userId);
    List<Booking> findByUserEmail(String email);
    List<Booking> findByRouteBusOperatorOperatorId(int operatorId);
    
    // Check if seat is booked in any active booking
    @Query("SELECT COUNT(b) > 0 FROM Booking b JOIN b.seats s WHERE s.seatId = :seatId AND b.status != :status")
    boolean existsBySeatIdAndStatusNot(@Param("seatId") int seatId, @Param("status") String status);
    
    @Query("SELECT b FROM Booking b " +
    	       "WHERE b.route.bus.busId = :busId " +
    	       "AND b.travelDate >= :startOfDay " +
    	       "AND b.travelDate < :endOfDay " +
    	       "AND b.status != :status")
    	List<Booking> findByBusBusIdAndTravelDateAndStatusNot(
    	        @Param("busId") int busId,
    	        @Param("startOfDay") Timestamp startOfDay,
    	        @Param("endOfDay") Timestamp endOfDay,
    	        @Param("status") String status);

}

	
	
	//List<Booking> findByUser(User user);
