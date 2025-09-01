/*
 * package com.hexaware.fastx.config;
 * 
 * import org.springframework.beans.factory.annotation.Autowired; import
 * org.springframework.security.core.userdetails.UserDetails; import
 * org.springframework.security.core.userdetails.UserDetailsService; import
 * org.springframework.security.core.userdetails.UsernameNotFoundException;
 * import org.springframework.stereotype.Service;
 * 
 * import com.hexaware.fastx.entities.Admin; import
 * com.hexaware.fastx.repository.AdminRepository;
 * 
 * @Service public class AdminDetailsService implements UserDetailsService {
 * 
 * @Autowired private AdminRepository adminRepository;
 * 
 * @Override public UserDetails loadUserByUsername(String email) throws
 * UsernameNotFoundException { Admin admin = adminRepository.findByEmail(email)
 * .orElseThrow(() -> new UsernameNotFoundException("Admin not found: " +
 * email));
 * 
 * return org.springframework.security.core.userdetails.User
 * .withUsername(admin.getEmail()) .password(admin.getPassword())
 * .authorities("ADMIN") // 👈 important .build(); } }
 */

