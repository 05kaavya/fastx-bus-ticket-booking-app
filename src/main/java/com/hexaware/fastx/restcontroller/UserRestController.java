package com.hexaware.fastx.restcontroller;

import com.hexaware.fastx.dto.UserDto;
import com.hexaware.fastx.entities.User;
import com.hexaware.fastx.entities.Booking;
import com.hexaware.fastx.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserRestController {

    @Autowired
    private IUserService service;

    @PostMapping("/register")
    public User registerUser(@RequestBody UserDto dto) {
        User user = dto.toEntity();
        return service.registerUser(user);
    }

    @GetMapping("/get/{userId}")
    public User getUserById(@PathVariable int userId) {
        return service.getUserById(userId);
    }

    @PutMapping("/update")
    public User updateUser(@RequestBody UserDto dto) {
        User user = dto.toEntity();
        return service.updateUser(user);
    }

    @GetMapping("/getall")
    public List<User> getAllUsers() {
        return service.getAllUsers();
    }

    @DeleteMapping("/delete/{userId}")
    public String deleteUser(@PathVariable int userId) {
        return service.deleteUser(userId);
    }

    @GetMapping("/name/{name}")
    public User getUserByName(@PathVariable String name) {
        return service.getUserByName(name);
    }

    @GetMapping("/exists/{email}")
    public boolean isUserExists(@PathVariable String email) {
        return service.isUserExists(email);
    }

    @GetMapping("/{userId}/bookings")
    public List<Booking> getAllBookingsByUserId(@PathVariable int userId) {
        return service.getAllBookingsByUserId(userId);
    }

    @GetMapping("/count")
    public long countTotalUsers() {
        return service.countTotalUsers();
    }
}
