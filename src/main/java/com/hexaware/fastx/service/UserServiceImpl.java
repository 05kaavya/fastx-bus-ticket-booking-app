package com.hexaware.fastx.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.fastx.entities.Booking;
import com.hexaware.fastx.entities.User;
import com.hexaware.fastx.repository.BookingRepository;
import com.hexaware.fastx.repository.UserRepository;

@Service
public class UserServiceImpl implements IUserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    BookingRepository bookingRepository;

    @Override
    public User registerUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User getUserById(int userId) {
        return userRepository.findById(userId).orElse(null);
    }

    @Override
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public String deleteUser(int userId) {
        userRepository.deleteById(userId);
        return "User deleted successfully: " + userId;
    }

    @Override
    public User getUserByName(String name) {
        return userRepository.findByName(name);
    }

    @Override
    public boolean isUserExists(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public List<Booking> getAllBookingsByUserId(int userId) {
        return bookingRepository.findByUserUserId(userId);
    }

    @Override
    public long countTotalUsers() {
        return userRepository.count();
    }
}