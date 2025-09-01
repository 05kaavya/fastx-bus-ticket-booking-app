package com.hexaware.fastx.entities;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@NoArgsConstructor
@Table(name="users")
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int userId;
    private String name;
    private String email;
    private String password;
    private String gender;
    private String contactNumber;
    private String address;
    private String role;
   // private String role = "USER";
    
    @CreationTimestamp
    @Column(updatable = false)
    private Timestamp createdAt;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL,fetch=FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private List<Booking> bookings = new ArrayList<>();

}
