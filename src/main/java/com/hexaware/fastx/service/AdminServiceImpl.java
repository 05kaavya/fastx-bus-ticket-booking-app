package com.hexaware.fastx.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.fastx.entities.Admin;
import com.hexaware.fastx.exception.DuplicateResourceException;
import com.hexaware.fastx.exception.ResourceNotFoundException;
import com.hexaware.fastx.repository.AdminRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AdminServiceImpl implements IAdminService {

	@Autowired
	AdminRepository adminRepository;
	
	@Override
	public Admin getAdminById(int adminId) {
		
		return adminRepository.findById(adminId).orElseThrow(() -> new ResourceNotFoundException("Admin not found with ID: " + adminId));
	}

	@Override
	public List<Admin> getAllAdmins() {
		 log.info("Fetching all admins");
		return adminRepository.findAll();
	}

	@Override
	public Admin addAdmin(Admin admin) {
		log.info("Adding new admin: {}", admin.getEmail());
		if (adminRepository.findByName(admin.getName()) != null) {
	        throw new DuplicateResourceException("Admin already exists with name: " + admin.getName());
	    }
		
		return adminRepository.save(admin);
	}

	@Override
	public String deleteAdminById(int adminId) {
		Admin admin = adminRepository.findById(adminId)
		        .orElseThrow(() -> new ResourceNotFoundException("Admin not found with ID: " + adminId));	
		adminRepository.delete(admin);
		return "Admin deleted successfully : " +adminId;
	}

	@Override
	public Admin getAdminByName(String name) {
		 log.info("Fetching admin by name: {}", name);
		return adminRepository.findByName(name);
	}

}
