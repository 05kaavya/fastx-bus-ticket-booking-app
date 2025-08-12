package com.hexaware.fastx.entities;

import java.security.Timestamp;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name="users")
public class User {
	
	@Id
	private int userId;
    private String name;
    private String email;
    private String password;
    private String gender;
    private String contactNumber;
    private String address;
    private Timestamp createdAt;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Booking> bookings;
}
