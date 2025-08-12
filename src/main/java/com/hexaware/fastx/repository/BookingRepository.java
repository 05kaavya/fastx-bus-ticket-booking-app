package com.hexaware.fastx.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hexaware.fastx.entities.Booking;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByUserUserId(int userId);
}