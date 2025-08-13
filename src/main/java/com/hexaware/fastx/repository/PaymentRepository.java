package com.hexaware.fastx.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hexaware.fastx.entities.Payment;
import java.math.BigDecimal;
import java.sql.Timestamp;
//import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
	
	  Optional <Payment> findByBookingBookingId(int bookingId);
	  List<Payment>findByBookingUserUserId(int userId); 
	  List<Payment> findByPaymentStatus(String paymentStatus);
	  BigDecimal findTotalAmountByPaymentDate(Timestamp paymentDate); 
	  boolean existsByBookingBookingIdAndPaymentStatus(int bookingId, String paymentStatus);
	 
}

