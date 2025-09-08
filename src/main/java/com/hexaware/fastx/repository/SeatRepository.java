package com.hexaware.fastx.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hexaware.fastx.entities.Seat;
import com.hexaware.fastx.entities.User;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Integer> {
	
	 
	// Find seats by bus ID and seat status
	  List<Seat> findByBusBusIdAndSeatStatus(int busId, String seatStatus);

	  // Find seats by bus ID and seat type
	  List<Seat> findByBusBusIdAndSeatType(int busId, String seatType);

	  // Find seats by seat status only
	  List<Seat> findBySeatStatus(String seatStatus);

	  // Find seats by seat type only
	  List<Seat> findBySeatType(String seatType);
	  
	  
	Optional<User> findBySeatNumberAndBusBusId(String seatNumber, int busId);
	
	 	    
	    Optional<Seat> findByBusBusIdAndSeatNumber(int busId, String seatNumber);
	    
	    
	    @Query("SELECT s FROM Seat s WHERE s.bus.busId = :busId AND s.seatNumber IN :seatNumbers")
	    List<Seat> findByBusIdAndSeatNumbers(@Param("busId") int busId, @Param("seatNumbers") List<String> seatNumbers);
	    
	    
		List<Seat> findByBusBusId(int busId);
	}
