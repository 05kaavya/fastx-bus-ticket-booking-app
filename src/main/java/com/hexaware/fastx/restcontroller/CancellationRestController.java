package com.hexaware.fastx.restcontroller;

import com.hexaware.fastx.dto.CancellationDto;
import com.hexaware.fastx.entities.Cancellation;
import com.hexaware.fastx.service.ICancellationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/cancellations")
public class CancellationRestController {

    @Autowired
    private ICancellationService service;

    @PostMapping("/cancel")
    public Cancellation cancelBooking(@RequestBody CancellationDto dto) {
        Cancellation cancellation = dto.toEntity();
        return service.cancelBooking(cancellation);
    }

    @GetMapping("/booking/{bookingId}")
    public Cancellation getCancellationByBookingId(@PathVariable int bookingId) {
        return service.getCancellationByBookingId(bookingId);
    }

    @GetMapping("/user/{userId}")
    public List<Cancellation> getCancellationsByUserId(@PathVariable int userId) {
        return service.getCancellationsByUserId(userId);
    }

    @GetMapping("/status/{refundStatus}")
    public List<Cancellation> getCancellationsByStatus(@PathVariable String refundStatus) {
        return service.getCancellationsByStatus(refundStatus);
    }

    @GetMapping("/isCancelled/{bookingId}")
    public boolean isBookingCancelled(@PathVariable int bookingId) {
        return service.isBookingCancelled(bookingId);
    }

    @GetMapping("/totalRefunds/{cancellationDate}")
    public BigDecimal getTotalRefundsIssuedByDate(@PathVariable LocalDate cancellationDate) {
        return service.getTotalRefundsIssuedByDate(cancellationDate);
    }
}

