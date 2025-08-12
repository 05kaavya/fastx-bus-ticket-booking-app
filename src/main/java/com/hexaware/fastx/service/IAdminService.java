package com.hexaware.fastx.service;

import java.util.List;

import com.hexaware.fastx.entities.Admin;

public interface IAdminService {
	
	public Admin addAdmin(Admin admin);
	public Admin getAdminById(int adminId);
    public  List<Admin> getAllAdmins();
    public String deleteAdminById(int adminId); 
    public String getAdminByName(String name);

}
