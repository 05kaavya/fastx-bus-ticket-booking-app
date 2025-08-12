package com.hexaware.fastx.dto;

//import com.hexaware.fastx.entities.Admin;

import lombok.Data;
import lombok.NoArgsConstructor;

import com.hexaware.fastx.entities.Admin;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;



@Data
@NoArgsConstructor
public class AdminDto {
	
	
    private int adminId;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email cannot be blank")
    private String email;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Name cannot be blank")
    @Pattern(regexp = "^[A-Za-z ]+$", message = "Name must contain only letters and spaces")
    private String name;

	

	
	  public Admin toEntity() { 
		  Admin admin = new Admin();
	  admin.setAdminId(this.adminId); 
	  admin.setEmail(this.email);
	  admin.setPassword(this.password); 
	  admin.setName(this.name); 
	  return admin; 
	  }
	 
}

