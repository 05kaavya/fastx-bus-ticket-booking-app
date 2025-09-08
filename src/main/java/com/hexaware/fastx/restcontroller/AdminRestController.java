package com.hexaware.fastx.restcontroller;

import com.hexaware.fastx.dto.AdminDto;
import com.hexaware.fastx.entities.Admin;
import com.hexaware.fastx.service.IAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
public class AdminRestController {

    @Autowired
    private IAdminService service;

    @PreAuthorize("permitAll()")
    @PostMapping("/register")
    public Admin addAdmin(@RequestBody AdminDto dto) {
        return service.addAdmin(dto.toEntity());
    }

    @GetMapping("/get/{adminId}")
    public Admin getAdminById(@PathVariable int adminId) {
        return service.getAdminById(adminId);
    }

    @GetMapping("/getall")
    public List<Admin> getAllAdmins() {
        return service.getAllAdmins();
    }

    @DeleteMapping("/delete/{adminId}")
    public String deleteAdmin(@PathVariable int adminId) {
        return service.deleteAdminById(adminId);
    }

    @GetMapping("/name/{name}")
    public Admin getAdminByName(@PathVariable String name) {
        return service.getAdminByName(name);
    }
}
