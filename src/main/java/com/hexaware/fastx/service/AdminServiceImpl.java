package com.hexaware.fastx.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.fastx.entities.Admin;
import com.hexaware.fastx.repository.AdminRepository;

@Service
public class AdminServiceImpl implements IAdminService {

	@Autowired
	AdminRepository adminRepository;
	
	@Override
	public Admin getAdminById(int adminId) {
		
		return adminRepository.findById(adminId).orElse(null);
	}

	@Override
	public List<Admin> getAllAdmins() {
		
		return adminRepository.findAll();
	}

	@Override
	public Admin addAdmin(Admin admin) {
		
		return adminRepository.save(admin);
	}

	@Override
	public String deleteAdminById(int adminId) {
		
		adminRepository.deleteById(adminId);
		return "Admin deleted successfully : " +adminId;
	}

	@Override
	public String getAdminByName(String name) {
		
		return adminRepository.findByName(name);
	}

}
