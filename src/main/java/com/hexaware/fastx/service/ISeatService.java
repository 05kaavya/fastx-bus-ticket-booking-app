package com.hexaware.fastx.service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Map;

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
	public void bulkUpdateSeats(int busId, List<SeatDto> seats);
	public Seat updateSeatStatus(int seatId, String status);
	public List<Seat> getSeatsByBusIdAndDate(int busId, LocalDate date);
	public Map<String, Object> verifySeatsAvailability(int busId, LocalDate date, List<Integer> seatIds);
	//public Map<String, Object> verifySeatsAvailability(int busId, java.util.Date date, List<Integer> seatIds);
	//List<Seat> getSeatsByBusIdAndDate(int busId, java.util.Date date);
	public void markSeatsAsBooked(List<Integer> seatIds, int busId);


}
