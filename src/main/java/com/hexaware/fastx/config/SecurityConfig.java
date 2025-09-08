package com.hexaware.fastx.config;

import com.hexaware.fastx.filter.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

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
            .cors(cors -> {}) 
            .authorizeHttpRequests(auth -> auth
            	    // Public endpoints (login & register)
            	    .requestMatchers(HttpMethod.POST,
            	        "/auth/login",
            	        "/auth/admin/login",
            	        "/auth/operator/login",
            	        "/api/users/register",
            	        "/api/admins/register",
            	        "/api/bus-operators/add",
            	        "/api/seats/verify-availability"
            	    ).permitAll()
            	    
            	    // Swagger
            	    .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
            	    
            	    // Other endpoints require authentication
            	    .anyRequest().authenticated()
            	)
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
						
						 
          


/*
 * // USER endpoints .requestMatchers("/api/users/me").hasAuthority("USER")
 * .requestMatchers("/api/buses/getall", "/api/buses/get/**",
 * "/api/buses/name/**").hasAuthority("USER")
 * .requestMatchers("/api/routes/getall",
 * "/api/routes/get/**").hasAuthority("USER")
 * .requestMatchers("/api/bookings/add", "/api/bookings/update",
 * "/api/bookings/delete/**").hasAuthority("USER")
 * .requestMatchers("/api/payments/**",
 * "/api/cancellations/**").hasAuthority("USER")
 * .requestMatchers("/api/seats/bus/**").hasAuthority("USER")
 * 
 * // ADMIN management endpoints
 * .requestMatchers("/api/admins/**").hasAuthority("ADMIN")
 * .requestMatchers("/api/buses/add", "/api/buses/update",
 * "/api/buses/delete/**").hasAuthority("ADMIN")
 * .requestMatchers("/api/routes/add",
 * "/api/routes/delete/**").hasAuthority("ADMIN")
 * .requestMatchers("/api/bus-operators/**").hasAuthority("ADMIN")
 * .requestMatchers("/api/seats/add", "/api/seats/update",
 * "/api/seats/delete/**").hasAuthority("ADMIN")
 * 
 * // ADMIN getall endpoints (view everything) .requestMatchers(
 * "/api/buses/getall", "/api/routes/getall", "/api/seats/getall",
 * "/api/bookings/getall", "/api/users/getall", "/api/payments/getall",
 * "/api/cancellations/getall", "/api/bus-operators/getall",
 * "/api/bookingseat/getall" ).hasAuthority("ADMIN")
 */


/*
 * package com.hexaware.fastx.config;
 * 
 * import org.springframework.beans.factory.annotation.Qualifier; import
 * org.springframework.context.annotation.Bean; import
 * org.springframework.context.annotation.Configuration; import
 * org.springframework.security.authentication.AuthenticationManager; import
 * org.springframework.security.authentication.dao.DaoAuthenticationProvider;
 * import
 * org.springframework.security.config.annotation.authentication.configuration.
 * AuthenticationConfiguration; import
 * org.springframework.security.config.annotation.web.builders.HttpSecurity;
 * import org.springframework.security.config.http.SessionCreationPolicy; import
 * org.springframework.security.core.userdetails.UserDetailsService; import
 * org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; import
 * org.springframework.security.crypto.password.PasswordEncoder; import
 * org.springframework.security.web.SecurityFilterChain; import
 * org.springframework.security.web.authentication.
 * UsernamePasswordAuthenticationFilter;
 * 
 * import com.hexaware.fastx.filter.JwtAuthFilter;
 * 
 * // ... your existing imports
 * 
 * @Configuration public class SecurityConfig {
 * 
 * private final JwtAuthFilter jwtAuthFilter;
 * 
 * public SecurityConfig(JwtAuthFilter jwtAuthFilter) { this.jwtAuthFilter =
 * jwtAuthFilter; }
 * 
 * @Bean public PasswordEncoder passwordEncoder() { return new
 * BCryptPasswordEncoder(); }
 * 
 * // ✅ Separate provider for Users
 * 
 * @Bean public DaoAuthenticationProvider userAuthProvider(
 * 
 * @Qualifier("userInfoUserDetailsService") UserDetailsService
 * userDetailsService) { DaoAuthenticationProvider authProvider = new
 * DaoAuthenticationProvider();
 * authProvider.setUserDetailsService(userDetailsService);
 * authProvider.setPasswordEncoder(passwordEncoder()); return authProvider; }
 * 
 * // ✅ Separate provider for Admins
 * 
 * @Bean public DaoAuthenticationProvider adminAuthProvider(
 * 
 * @Qualifier("adminDetailsService") UserDetailsService adminDetailsService) {
 * DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
 * authProvider.setUserDetailsService(adminDetailsService);
 * authProvider.setPasswordEncoder(passwordEncoder()); return authProvider; }
 * 
 * @Bean public AuthenticationManager
 * authenticationManager(AuthenticationConfiguration config) throws Exception {
 * return config.getAuthenticationManager(); }
 * 
 * @Bean public SecurityFilterChain securityFilterChain(HttpSecurity http)
 * throws Exception { http.csrf(csrf -> csrf.disable())
 * .authorizeHttpRequests(auth -> auth .requestMatchers("/auth/**",
 * "/api/users/register", "/api/admins/register", "/v3/api-docs/**",
 * "/swagger-ui/**", "/swagger-ui.html").permitAll()
 * .requestMatchers("/api/admins/**", "/api/buses/**", "/api/routes/**",
 * "/api/bus-operators/**", "/api/seats/**", "/api/booking-seats/**")
 * .hasAuthority("ADMIN") .requestMatchers("/api/bookings/**",
 * "/api/payments/**", "/api/cancellations/**") .hasAuthority("USER")
 * .anyRequest().authenticated() ) .sessionManagement(sess ->
 * sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
 * 
 * http.addFilterBefore(jwtAuthFilter,
 * UsernamePasswordAuthenticationFilter.class);
 * 
 * return http.build(); } }
 */



