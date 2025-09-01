package com.hexaware.fastx.entities;

import java.sql.Timestamp;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
//import jakarta.persistence.CascadeType;
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
@Table(name="bus_operators")
public class BusOperator {
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int operatorId;

    private String operatorName;
    private String email;
    private String password;
    private String contactNumber;   
    private String address;

    private String role="OPERATOR";
    
    @CreationTimestamp
    @Column(updatable = false)
    private Timestamp createdAt;
    
    @OneToMany(mappedBy = "operator", fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private List<Bus> buses;
}
