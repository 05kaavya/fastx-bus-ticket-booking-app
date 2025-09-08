package com.hexaware.fastx.restcontroller;

import com.hexaware.fastx.dto.UserDto;
import com.hexaware.fastx.entities.User;
import com.hexaware.fastx.entities.Booking;
import com.hexaware.fastx.service.IUserService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/users")
public class UserRestController {

    @Autowired
    private IUserService service;

    @PreAuthorize("permitAll()")
    @PostMapping("/register")
    public User registerUser(@RequestBody UserDto dto) {
        User user = dto.toEntity();
        return service.registerUser(user);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/get/{userId}")
    public User getUserById(@PathVariable int userId) {
    	log.info("Fetching user by ID: {}",userId);
        return service.getUserById(userId);
    }

    @PreAuthorize("hasAnyAuthority('USER','ADMIN')")
    @PutMapping("/update")
    public User updateUser(@RequestBody UserDto dto) {
        User user = dto.toEntity();
        return service.updateUser(user);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/getall")
    public List<User> getAllUsers() {
    	log.info("Fetching all users");
        return service.getAllUsers();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/delete/{userId}")
    public String deleteUser(@PathVariable int userId) {
    	log.info("Deleting user with ID: {}",userId);
        return service.deleteUser(userId);
    }

    @PreAuthorize("hasAnyAuthority('USER','ADMIN')")
    @GetMapping("/name/{name}")
    public User getUserByName(@PathVariable String name) {
    	log.info("Fetching user by name: {}",name);
        return service.getUserByName(name);
    }

    @PreAuthorize("hasAnyAuthority('USER','ADMIN')")
    @GetMapping("/exists/{email}")
    public boolean isUserExists(@PathVariable String email) {
    	log.info("Checking if user exists with email: {}", email);
        return service.isUserExists(email);
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/{userId}/bookings")
    public List<Booking> getAllBookingsByUserId(@PathVariable int userId) {
    	log.info("Fetching bookings for user ID: {}", userId);
        return service.getAllBookingsByUserId(userId);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/count")
    public long countTotalUsers() {
    	log.info("Counting total users");
        return service.countTotalUsers();
    }
    
    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/me")
    public User getCurrentUser(@AuthenticationPrincipal org.springframework.security.core.userdetails.User userDetails) {
        log.info("Fetching logged-in user details for: {}", userDetails.getUsername());
        return service.getUserByEmail(userDetails.getUsername()); // assuming username = email in JWT
    }

}
