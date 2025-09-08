package com.hexaware.fastx.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.hexaware.fastx.entities.BusOperator;


@Data
@NoArgsConstructor
public class BusOperatorDto {
    private int operatorId;

    @NotBlank(message = "Name cannot be blank")
    @Pattern(regexp = "^[A-Za-z ]+$", message = "Name must contain only letters and spaces")
    private String operatorName;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email cannot be blank")
    private String email;
    
    @Pattern(regexp = "^(?=.{8,20}$)(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$",
    	     message = "Password must be 8-20 chars, include upper & lower case letters, a digit and a special character")
    private String password;

    @NotBlank(message = "Contact number cannot be blank")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid contact number")
    private String contactNumber;

    private String address;
    
    private String role ="OPERATOR";

	
	  public BusOperator toEntity() {
		  BusOperator operator = new BusOperator();
	  operator.setOperatorId(this.operatorId); 
	  operator.setOperatorName(this.operatorName);
	  operator.setEmail(this.email); 
	  operator.setPassword(this.password);
	  operator.setContactNumber(this.contactNumber);
	  operator.setAddress(this.address);
	  operator.setRole(this.role);
	  return operator; }
	 
}
