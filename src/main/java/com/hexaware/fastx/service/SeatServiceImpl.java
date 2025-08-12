package com.hexaware.fastx.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.fastx.entities.Seat;
import com.hexaware.fastx.repository.SeatRepository;

@Service
public class SeatServiceImpl implements ISeatService {

    @Autowired
    SeatRepository seatRepository;

    @Override
    public Seat addSeat(Seat seat) {
        return seatRepository.save(seat);
    }

    @Override
    public Seat updateSeat(Seat seat) {
        return seatRepository.save(seat);
    }

    @Override
    public List<Seat> getSeatsByBusId(int busId) {
        return seatRepository.findByBusBusId(busId);
    }

    @Override
    public String deleteSeat(int seatId) {
        seatRepository.deleteById(seatId);
        return "Seat deleted successfully: " + seatId;
    }

    @Override
    public List<Seat> getSeatsByBusIdAndSeatStatus(int busId, String seatStatus) {
        return seatRepository.findByBusBusIdAndSeatStatus(busId, seatStatus);
    }

    @Override
    public List<Seat> getSeatsByBusIdAndSeatType(int busId, String seatType) {
        return seatRepository.findByBusBusIdAndSeatType(busId, seatType);
    }

    @Override
    public List<Seat> getSeatsBySeatStatus(String seatStatus) {
        return seatRepository.findBySeatStatus(seatStatus);
    }

    @Override
    public List<Seat> getSeatsBySeatType(String seatType) {
        return seatRepository.findBySeatType(seatType);
    }
}
