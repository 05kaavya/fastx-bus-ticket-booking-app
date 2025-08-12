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
@Table(name="bus_operators")
public class BusOperator {
	
	
	@Id
	private int operatorId;

    private String operatorName;
    private String email;
    private String password;
    private String contactNumber;

   
    private String address;

    private Timestamp createdAt;
    
    @OneToMany(mappedBy = "operator", cascade = CascadeType.ALL)
    private List<Bus> buses;
}
