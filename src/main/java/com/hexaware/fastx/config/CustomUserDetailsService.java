package com.hexaware.fastx.config;

import com.hexaware.fastx.entities.Admin;
import com.hexaware.fastx.entities.User;
import com.hexaware.fastx.entities.BusOperator;
import com.hexaware.fastx.repository.AdminRepository;
import com.hexaware.fastx.repository.UserRepository;
import com.hexaware.fastx.repository.BusOperatorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service("customUserDetailsService")
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private BusOperatorRepository busOperatorRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // ✅ First check in Users table
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return org.springframework.security.core.userdetails.User
                    .withUsername(user.getEmail())
                    .password(user.getPassword())
                    .authorities("USER")
                    .build();
        }

        // ✅ Then check in Admins table
        Optional<Admin> adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            return org.springframework.security.core.userdetails.User
                    .withUsername(admin.getEmail())
                    .password(admin.getPassword())
                    .authorities("ADMIN")
                    .build();
        }

        // ✅ Finally check in Bus Operators table
        Optional<BusOperator> operatorOpt = busOperatorRepository.findByEmail(email);
        if (operatorOpt.isPresent()) {
            BusOperator operator = operatorOpt.get();
            return org.springframework.security.core.userdetails.User
                    .withUsername(operator.getEmail())
                    .password(operator.getPassword())
                    .authorities("OPERATOR")
                    .build();
        }

        throw new UsernameNotFoundException("No user, admin, or operator found with email: " + email);
    }
}

