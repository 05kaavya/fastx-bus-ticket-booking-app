package com.hexaware.fastx.service;

import java.util.List;

import com.hexaware.fastx.dto.SeatDto;
import com.hexaware.fastx.entities.Seat;

public interface ISeatService {
	
	public Seat addSeat(SeatDto dto);
	public Seat updateSeat(SeatDto dto);
    public List<Seat> getSeatsByBusId(int busId);
    public String deleteSeat(int seatId);
    public List<Seat> getSeatsByBusIdAndSeatStatus(int busId, String seatStatus);
    public List<Seat> getSeatsByBusIdAndSeatType(int busId, String seatType);
    public List<Seat> getSeatsBySeatStatus(String seatStatus);
    public List<Seat> getSeatsBySeatType(String seatType);


}
