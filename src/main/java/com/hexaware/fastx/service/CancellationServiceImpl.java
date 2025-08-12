package com.hexaware.fastx.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.fastx.entities.Cancellation;
import com.hexaware.fastx.repository.CancellationRepository;

@Service
public class CancellationServiceImpl implements ICancellationService {

    @Autowired
    CancellationRepository cancellationRepository;

    @Override
    public Cancellation cancelBooking(Cancellation cancellation) {
        return cancellationRepository.save(cancellation);
    }

    @Override
    public Cancellation getCancellationByBookingId(int bookingId) {
        return cancellationRepository.findByBookingBookingId(bookingId);
    }

    @Override
    public List<Cancellation> getCancellationsByUserId(int userId) {
        return cancellationRepository.findByBookingUserUserId(userId);
    }

    @Override
    public List<Cancellation> getCancellationsByStatus(String refundStatus) {
        return cancellationRepository.findByRefundStatus(refundStatus);
    }

    @Override
    public boolean isBookingCancelled(int bookingId) {
        return cancellationRepository.existsByBookingBookingId(bookingId);
    }

    @Override
    public BigDecimal getTotalRefundsIssuedByDate(LocalDate cancellationDate) {
        LocalDateTime startDate = cancellationDate.atStartOfDay();
        LocalDateTime endDate = cancellationDate.atTime(LocalTime.MAX);
        return cancellationRepository.findTotalRefundsIssuedByCancellationDate(startDate, endDate);
    }
}
