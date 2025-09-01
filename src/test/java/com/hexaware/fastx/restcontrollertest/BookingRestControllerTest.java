package com.hexaware.fastx.restcontrollertest;

import com.hexaware.fastx.dto.BookingDto;
import com.hexaware.fastx.dto.RouteDto;
import com.hexaware.fastx.dto.UserDto;
import com.hexaware.fastx.entities.Booking;
import com.hexaware.fastx.entities.Route;
import com.hexaware.fastx.entities.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class BookingRestControllerTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private int testUserId;
    private int testRouteId;

    private String baseUrl() {
        return "http://localhost:" + port + "/api/bookings";
    }

    @BeforeEach
    void setup() {
        // Create a valid User first
        UserDto userDto = new UserDto();
        userDto.setName("Test User");
        userDto.setEmail("testuser@example.com");
        userDto.setPassword("password123");
        userDto.setContactNumber("9876543210");

        ResponseEntity<User> userResponse = restTemplate.postForEntity(
                "http://localhost:" + port + "/api/users/register",
                userDto, User.class);

        assertEquals(HttpStatus.OK, userResponse.getStatusCode());
        testUserId = userResponse.getBody().getUserId();

        // Create a valid Route
        RouteDto routeDto = new RouteDto();
        routeDto.setOrigin("City A");
        routeDto.setDestination("City B");
        routeDto.setDistance(150.0);

        ResponseEntity<Route> routeResponse = restTemplate.postForEntity(
                "http://localhost:" + port + "/api/routes/add",
                routeDto, Route.class);

        assertEquals(HttpStatus.OK, routeResponse.getStatusCode());
        testRouteId = routeResponse.getBody().getRouteId();
    }

    @Test
    void testAddAndGetBooking() {
        BookingDto dto = new BookingDto();
        dto.setUserId(testUserId);
        dto.setRouteId(testRouteId);
        dto.setBookingDate(new Timestamp(System.currentTimeMillis()));
        dto.setTotalAmount(BigDecimal.valueOf(500));
        dto.setStatus("Confirmed");

        ResponseEntity<Booking> postResponse = restTemplate.postForEntity(
                baseUrl() + "/add", dto, Booking.class);

        assertEquals(HttpStatus.OK, postResponse.getStatusCode());
        assertNotNull(postResponse.getBody());

        int bookingId = postResponse.getBody().getBookingId();

        Booking fetched = restTemplate.getForObject(
                baseUrl() + "/get/" + bookingId, Booking.class);

        assertNotNull(fetched);
        assertEquals("Confirmed", fetched.getStatus());
    }

    @Test
    void testUpdateBooking() {
        // First add a booking
        BookingDto dto = new BookingDto();
        dto.setUserId(testUserId);
        dto.setRouteId(testRouteId);
        dto.setBookingDate(new Timestamp(System.currentTimeMillis()));
        dto.setTotalAmount(BigDecimal.valueOf(500));
        dto.setStatus("Confirmed");

        ResponseEntity<Booking> postResponse = restTemplate.postForEntity(
                baseUrl() + "/add", dto, Booking.class);

        Booking booking = postResponse.getBody();
        booking.setStatus("Cancelled");

        HttpEntity<Booking> requestEntity = new HttpEntity<>(booking);
        ResponseEntity<Booking> updateResponse = restTemplate.exchange(
                baseUrl() + "/update", HttpMethod.PUT, requestEntity, Booking.class);

        assertEquals(HttpStatus.OK, updateResponse.getStatusCode());
        assertEquals("Cancelled", updateResponse.getBody().getStatus());
    }

    @Test
    void testGetAllBookings() {
        ResponseEntity<List> response = restTemplate.getForEntity(
                baseUrl() + "/getall", List.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void testDeleteBooking() {
        // Add a booking to delete
        BookingDto dto = new BookingDto();
        dto.setUserId(testUserId);
        dto.setRouteId(testRouteId);
        dto.setBookingDate(new Timestamp(System.currentTimeMillis()));
        dto.setTotalAmount(BigDecimal.valueOf(500));
        dto.setStatus("Pending");

        ResponseEntity<Booking> postResponse = restTemplate.postForEntity(
                baseUrl() + "/add", dto, Booking.class);

        int bookingId = postResponse.getBody().getBookingId();

        restTemplate.delete(baseUrl() + "/delete/" + bookingId);

        ResponseEntity<Booking> getResponse = restTemplate.getForEntity(
                baseUrl() + "/get/" + bookingId, Booking.class);

        assertEquals(HttpStatus.OK, getResponse.getStatusCode());
        assertNull(getResponse.getBody());
    }
}

