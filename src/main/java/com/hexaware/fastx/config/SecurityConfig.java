package com.hexaware.fastx.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.hexaware.fastx.filter.JwtAuthFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers(
                    "/auth/login",
                    "/api/users/register",
                    "/api/buses/add",
                    "/api/buses/getall",
                    "/api/buses/name/{busName}",
                    "/api/buses/update",
                    "/api/buses/delete/{busId}",
                    "/api/admins/add",
                    "/api/admins/getall",
                    "/api/admins/get/{adminId}",
                    "/api/admins/delete/{adminId}",
                    "/api/admins/name/{name}",
                    "/api/bookings/add",
                    "/api/bookings/getall",
                    "/api/bookings/get/{bookingId}",
                    "/api/bookings/delete/{bookingId}",
                    "/api/cancellations/cancel",
                    "/api/cancellations/booking/{bookingId}",
                    "/api/cancellations/user/{userId}",
                    "/api/cancellations/status/{refundStatus}",
                    "/api/cancellations/isCancelled/{bookingId}",
                    "/api/cancellations/totalRefunds/{cancellationDate}",
                    "/api/bus-operators/add",
                    "/api/bus-operators/get/{operatorId}",
                    "/api/bus-operators/getall",
                    "/api/bus-operators/delete/{operatorId}",
                    "/api/routes/add",
                    "/api/routes/get/{routeId}",
                    "/api/routes/getall",
                    "/api/routes/delete/{routeId}",
                    "/api/seats/add",
                    "/api/seats/update",
                    "/api/seats/bus/{busId}",
                    "/api/seats/delete/{seatId}",
                    "/api/seats/bus/{busId}/status/{seatStatus}",
                    "/api/seats/bus/{busId}/type/{seatType}",
                    "/api/seats/status/{seatStatus}",
                    "/api/seats/type/{seatType}",
                    "/api/payments/process",
                    "/api/payments/booking/{bookingId}",
                    "/api/payments/user/{userId}",
                    "/api/payments/status/{paymentStatus}",
                    "/api/payments/totalRevenue/{paymentDate}",
                    "/api/payments/isSuccessfull/{bookingId}",
                    "/api/booking-seats/assign",
                    "/api/booking-seats/booking/{bookingId}",
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html"
                ).permitAll()

                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // JWT filter before UsernamePasswordAuthenticationFilter
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}


