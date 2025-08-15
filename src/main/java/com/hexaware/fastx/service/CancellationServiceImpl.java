package com.hexaware.fastx.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.hexaware.fastx.exception.*;

import com.hexaware.fastx.entities.Cancellation;
import com.hexaware.fastx.repository.CancellationRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Service implementation for handling booking cancellations in the system.
 *
 * Responsibilities:
 * - Cancel bookings and persist cancellation details
 * - Retrieve cancellations by booking ID, user ID, or refund status
 * - Check if a booking is already cancelled
 * - Calculate total refunds issued on a specific date
 *
 * Utilizes CancellationRepository for database operations.
 * Throws ResourceNotFoundException when no matching cancellation is found.
 *
 * Logging (via Lombok's @Slf4j) is used to trace key service operations
 * for debugging, monitoring, and auditing purposes.
 */

@Slf4j
@Service
public class CancellationServiceImpl implements ICancellationService {

    @Autowired
    CancellationRepository cancellationRepository;

    @Override
    public Cancellation cancelBooking(Cancellation cancellation) {
    	
    	log.info("Cancelling booking ID: {}", cancellation.getBooking().getBookingId());
        return cancellationRepository.save(cancellation);
    }

    @Override
    public Cancellation getCancellationByBookingId(int bookingId) {
        log.info("Fetching cancellation by booking ID: {}", bookingId);
        return cancellationRepository.findByBookingBookingId(bookingId).orElseThrow(() -> new ResourceNotFoundException("Cancellation not found for booking ID: " + bookingId));

    }

    @Override
    public List<Cancellation> getCancellationsByUserId(int userId) {
    	log.info("Fetching cancellations for user ID: {}", userId);
    	List<Cancellation> cancellations = cancellationRepository.findByBookingUserUserId(userId);
        if (cancellations.isEmpty()) {
            throw new ResourceNotFoundException("No cancellations found for user ID: " + userId);
        }
        return cancellations;
    }

    @Override
    public List<Cancellation> getCancellationsByStatus(String refundStatus) {
    	 log.info("Fetching cancellations with refund status: {}", refundStatus);
    	List<Cancellation> cancellations = cancellationRepository.findByRefundStatus(refundStatus);
        if (cancellations.isEmpty()) {
            throw new ResourceNotFoundException("No cancellations found with status: " + refundStatus);
        }
        return cancellations;
    }

    @Override
    public boolean isBookingCancelled(int bookingId) {
    	log.info("Checking if booking is cancelled: {}", bookingId);
        return cancellationRepository.existsByBookingBookingId(bookingId);
    }

    @Override
    public BigDecimal getTotalRefundsIssuedByDate(LocalDate cancellationDate) {
    	log.info("Calculating total refunds issued on: {}", cancellationDate);
        LocalDateTime startDate = cancellationDate.atStartOfDay();
        LocalDateTime endDate = cancellationDate.atTime(LocalTime.MAX);
        return cancellationRepository.findTotalRefundsIssuedByCancellationDate(startDate, endDate);
    }
}
