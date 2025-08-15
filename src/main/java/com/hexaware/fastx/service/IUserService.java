package com.hexaware.fastx.service;

import java.util.List;

import com.hexaware.fastx.entities.Booking;
import com.hexaware.fastx.entities.User;



	public interface IUserService {
		
		public User registerUser(User user);
		public User loginUser(String email, String password);
		public User getUserById(int userId);
		public User updateUser(User user);
		public List<User> getAllUsers();
		public String deleteUser(int userId);
		public User getUserByName(String name);
		public boolean isUserExists(String email);
		public List<Booking> getAllBookingsByUserId(int userId);
		public long countTotalUsers();
	}
	
