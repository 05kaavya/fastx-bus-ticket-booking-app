package com.hexaware.fastx.service;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.HashMap;
import java.util.stream.Collectors;
import java.sql.Timestamp;
import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hexaware.fastx.dto.SeatDto;
import com.hexaware.fastx.entities.Bus;
import com.hexaware.fastx.entities.Seat;
import com.hexaware.fastx.entities.Booking;
import com.hexaware.fastx.exception.ResourceNotFoundException;
import com.hexaware.fastx.repository.SeatRepository;
import com.hexaware.fastx.repository.BookingRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class SeatServiceImpl implements ISeatService {

    @Autowired
    SeatRepository seatRepository;
    
    @Autowired
    IBusService busService;

    @Autowired
    BookingRepository bookingRepository;

    @Override
    public Seat addSeat(SeatDto dto) {
        log.info("Adding seat: {}", dto.getSeatNumber());
        Bus bus = busService.getBusById(dto.getBusId());
        
        // Check if seat with same number already exists for this bus
        boolean seatExists = seatRepository.findByBusBusIdAndSeatNumber(bus.getBusId(), dto.getSeatNumber())
                .isPresent();
        if (seatExists) {
            throw new ResourceNotFoundException("Seat number " + dto.getSeatNumber() + " already exists for this bus");
        }

        Seat seat = dto.toEntity(bus);
        return seatRepository.save(seat);
    }

    @Override
    public Seat updateSeat(SeatDto dto) {
        log.info("Updating seat ID: {}", dto.getSeatId());
        
        Seat existingSeat = seatRepository.findById(dto.getSeatId())
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found with ID: " + dto.getSeatId()));

        // If seat number is being changed, check for duplicates
        if (!existingSeat.getSeatNumber().equals(dto.getSeatNumber())) {
            boolean duplicateSeat = seatRepository.findByBusBusIdAndSeatNumber(
                    existingSeat.getBus().getBusId(), dto.getSeatNumber())
                    .isPresent();
            if (duplicateSeat) {
                throw new ResourceNotFoundException("Seat number " + dto.getSeatNumber() + " already exists for this bus");
            }
        }

        Bus bus = busService.getBusById(dto.getBusId());
        Seat seat = dto.toEntity(bus);
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
    public List<Seat> getSeatsByBusIdAndDate(int busId, LocalDate travelDate) {
        log.info("Fetching seats for bus ID: {} and date: {}", busId, travelDate);

        // Fetch all seats for this bus
        List<Seat> allSeats = seatRepository.findByBusBusId(busId);
        if (allSeats.isEmpty()) {
            throw new ResourceNotFoundException("No seats found for bus ID: " + busId);
        }

        // Fetch bookings for this bus and date (exclude cancelled)
        Timestamp startOfDay = Timestamp.valueOf(travelDate.atStartOfDay());
        Timestamp endOfDay = Timestamp.valueOf(travelDate.plusDays(1).atStartOfDay());

        List<Booking> activeBookings = bookingRepository
                .findByBusBusIdAndTravelDateAndStatusNot(busId, startOfDay, endOfDay, "Cancelled");


        // Extract booked seatIds
        Set<Integer> bookedSeatIds = activeBookings.stream()
                .flatMap(b -> b.getSeats().stream())
                .map(Seat::getSeatId)
                .collect(Collectors.toSet());

        // Mark seats dynamically
        allSeats.forEach(seat -> {
            if (bookedSeatIds.contains(seat.getSeatId())) {
                seat.setSeatStatus("Booked");
            } else {
                seat.setSeatStatus("Available");
            }
        });

        return allSeats;
    }


    @Override
    public Map<String, Object> verifySeatsAvailability(int busId, LocalDate travelDate, List<Integer> seatIds) {
        log.info("Verifying availability for bus ID: {}, date: {}, seat IDs: {}", busId, travelDate, seatIds);

        Map<String, Object> result = new HashMap<>();

        List<Seat> seats = getSeatsByBusIdAndDate(busId, travelDate);

        List<Integer> unavailableSeats = seatIds.stream()
                .filter(seatId -> seats.stream()
                        .anyMatch(seat -> seat.getSeatId() == seatId && "Booked".equals(seat.getSeatStatus())))
                .toList();

        boolean allAvailable = unavailableSeats.isEmpty();

        result.put("allAvailable", allAvailable);
        result.put("unavailableSeats", unavailableSeats);
        result.put("requestedSeats", seatIds);
        result.put("busId", busId);
        result.put("date", travelDate);

        return result;
    }


    @Override
    public void bulkUpdateSeats(int busId, List<SeatDto> seatDtos) {
        log.info("Bulk updating {} seats for bus ID: {}", seatDtos.size(), busId);
        
        Bus bus = busService.getBusById(busId);

        // Delete existing seats for this bus (if any)
        List<Seat> existingSeats = seatRepository.findByBusBusId(busId);
        if (!existingSeats.isEmpty()) {
            // Check if any seats are booked
            boolean hasBookedSeats = existingSeats.stream()
                    .anyMatch(seat -> "Booked".equals(seat.getSeatStatus()));
            
            if (hasBookedSeats) {
                throw new ResourceNotFoundException("Cannot bulk update seats. Some seats are already booked.");
            }
            
            seatRepository.deleteAll(existingSeats);
        }

        // Create new seats
        List<Seat> newSeats = seatDtos.stream()
                .map(seatDto -> {
                    Seat seat = seatDto.toEntity(bus);
                    return seat;
                })
                .collect(Collectors.toList());

        seatRepository.saveAll(newSeats);
    }

    @Override
    public Seat updateSeatStatus(int seatId, String status) {
        log.info("Updating seat ID: {} status to: {}", seatId, status);
        
        if (!"Available".equals(status) && !"Booked".equals(status)) {
            throw new ResourceNotFoundException("Invalid seat status. Must be 'Available' or 'Booked'");
        }

        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found with ID: " + seatId));

        seat.setSeatStatus(status);
        return seatRepository.save(seat);
    }

    @Override
    public String deleteSeat(int seatId) {
        log.info("Deleting seat ID: {}", seatId);
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found with ID: " + seatId));
        
        // Check if seat is booked in any active booking
        boolean hasActiveBookings = bookingRepository.existsBySeatIdAndStatusNot(seatId, "Cancelled");
        if (hasActiveBookings) {
            throw new ResourceNotFoundException("Cannot delete seat. It is booked in active bookings.");
        }

        seatRepository.delete(seat);
        return "Seat deleted successfully";
    }

    @Override
    public List<Seat> getSeatsByBusIdAndSeatStatus(int busId, String seatStatus) {
        log.info("Fetching seats for bus ID: {} with status: {}", busId, seatStatus);
        List<Seat> seats = seatRepository.findByBusBusIdAndSeatStatus(busId, seatStatus);
        if (seats.isEmpty()) {
            throw new ResourceNotFoundException("No " + seatStatus + " seats found for bus ID: " + busId);
        }
        return seats;
    }

    @Override
    public List<Seat> getSeatsByBusIdAndSeatType(int busId, String seatType) {
        log.info("Fetching seats for bus ID: {} with type: {}", busId, seatType);
        List<Seat> seats = seatRepository.findByBusBusIdAndSeatType(busId, seatType);
        if (seats.isEmpty()) {
            throw new ResourceNotFoundException("No " + seatType + " seats found for bus ID: " + busId);
        }
        return seats;
    }

    @Override
    public List<Seat> getSeatsBySeatStatus(String seatStatus) {
        log.info("Fetching seats with status: {}", seatStatus);
        List<Seat> seats = seatRepository.findBySeatStatus(seatStatus);
        if (seats.isEmpty()) {
            throw new ResourceNotFoundException("No seats found with status: " + seatStatus);
        }
        return seats;
    }

    @Override
    public List<Seat> getSeatsBySeatType(String seatType) {
        log.info("Fetching seats with type: {}", seatType);
        List<Seat> seats = seatRepository.findBySeatType(seatType);
        if (seats.isEmpty()) {
            throw new ResourceNotFoundException("No seats found with type: " + seatType);
        }
        return seats;
    }
    
    @Transactional
    public void markSeatsAsBooked(List<Integer> seatIds, int busId) {
        List<Seat> seats = seatRepository.findByBusBusId(busId);
        log.info("Found {} seats for bus {} on {}", seats.size(), busId);

        for (Seat seat : seats) {
            if (seatIds.contains(seat.getSeatId())) {
                log.info("Booking seat {} (before status={})", seat.getSeatNumber(), seat.getSeatStatus());
                seat.setSeatStatus("Booked");
                log.info("Seat {} updated to status={}", seat.getSeatNumber(), seat.getSeatStatus());
            }
        }
    

        seatRepository.saveAll(seats);
    }

	
}

/*
 * package com.hexaware.fastx.service;
 * 
 * import java.util.List;
 * 
 * import org.springframework.beans.factory.annotation.Autowired; import
 * org.springframework.stereotype.Service;
 * 
 * import com.hexaware.fastx.dto.SeatDto; import
 * com.hexaware.fastx.entities.Bus; import com.hexaware.fastx.entities.Seat;
 * import com.hexaware.fastx.exception.ResourceNotFoundException; import
 * com.hexaware.fastx.repository.SeatRepository;
 * 
 * import lombok.extern.slf4j.Slf4j;
 * 
 *//**
	 * Service implementation for managing seat operations in the system.
	 *
	 * Responsibilities: - Add new seats - Update existing seat details - Retrieve
	 * seats by bus ID, seat status, or seat type - Delete a seat by its ID
	 *
	 * Uses {@link SeatRepository} for database interactions. Throws
	 * {@link ResourceNotFoundException} when a requested seat is not found.
	 *
	 * Logging (via Lombok's @Slf4j) is used to track key service operations, aiding
	 * in debugging, monitoring, and auditing.
	 *//*
		 * 
		 * @Slf4j
		 * 
		 * @Service public class SeatServiceImpl implements ISeatService {
		 * 
		 * @Autowired SeatRepository seatRepository;
		 * 
		 * @Autowired IBusService busService;
		 * 
		 * @Override public Seat addSeat(SeatDto dto) { log.info("Adding seat: {}",
		 * dto.getSeatNumber()); Bus bus = busService.getBusById(dto.getBusId()); Seat
		 * seat = dto.toEntity(bus);
		 * 
		 * 
		 * if (seat.getBus() != null && seat.getBus().getBusId() > 0) { Bus bus =
		 * busService.getBusById(seat.getBus().getBusId()); seat.setBus(bus); } else {
		 * throw new
		 * ResourceNotFoundException("Bus ID missing or invalid while adding seat"); }
		 * 
		 * 
		 * return seatRepository.save(seat); }
		 * 
		 * @Override public Seat updateSeat(SeatDto dto) {
		 * log.info("Updating seat ID: {}", dto.getSeatId());
		 * 
		 * if (!seatRepository.existsById(dto.getSeatId())) { throw new
		 * ResourceNotFoundException("Seat not found with ID: " + dto.getSeatId()); }
		 * 
		 * Bus bus = busService.getBusById(dto.getBusId()); Seat seat =
		 * dto.toEntity(bus);
		 * 
		 * if (!seatRepository.existsById(seat.getSeatId())) { throw new
		 * ResourceNotFoundException("Seat not found with ID: " + seat.getSeatId()); }
		 * 
		 * if (seat.getBus() != null && seat.getBus().getBusId() > 0) { Bus bus =
		 * busService.getBusById(seat.getBus().getBusId()); seat.setBus(bus); } else {
		 * throw new
		 * ResourceNotFoundException("Bus ID missing or invalid while updating seat"); }
		 * return
		 * 
		 * return seatRepository.save(seat); }
		 * 
		 * @Override public List<Seat> getSeatsByBusId(int busId) {
		 * log.info("Fetching seats for bus ID: {}", busId); List<Seat> seats =
		 * seatRepository.findByBusBusId(busId); if (seats.isEmpty()) { throw new
		 * ResourceNotFoundException("No seats found for bus ID: " + busId); } return
		 * seats; }
		 * 
		 * @Override public String deleteSeat(int seatId) {
		 * log.info("Deleting seat ID: {}", seatId); Seat seat =
		 * seatRepository.findById(seatId) .orElseThrow(() -> new
		 * ResourceNotFoundException("Seat not found with ID: " + seatId));
		 * seatRepository.delete(seat); return "Seat deleted successfully"; }
		 * 
		 * @Override public List<Seat> getSeatsByBusIdAndSeatStatus(int busId, String
		 * seatStatus) { log.info("Fetching seats for bus ID: {} with status: {}",
		 * busId, seatStatus); return seatRepository.findByBusBusIdAndSeatStatus(busId,
		 * seatStatus); }
		 * 
		 * @Override public List<Seat> getSeatsByBusIdAndSeatType(int busId, String
		 * seatType) { log.info("Fetching seats for bus ID: {} with type: {}", busId,
		 * seatType);
		 * 
		 * return seatRepository.findByBusBusIdAndSeatType(busId, seatType); }
		 * 
		 * @Override public List<Seat> getSeatsBySeatStatus(String seatStatus) {
		 * log.info("Fetching seats with status: {}", seatStatus); return
		 * seatRepository.findBySeatStatus(seatStatus); }
		 * 
		 * @Override public List<Seat> getSeatsBySeatType(String seatType) {
		 * log.info("Fetching seats with type: {}", seatType); return
		 * seatRepository.findBySeatType(seatType); } }
		 */
