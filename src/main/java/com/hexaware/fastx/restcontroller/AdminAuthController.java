/*
 * package com.hexaware.fastx.restcontroller;
 * 
 * import org.springframework.beans.factory.annotation.Autowired; import
 * org.springframework.security.authentication.AuthenticationManager; import
 * org.springframework.security.authentication.
 * UsernamePasswordAuthenticationToken; import
 * org.springframework.security.core.Authentication; import
 * org.springframework.security.core.userdetails.UserDetails; import
 * org.springframework.web.bind.annotation.PostMapping; import
 * org.springframework.web.bind.annotation.RequestBody; import
 * org.springframework.web.bind.annotation.RequestMapping; import
 * org.springframework.web.bind.annotation.RestController;
 * 
 * import com.hexaware.fastx.dto.AuthRequest; import
 * com.hexaware.fastx.dto.AuthResponse; import
 * com.hexaware.fastx.service.JwtService;
 * 
 * @RestController
 * 
 * @RequestMapping("/auth/admin") public class AdminAuthController {
 * 
 * @Autowired private AuthenticationManager authenticationManager;
 * 
 * @Autowired private JwtService jwtService;
 * 
 * @PostMapping("/login") public AuthResponse loginAdmin(@RequestBody
 * AuthRequest request) { Authentication auth =
 * authenticationManager.authenticate( new
 * UsernamePasswordAuthenticationToken(request.getEmail(),
 * request.getPassword()) );
 * 
 * if (auth.isAuthenticated()) { UserDetails adminDetails = (UserDetails)
 * auth.getPrincipal(); String token = jwtService.generateToken(adminDetails);
 * // role=ADMIN return new AuthResponse(token); } else { throw new
 * RuntimeException("Invalid admin credentials"); } } }
 */
