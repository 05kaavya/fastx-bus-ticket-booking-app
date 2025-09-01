package com.hexaware.fastx.filter;

import com.hexaware.fastx.config.CustomUserDetailsService;
import com.hexaware.fastx.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    @Qualifier("customUserDetailsService")
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            username = jwtService.extractUsername(token);
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);

            if (jwtService.validateToken(token, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}



/*
 * package com.hexaware.fastx.filter;
 * 
 * import java.io.IOException; //import java.util.List;
 * 
 * import org.springframework.beans.factory.annotation.Autowired; import
 * org.springframework.beans.factory.annotation.Qualifier; import
 * org.springframework.security.authentication.
 * UsernamePasswordAuthenticationToken; //import
 * org.springframework.security.core.authority.SimpleGrantedAuthority; import
 * org.springframework.security.core.context.SecurityContextHolder; import
 * org.springframework.security.core.userdetails.UserDetails; //import
 * org.springframework.security.core.userdetails.UserDetailsService; import
 * org.springframework.security.web.authentication.
 * WebAuthenticationDetailsSource; import
 * org.springframework.stereotype.Component; import
 * org.springframework.web.filter.OncePerRequestFilter;
 * 
 * import com.hexaware.fastx.config.AdminDetailsService; import
 * com.hexaware.fastx.config.UserInfoUserDetailsService; import
 * com.hexaware.fastx.service.JwtService;
 * 
 * import jakarta.servlet.FilterChain; import jakarta.servlet.ServletException;
 * import jakarta.servlet.http.HttpServletRequest; import
 * jakarta.servlet.http.HttpServletResponse;
 * 
 * 
 * @Component public class JwtAuthFilter extends OncePerRequestFilter {
 * 
 * @Autowired private JwtService jwtService;
 * 
 * @Autowired
 * 
 * @Qualifier("userInfoUserDetailsService") private UserInfoUserDetailsService
 * userInfoUserDetailsService;
 * 
 * @Autowired
 * 
 * @Qualifier("adminDetailsService") private AdminDetailsService
 * adminDetailsService;
 * 
 * @Override protected void doFilterInternal(HttpServletRequest request,
 * HttpServletResponse response, FilterChain filterChain) throws
 * ServletException, IOException {
 * 
 * String authHeader = request.getHeader("Authorization"); String token = null;
 * String username = null; String role = null;
 * 
 * if (authHeader != null && authHeader.startsWith("Bearer ")) { token =
 * authHeader.substring(7); username = jwtService.extractUsername(token); role =
 * jwtService.extractRole(token); }
 * 
 * if (username != null &&
 * SecurityContextHolder.getContext().getAuthentication() == null) { UserDetails
 * userDetails;
 * 
 * if ("ADMIN".equals(role)) { userDetails =
 * adminDetailsService.loadUserByUsername(username); } else { userDetails =
 * userInfoUserDetailsService.loadUserByUsername(username); }
 * 
 * if (jwtService.validateToken(token, userDetails)) {
 * UsernamePasswordAuthenticationToken authToken = new
 * UsernamePasswordAuthenticationToken( userDetails, null,
 * userDetails.getAuthorities() ); authToken.setDetails(new
 * WebAuthenticationDetailsSource().buildDetails(request));
 * SecurityContextHolder.getContext().setAuthentication(authToken); } }
 * 
 * filterChain.doFilter(request, response); } }
 */

