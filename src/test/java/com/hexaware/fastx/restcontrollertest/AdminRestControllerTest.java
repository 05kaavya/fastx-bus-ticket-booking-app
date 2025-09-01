package com.hexaware.fastx.restcontrollertest;

import com.hexaware.fastx.dto.AdminDto;
import com.hexaware.fastx.entities.Admin;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AdminRestControllerTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private String baseUrl() {
        return "http://localhost:" + port + "/api/admins";
    }

    @Test
    void testAddAndGetAdmin() {
        // Create DTO
        AdminDto dto = new AdminDto();
        dto.setEmail("testadmin@example.com");
        dto.setPassword("password123");
        dto.setName("Test Admin");

        // Add Admin
        ResponseEntity<Admin> postResponse = restTemplate.postForEntity(baseUrl() + "/add", dto, Admin.class);
        assertEquals(HttpStatus.OK, postResponse.getStatusCode());
        assertNotNull(postResponse.getBody());
        assertEquals("Test Admin", postResponse.getBody().getName());

        int adminId = postResponse.getBody().getAdminId();

        // Get by ID
        Admin fetched = restTemplate.getForObject(baseUrl() + "/get/" + adminId, Admin.class);
        assertNotNull(fetched);
        assertEquals("Test Admin", fetched.getName());
    }

    @Test
    void testGetAllAdmins() {
        ResponseEntity<List> response = restTemplate.getForEntity(baseUrl() + "/getall", List.class);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().size() >= 0);
    }

    @Test
    void testGetAdminByName() {
        // First insert
        AdminDto dto = new AdminDto();
        dto.setEmail("namecheck@example.com");
        dto.setPassword("password456");
        dto.setName("Name Check");

        restTemplate.postForEntity(baseUrl() + "/add", dto, Admin.class);

        // Get by name
        ResponseEntity<Admin> response = restTemplate.getForEntity(baseUrl() + "/name/Name Check", Admin.class);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Name Check", response.getBody().getName());
    }

    @Test
    void testDeleteAdmin() {
        // First insert
        AdminDto dto = new AdminDto();
        dto.setEmail("deletecheck@example.com");
        dto.setPassword("password789");
        dto.setName("Delete Check");

        ResponseEntity<Admin> postResponse = restTemplate.postForEntity(baseUrl() + "/add", dto, Admin.class);
        int adminId = postResponse.getBody().getAdminId();

        // Delete admin
        restTemplate.delete(baseUrl() + "/delete/" + adminId);

        // Verify deletion
        ResponseEntity<Admin> getResponse = restTemplate.getForEntity(baseUrl() + "/get/" + adminId, Admin.class);
        assertEquals(HttpStatus.OK, getResponse.getStatusCode());
        assertNull(getResponse.getBody());
    }
}


