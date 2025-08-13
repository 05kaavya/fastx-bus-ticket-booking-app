package com.hexaware.fastx.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.fastx.entities.Seat;
import com.hexaware.fastx.exception.ResourceNotFoundException;
import com.hexaware.fastx.repository.SeatRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class SeatServiceImpl implements ISeatService {

    @Autowired
    SeatRepository seatRepository;

    @Override
    public Seat addSeat(Seat seat) {
    	 log.info("Adding seat: {}", seat.getSeatNumber());
        return seatRepository.save(seat);
    }

    @Override
    public Seat updateSeat(Seat seat) {
    	log.info("Updating seat ID: {}", seat.getSeatId());
    	 if (!seatRepository.existsById(seat.getSeatId())) {
             throw new ResourceNotFoundException("Seat not found with ID: " + seat.getSeatId());
         }
        return seatRepository.save(seat);
    }

    @Override
    public List<Seat> getSeatsByBusId(int busId) {
    	log.info("Fetching seats for bus ID: {}", busId);
    	 List<Seat> seats = seatRepository.findByBusBusId(busId);
         if (seats.isEmpty()) {
             throw new ResourceNotFoundException("No seats found for bus ID: " + busId);
         }
        return seats;
    }

    @Override
    public String deleteSeat(int seatId) {
    	 log.info("Deleting seat ID: {}", seatId);
    	Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found with ID: " + seatId));
    	seatRepository.delete(seat);
        return "Seat deleted successfully";
    }

    @Override
    public List<Seat> getSeatsByBusIdAndSeatStatus(int busId, String seatStatus) {
    	log.info("Fetching seats for bus ID: {} with status: {}", busId, seatStatus);
        return seatRepository.findByBusBusIdAndSeatStatus(busId, seatStatus);
    }

    @Override
    public List<Seat> getSeatsByBusIdAndSeatType(int busId, String seatType) {
        log.info("Fetching seats for bus ID: {} with type: {}", busId, seatType);

        return seatRepository.findByBusBusIdAndSeatType(busId, seatType);
    }

    @Override
    public List<Seat> getSeatsBySeatStatus(String seatStatus) {
    	log.info("Fetching seats with status: {}", seatStatus);
        return seatRepository.findBySeatStatus(seatStatus);
    }

    @Override
    public List<Seat> getSeatsBySeatType(String seatType) {
    	log.info("Fetching seats with type: {}", seatType);
        return seatRepository.findBySeatType(seatType);
    }
}
