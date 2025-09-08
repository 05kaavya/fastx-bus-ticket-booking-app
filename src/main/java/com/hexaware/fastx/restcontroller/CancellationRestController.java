package com.hexaware.fastx.restcontroller;

import com.hexaware.fastx.dto.CancellationDto;
import com.hexaware.fastx.entities.Cancellation;
import com.hexaware.fastx.service.ICancellationService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/cancellations")
public class CancellationRestController {

    @Autowired
    private ICancellationService service;

    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/cancel")
    public Cancellation cancelBooking(@RequestBody CancellationDto dto) {
    	
    	   log.info("Cancelling booking ID: {}", dto.getBookingId());
           return service.cancelBooking(dto.toEntity());
       }

    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN') or hasAuthority('OPERATOR')")
    @GetMapping("/booking/{bookingId}")
    public Cancellation getCancellationByBookingId(@PathVariable int bookingId) {
    	 log.info("Fetching cancellation for booking ID: {}", bookingId);
        return service.getCancellationByBookingId(bookingId);
    }

    @GetMapping("/user/{userId}")
    public List<Cancellation> getCancellationsByUserId(@PathVariable int userId) {
    	log.info("Fetching cancellations for user ID: {}", userId);
        return service.getCancellationsByUserId(userId);
    }

    @GetMapping("/status/{refundStatus}")
    public List<Cancellation> getCancellationsByStatus(@PathVariable String refundStatus) {
    	log.info("Fetching cancellations with refund status: {}", refundStatus);
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
    
 // Add this to your CancellationRestController
    @PreAuthorize("hasAuthority('OPERATOR')")
    @PostMapping("/{cancellationId}/refund")
    public ResponseEntity<String> processRefund(@PathVariable int cancellationId) {
        log.info("Processing refund for cancellation ID: {}", cancellationId);
        
        boolean success = service.processRefund(cancellationId);
        
        if (success) {
            return ResponseEntity.ok("Refund processed successfully");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to process refund");
        }
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Cancellation> getAllCancellations() {
        log.info("Fetching all cancellations");
        return service.getAllCancellations();
    }
    
    @PreAuthorize("hasAuthority('OPERATOR')")
    @PutMapping("/{cancellationId}/status")
    public ResponseEntity<Cancellation> updateRefundStatus(
            @PathVariable int cancellationId, 
            @RequestBody Map<String, String> statusUpdate) {
        
        log.info("Updating refund status for cancellation ID: {}", cancellationId);
        
        String newStatus = statusUpdate.get("status");
        Cancellation updatedCancellation = service.updateRefundStatus(cancellationId, newStatus);
        
        return ResponseEntity.ok(updatedCancellation);
    }
}

