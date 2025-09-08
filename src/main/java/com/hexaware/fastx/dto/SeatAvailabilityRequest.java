package com.hexaware.fastx.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
//import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatAvailabilityRequest {
    private int busId;
    private LocalDate date;
    private List<Integer> seatIds;
}