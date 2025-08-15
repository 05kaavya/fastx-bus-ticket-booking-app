
package com.hexaware.fastx.filter;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.hexaware.fastx.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getServletPath();

        if (path.equals("/auth/login") 
            || path.equals("/api/user/register")
            || path.startsWith("/api/admins/")
            || path.startsWith("/api/bookings/")
            || path.startsWith("/api/booking-seats/")
            || path.startsWith("/api/buses/")
            || path.startsWith("/api/bus-operators/")
            || path.startsWith("/api/payments/")
            || path.startsWith("/api/cancellations")
            || path.startsWith("/api/seats/")
            || path.startsWith("/api/routes")
            || path.startsWith("/swagger-ui/")
            || path.startsWith("/v3/api-docs")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            username = jwtService.extractUsername(token);
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (userDetails != null && token != null && jwtService.validateToken(token, userDetails)) {
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
 * 
 * import java.io.IOException;
 * 
 * import org.springframework.beans.factory.annotation.Autowired; import
 * org.springframework.security.authentication.
 * UsernamePasswordAuthenticationToken; import
 * org.springframework.security.core.context.SecurityContextHolder; import
 * org.springframework.security.core.userdetails.UserDetails; import
 * org.springframework.security.web.authentication.
 * WebAuthenticationDetailsSource; import
 * org.springframework.stereotype.Component; import
 * org.springframework.web.filter.OncePerRequestFilter;
 * 
 * import com.hexaware.fastx.config.UserInfoUserDetailsService; import
 * com.hexaware.fastx.service.JwtService;
 * 
 * import jakarta.servlet.FilterChain; import jakarta.servlet.ServletException;
 * import jakarta.servlet.http.HttpServletRequest; import
 * jakarta.servlet.http.HttpServletResponse;
 * 
 * @Component public class JwtAuthFilter extends OncePerRequestFilter {
 * 
 * @Autowired private JwtService jwtService;
 * 
 * @Autowired private UserInfoUserDetailsService userDetailsService;
 * 
 * @Override protected void doFilterInternal(HttpServletRequest request,
 * HttpServletResponse response, FilterChain filterChain) throws
 * ServletException, IOException {
 * 
 * String authHeader = request.getHeader("Authorization"); String token = null;
 * String username = null;
 * 
 * if (authHeader != null && authHeader.startsWith("Bearer ")) { token =
 * authHeader.substring(7); username = jwtService.extractUsername(token); }
 * 
 * if (username != null &&
 * SecurityContextHolder.getContext().getAuthentication() == null) { UserDetails
 * userDetails = userDetailsService.loadUserByUsername(username); if
 * (jwtService.validateToken(token, userDetails)) {
 * UsernamePasswordAuthenticationToken authToken = new
 * UsernamePasswordAuthenticationToken( userDetails, null,
 * userDetails.getAuthorities());
 * 
 * authToken.setDetails(new
 * WebAuthenticationDetailsSource().buildDetails(request));
 * SecurityContextHolder.getContext().setAuthentication(authToken); } }
 * 
 * filterChain.doFilter(request, response); } }
 */
