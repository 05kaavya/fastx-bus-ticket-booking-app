package com.hexaware.fastx.servicetest;

import com.hexaware.fastx.dto.UserDto;
import com.hexaware.fastx.entities.User;
import com.hexaware.fastx.service.IUserService;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class UserServiceImplTest {

    @Autowired
    private IUserService userService;

    static int createdUserId;

    @Test
    @Order(1)
    void testRegisterUser() {
        UserDto dto = new UserDto();
        dto.setName("Test User");
        dto.setEmail("testuser" + System.currentTimeMillis() + "@mail.com");
        dto.setPassword("Test@1234");
        dto.setGender("Male");
        dto.setContactNumber("9876543210");
        dto.setAddress("Test Address");

        User savedUser = userService.registerUser(dto.toEntity());
        assertNotNull(savedUser);
        createdUserId = savedUser.getUserId();
        assertEquals("Test User", savedUser.getName());
    }

    @Test
    @Order(2)
    void testGetUserById() {
        User fetched = userService.getUserById(createdUserId);
        assertNotNull(fetched);
        assertEquals(createdUserId, fetched.getUserId());
    }

    @Test
    @Order(3)
    void testUpdateUser() {
        User existing = userService.getUserById(createdUserId);
        existing.setAddress("Updated Address");

        User updated = userService.updateUser(existing);
        assertNotNull(updated);
        assertEquals("Updated Address", updated.getAddress());
    }

    @Test
    @Order(4)
    void testGetAllUsers() {
        List<User> users = userService.getAllUsers();
        assertTrue(users.size() > 0);
    }

    @Test
    @Order(5)
    void testDeleteUser() {
        String result = userService.deleteUser(createdUserId);
        assertTrue(result.contains("deleted"));
    }
}

