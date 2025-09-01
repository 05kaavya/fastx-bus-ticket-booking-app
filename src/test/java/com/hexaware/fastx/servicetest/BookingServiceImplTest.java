package com.hexaware.fastx.servicetest;


import com.hexaware.fastx.dto.BookingDto;
import com.hexaware.fastx.entities.Booking;
import com.hexaware.fastx.entities.Route;
import com.hexaware.fastx.entities.User;
import com.hexaware.fastx.service.IBookingService;
import com.hexaware.fastx.service.IRouteService;
import com.hexaware.fastx.service.IUserService;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class BookingServiceImplTest {

    @Autowired
    private IBookingService bookingService;

    @Autowired
    private IUserService userService;

    @Autowired
    private IRouteService routeService;

    static int createdBookingId;
    static int testUserId;
    static int testRouteId;

    @BeforeAll
    static void setupTestData(@Autowired IUserService userService, @Autowired IRouteService routeService) {
        // Create a user
        User user = new User();
        user.setName("Booking Test User");
        user.setEmail("bookingtest" + System.currentTimeMillis() + "@mail.com");
        user.setPassword("Test@123");
        user.setGender("Male");
        user.setContactNumber("9876543210");
        user.setAddress("Test Address");
        testUserId = userService.registerUser(user).getUserId();

        // Create a route
        Route route = new Route();
        route.setOrigin("City A");
        route.setDestination("City B");
        route.setDistance(150);
        route.setFare(BigDecimal.valueOf(500));
        testRouteId = routeService.addRoute(route).getRouteId();
    }

    @Test
    @Order(1)
    void testAddBooking() {
        BookingDto dto = new BookingDto();
        dto.setUserId(testUserId);
        dto.setRouteId(testRouteId);
        dto.setBookingDate(Timestamp.from(Instant.now()));
        dto.setTotalAmount(BigDecimal.valueOf(500));
        dto.setStatus("CONFIRMED");

        Booking savedBooking = bookingService.addBooking(dto);
        assertNotNull(savedBooking);
        createdBookingId = savedBooking.getBookingId();
        assertEquals("CONFIRMED", savedBooking.getStatus());
    }

    @Test
    @Order(2)
    void testGetBookingById() {
        Booking fetched = bookingService.getBookingById(createdBookingId);
        assertNotNull(fetched);
        assertEquals(createdBookingId, fetched.getBookingId());
    }

    @Test
    @Order(3)
    void testUpdateBooking() {
        Booking existing = bookingService.getBookingById(createdBookingId);
        existing.setStatus("CANCELLED");

        Booking updated = bookingService.updateBooking(existing);
        assertNotNull(updated);
        assertEquals("CANCELLED", updated.getStatus());
    }

    @Test
    @Order(4)
    void testGetAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        assertTrue(bookings.size() > 0);
    }

    @Test
    @Order(5)
    void testDeleteBooking() {
        String result = bookingService.deleteByBookingId(createdBookingId);
        assertTrue(result.contains("deleted"));
    }
}

