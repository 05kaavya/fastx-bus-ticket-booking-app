package com.hexaware.fastx.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hexaware.fastx.entities.BookingSeat;
import java.util.List;

public interface BookingSeatRepository extends JpaRepository<BookingSeat, Integer> {
	
   List<BookingSeat> findByBookingBookingId(int bookingId);
}