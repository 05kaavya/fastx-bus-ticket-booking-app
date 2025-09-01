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
        .cors(cors -> {}) // 👈 enable CORS
                .authorizeHttpRequests(auth -> auth
                		// Public endpoints
                        .requestMatchers("/auth/**", "/api/users/register", "/api/admins/register",
                                         "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                        // 👉 USER can view buses & routes
                        .requestMatchers(HttpMethod.GET, "/api/buses/**", "/api/routes/**").hasAuthority("USER")

                        // 👉 ADMIN can manage buses, routes, operators, seats
                        .requestMatchers("/api/buses/**", "/api/routes/**", "/api/bus-operators/**", "/api/seats/**")
                        .hasAuthority("ADMIN")

                        // 👉 USER can create bookings/payments/cancellations
                        .requestMatchers("/api/bookings/**", "/api/payments/**", "/api/cancellations/**").hasAuthority("USER")

                        // 👉 ADMIN can view/manage all bookings
                        .requestMatchers("/api/admins/**", "/api/bookings/**").hasAuthority("ADMIN")
                        
                        // All other requests require authentication
                        .anyRequest().authenticated()
                )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}


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



