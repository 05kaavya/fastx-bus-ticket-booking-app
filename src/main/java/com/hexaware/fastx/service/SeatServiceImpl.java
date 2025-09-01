package com.hexaware.fastx.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.fastx.dto.SeatDto;
import com.hexaware.fastx.entities.Bus;
import com.hexaware.fastx.entities.Seat;
import com.hexaware.fastx.exception.ResourceNotFoundException;
import com.hexaware.fastx.repository.SeatRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Service implementation for managing seat operations in the system.
 *
 * Responsibilities:
 * - Add new seats
 * - Update existing seat details
 * - Retrieve seats by bus ID, seat status, or seat type
 * - Delete a seat by its ID
 *
 * Uses {@link SeatRepository} for database interactions.
 * Throws {@link ResourceNotFoundException} when a requested seat is not found.
 *
 * Logging (via Lombok's @Slf4j) is used to track key service operations,
 * aiding in debugging, monitoring, and auditing.
 */

@Slf4j
@Service
public class SeatServiceImpl implements ISeatService {

    @Autowired
    SeatRepository seatRepository;
    
    @Autowired
    IBusService busService;

    @Override
    public Seat addSeat(SeatDto dto) {
    	 log.info("Adding seat: {}", dto.getSeatNumber());
    	    Bus bus = busService.getBusById(dto.getBusId());
    	    Seat seat = dto.toEntity(bus);
    	 
			/*
			 * if (seat.getBus() != null && seat.getBus().getBusId() > 0) { Bus bus =
			 * busService.getBusById(seat.getBus().getBusId()); seat.setBus(bus); } else {
			 * throw new
			 * ResourceNotFoundException("Bus ID missing or invalid while adding seat"); }
			 */
    	 
        return seatRepository.save(seat);
    }

    @Override
    public Seat updateSeat(SeatDto dto) {
    	log.info("Updating seat ID: {}", dto.getSeatId());
    	
    	if (!seatRepository.existsById(dto.getSeatId())) {
            throw new ResourceNotFoundException("Seat not found with ID: " + dto.getSeatId());
        }

        Bus bus = busService.getBusById(dto.getBusId());
        Seat seat = dto.toEntity(bus);
		/*
		 * if (!seatRepository.existsById(seat.getSeatId())) { throw new
		 * ResourceNotFoundException("Seat not found with ID: " + seat.getSeatId()); }
		 * 
		 * if (seat.getBus() != null && seat.getBus().getBusId() > 0) { Bus bus =
		 * busService.getBusById(seat.getBus().getBusId()); seat.setBus(bus); } else {
		 * throw new
		 * ResourceNotFoundException("Bus ID missing or invalid while updating seat"); }
		 * return
		 */ 
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
