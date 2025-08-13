package com.hexaware.fastx.dto;

import java.util.ArrayList;

import com.hexaware.fastx.entities.User;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserDto {
    private int userId;

    @NotBlank(message = "Name cannot be blank")
    @Pattern(regexp = "^[A-Za-z ]+$", message = "Name must contain only letters and spaces")
    private String name;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email cannot be blank")
    private String email;
    
    @Pattern(regexp = "^(?=.{8,20}$)(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$",
     message = "Password must be 8-20 chars, include upper & lower case letters, a digit and a special character")
    private String password;

    private String gender;

    @NotBlank(message = "Contact number cannot be blank")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid contact number")
    private String contactNumber;

    private String address;

	
    public User toEntity() {
        User user = new User();
        if (this.userId != 0) { // only set if non-zero
            user.setUserId(this.userId);
        }
        user.setName(this.name);
        user.setEmail(this.email);
        user.setPassword(this.password);
        user.setGender(this.gender);
        user.setContactNumber(this.contactNumber);
        user.setAddress(this.address);
        user.setBookings(new ArrayList<>());
        return user;
    }
	 
}
