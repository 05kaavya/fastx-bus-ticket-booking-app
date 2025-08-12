package com.hexaware.fastx.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hexaware.fastx.entities.Cancellation;
import java.math.BigDecimal;
//import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface CancellationRepository extends JpaRepository<Cancellation, Integer> {
	
	  Cancellation findByBookingBookingId(int bookingId); 
	  List<Cancellation> findByBookingUserUserId(int userId); 
	  List<Cancellation> findByRefundStatus(String refundStatus);
	  boolean existsByBookingBookingId(int bookingId);
	  
	  @Query("SELECT SUM(c.refundAmount) " + "FROM Cancellation c " +
	  "WHERE c.cancellationDate BETWEEN :startDate AND :endDate") BigDecimal
	  findTotalRefundsIssuedByCancellationDate(
	  
	  @Param("startDate") LocalDateTime startDate,
	  
	  @Param("endDate") LocalDateTime endDate);
	 
}
