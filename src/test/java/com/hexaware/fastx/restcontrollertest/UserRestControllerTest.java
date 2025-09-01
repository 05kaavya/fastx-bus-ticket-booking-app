package com.hexaware.fastx.restcontrollertest;

import com.hexaware.fastx.dto.UserDto;
import com.hexaware.fastx.entities.User;
//import com.hexaware.fastx.entities.Booking;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserRestControllerTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private int createdUserId;
    private String baseUrl() {
        return "http://localhost:" + port + "/api/users";
    }

    private UserDto createSampleUserDto(String name) {
        UserDto dto = new UserDto();
        dto.setName(name);
        dto.setEmail("user" + System.currentTimeMillis() + "@example.com"); // unique
        dto.setPassword("Password@123"); // matches regex
        dto.setGender("Female");
        dto.setContactNumber("9876543210");
        dto.setAddress("Some address");
        return dto;
    }

    @BeforeEach
    void setup() {
        UserDto dto = createSampleUserDto("Test User");
        ResponseEntity<User> response = restTemplate.postForEntity(
                baseUrl() + "/register", dto, User.class);

        assertEquals(HttpStatus.OK, response.getStatusCode(), "User registration failed");
        assertNotNull(response.getBody(), "User response body is null");

        createdUserId = response.getBody().getUserId();
    }

    @Test
    void testRegisterAndGetUser() {
        UserDto dto = createSampleUserDto("New User");
        ResponseEntity<User> postResponse = restTemplate.postForEntity(
                baseUrl() + "/register", dto, User.class);

        assertEquals(HttpStatus.OK, postResponse.getStatusCode());
        assertNotNull(postResponse.getBody());
        assertEquals("New User", postResponse.getBody().getName());

        int newUserId = postResponse.getBody().getUserId();

        ResponseEntity<User> getResponse = restTemplate.getForEntity(
                baseUrl() + "/get/" + newUserId, User.class);

        assertEquals(HttpStatus.OK, getResponse.getStatusCode());
        assertNotNull(getResponse.getBody());
        assertEquals("New User", getResponse.getBody().getName());
    }

    @Test
    void testGetAllUsers() {
        ResponseEntity<List> response = restTemplate.getForEntity(
                baseUrl() + "/getall", List.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().size() > 0);
    }

    @Test
    void testUpdateUser() {
        UserDto updateDto = createSampleUserDto("Updated Name");
        updateDto.setUserId(createdUserId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UserDto> request = new HttpEntity<>(updateDto, headers);

        ResponseEntity<User> response = restTemplate.exchange(
                baseUrl() + "/update", HttpMethod.PUT, request, User.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Updated Name", response.getBody().getName());
    }

    @Test
    void testDeleteUser() {
        UserDto dto = createSampleUserDto("To Delete");
        ResponseEntity<User> postResponse = restTemplate.postForEntity(
                baseUrl() + "/register", dto, User.class);

        int deleteId = postResponse.getBody().getUserId();
        restTemplate.delete(baseUrl() + "/delete/" + deleteId);

        ResponseEntity<User> getResponse = restTemplate.getForEntity(
                baseUrl() + "/get/" + deleteId, User.class);

        assertEquals(HttpStatus.OK, getResponse.getStatusCode());
        assertNull(getResponse.getBody());
    }

	/*
	 * @Test void testGetUserByName() { ResponseEntity<User> response =
	 * restTemplate.getForEntity( baseUrl() + "/name/" + "Test User", User.class);
	 * 
	 * assertEquals(HttpStatus.OK, response.getStatusCode());
	 * assertNotNull(response.getBody()); assertEquals("Test User",
	 * response.getBody().getName()); }
	 */

    @Test
    void testIsUserExists() {
        ResponseEntity<Boolean> response = restTemplate.getForEntity(
                baseUrl() + "/exists/" + "user" + System.currentTimeMillis() + "@example.com", Boolean.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void testCountTotalUsers() {
        ResponseEntity<Long> response = restTemplate.getForEntity(
                baseUrl() + "/count", Long.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() > 0);
    }
}

