package com.hexaware.fastx.dto;

import com.hexaware.fastx.entities.Booking;
import com.hexaware.fastx.entities.BookingSeat;
import com.hexaware.fastx.entities.Seat;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BookingSeatDto {
    private int bookingId;
    private int seatId;
    
    private String seatNumber;


    public BookingSeat toEntity() {
        BookingSeat bookingSeat = new BookingSeat();

        // only set IDs here (service will fetch full objects)
        Booking booking = new Booking();
        booking.setBookingId(this.bookingId);

        Seat seat = new Seat();
        seat.setSeatId(this.seatId);

        bookingSeat.setBooking(booking);
        bookingSeat.setSeat(seat);

        return bookingSeat;
    }
    
    public static BookingSeatDto fromEntity(BookingSeat bookingSeat) {
        BookingSeatDto dto = new BookingSeatDto();
        dto.setBookingId(bookingSeat.getBooking().getBookingId());
        dto.setSeatId(bookingSeat.getSeat().getSeatId());
        dto.setSeatNumber(bookingSeat.getSeat().getSeatNumber()); // extra field for readability
        return dto;
    }

}


/*
 * package com.hexaware.fastx.dto;
 * 
 * 
 * import jakarta.validation.constraints.Min; import
 * jakarta.validation.constraints.NotNull; import lombok.Data; import
 * lombok.NoArgsConstructor;
 * 
 * import com.hexaware.fastx.entities.BookingSeat;
 * 
 * @Data
 * 
 * @NoArgsConstructor public class BookingSeatDto {
 * 
 * 
 * private int id;
 * 
 * @Min(value = 1, message = "Booking ID must be greater than 0")
 * 
 * @NotNull private int bookingId;
 * 
 * @Min(value = 1, message = "Seat ID must be greater than 0")
 * 
 * @NotNull private int seatId;
 * 
 * 
 * public BookingSeat toEntity() { BookingSeat bookingSeat = new BookingSeat();
 * bookingSeat.setId(this.id); return bookingSeat; }
 * 
 * }
 */