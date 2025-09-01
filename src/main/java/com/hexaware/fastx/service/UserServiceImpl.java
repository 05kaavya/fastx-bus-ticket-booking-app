package com.hexaware.fastx.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hexaware.fastx.entities.Booking;
import com.hexaware.fastx.entities.User;
import com.hexaware.fastx.exception.DuplicateResourceException;
import com.hexaware.fastx.exception.ResourceNotFoundException;
import com.hexaware.fastx.repository.BookingRepository;
import com.hexaware.fastx.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Service implementation for managing user-related operations in the system.
 *
 * Responsibilities:
 * - Register new users with secure password encoding
 * - Handle user login
 * - Retrieve, update, and delete user details
 * - Fetch all users or search by name
 * - Check if a user exists by email
 * - Retrieve all bookings associated with a user
 * - Count the total number of registered users
 *
 * Uses {@link UserRepository} for user data access and {@link BookingRepository} for booking data.
 * Applies password encryption using {@link PasswordEncoder} before saving credentials.
 * Throws:
 * - {@link DuplicateResourceException} if a user already exists with the given email
 * - {@link ResourceNotFoundException} if a user or related resource is not found
 *
 * Logging (via Lombok's @Slf4j) is used to track service operations for monitoring and debugging.
 */


@Slf4j  // Enables logging using Lombok
@Service  // Marks this class as a Spring service bean
public class UserServiceImpl implements IUserService {

    @Autowired
    UserRepository userRepository; // Repository for performing CRUD operations on User entity

    @Autowired
    BookingRepository bookingRepository; // Repository for Booking entity
    
    @Autowired
    private PasswordEncoder passwordEncoder;  // Bean for securely hashing passwords

    @Override
    public User registerUser(User user) {
    	// Encode password before storing in database
    	String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
     // Log the registration attempt
    	log.info("Registering user: {}", user.getEmail());
    	
    	// Check if the email is already registered
    	 if (userRepository.existsByEmail(user.getEmail())) {
             throw new DuplicateResourceException("User already exists with email: " + user.getEmail());
         }
    	 // Save the user in DB
        return userRepository.save(user);
    }
    
    @Override
	public User loginUser(String email, String password) {
		log.info("Login with email:{}", email);
		return userRepository.findByEmailAndPassword(email, password);
	}

    @Override
    public User getUserById(int userId) {
    	// Log login attempt
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

	@Override
	public User getUserByEmail(String email) {
		 return userRepository.findByEmail(email).orElse(null);
	}
}