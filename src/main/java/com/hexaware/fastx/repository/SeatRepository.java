package com.hexaware.fastx.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hexaware.fastx.entities.Seat;
import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Integer> {
	
	  List<Seat> findByBusBusId(int busId); 
	// Find seats by bus ID and seat status
	  List<Seat> findByBusBusIdAndSeatStatus(int busId, String seatStatus);

	  // Find seats by bus ID and seat type
	  List<Seat> findByBusBusIdAndSeatType(int busId, String seatType);

	  // Find seats by seat status only
	  List<Seat> findBySeatStatus(String seatStatus);

	  // Find seats by seat type only
	  List<Seat> findBySeatType(String seatType);
}
