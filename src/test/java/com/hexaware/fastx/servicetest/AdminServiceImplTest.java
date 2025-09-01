package com.hexaware.fastx.servicetest;

import com.hexaware.fastx.dto.AdminDto;
import com.hexaware.fastx.entities.Admin;
import com.hexaware.fastx.service.AdminServiceImpl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(OrderAnnotation.class)
class AdminServiceImplTest {

    @Autowired
    private AdminServiceImpl adminService;

    private AdminDto createUniqueAdminDto() {
        AdminDto dto = new AdminDto();
        dto.setEmail("admin" + System.currentTimeMillis() + "@test.com");
        dto.setPassword("Admin@123");
        dto.setName("Test Admin " + System.currentTimeMillis());
        return dto;
    }

    @Test
    @Order(1)
    void testAddAdmin() {
        AdminDto dto = createUniqueAdminDto();
        Admin savedAdmin = adminService.addAdmin(dto.toEntity());
        assertNotNull(savedAdmin);
        assertEquals(dto.getName(), savedAdmin.getName());
    }

    @Test
    @Order(2)
    void testGetAdminById() {
        AdminDto dto = createUniqueAdminDto();
        Admin saved = adminService.addAdmin(dto.toEntity());

        Admin fetched = adminService.getAdminById(saved.getAdminId());
        assertNotNull(fetched);
        assertEquals(saved.getEmail(), fetched.getEmail());
    }

    @Test
    @Order(3)
    void testGetAllAdmins() {
        List<Admin> admins = adminService.getAllAdmins();
        assertNotNull(admins);
        assertTrue(admins.size() > 0);
    }

    @Test
    @Order(4)
    void testGetAdminByName() {
        AdminDto dto = createUniqueAdminDto();
        Admin saved = adminService.addAdmin(dto.toEntity());

        Admin found = adminService.getAdminByName(saved.getName());
        assertNotNull(found);
        assertEquals(saved.getEmail(), found.getEmail());
    }

    @Test
    @Order(5)
    void testDeleteAdmin() {
        AdminDto dto = createUniqueAdminDto();
        Admin saved = adminService.addAdmin(dto.toEntity());

        String result = adminService.deleteAdminById(saved.getAdminId());
        assertTrue(result.toLowerCase().contains("deleted"));
    }
}
