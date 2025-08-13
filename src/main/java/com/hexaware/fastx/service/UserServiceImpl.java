package com.hexaware.fastx.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.fastx.entities.Booking;
import com.hexaware.fastx.entities.User;
import com.hexaware.fastx.exception.DuplicateResourceException;
import com.hexaware.fastx.exception.ResourceNotFoundException;
import com.hexaware.fastx.repository.BookingRepository;
import com.hexaware.fastx.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserServiceImpl implements IUserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    BookingRepository bookingRepository;

    @Override
    public User registerUser(User user) {
    	log.info("Registering user: {}", user.getEmail());
    	 if (userRepository.existsByEmail(user.getEmail())) {
             throw new DuplicateResourceException("User already exists with email: " + user.getEmail());
         }
        return userRepository.save(user);
    }

    @Override
    public User getUserById(int userId) {
    	 log.info("Fetching user by ID: {}", userId);
        return userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
    }

    @Override
    public User updateUser(User user) {
    	log.info("Updating user ID: {}", user.getUserId());
    	if (!userRepository.existsById(user.getUserId())) {
            throw new ResourceNotFoundException("User not found with ID: " + user.getUserId());
        }
        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
    	log.info("Fetching all users");
    	List<User> users = userRepository.findAll();
        if (users.isEmpty()) {
            throw new ResourceNotFoundException("No users found");
        }
        return users;
    }

    @Override
    public String deleteUser(int userId) {
    	log.info("Deleting user ID: {}", userId);
    	User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
    	userRepository.delete(user);
        return "User deleted successfully";
    }

    @Override
    public User getUserByName(String name) {
    	User user = userRepository.findByName(name);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with name: " + name);
        }
        return user;
    }

    @Override
    public boolean isUserExists(String email) {
    	log.info("Checking if user exists by email: {}", email);
        return userRepository.existsByEmail(email);
    }

    @Override
    public List<Booking> getAllBookingsByUserId(int userId) {
    	User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        if (user.getBookings() == null || user.getBookings().isEmpty()) {
            throw new ResourceNotFoundException("No bookings found for user ID: " + userId);
        }
        return user.getBookings();
    }

    @Override
    public long countTotalUsers() {
    	log.info("Counting total registered users");
        return userRepository.count();
    }
}