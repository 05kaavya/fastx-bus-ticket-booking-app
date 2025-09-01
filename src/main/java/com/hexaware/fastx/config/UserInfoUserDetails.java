/*
 * package com.hexaware.fastx.config;
 * 
 * import java.util.List;
 * 
 * import org.springframework.security.core.GrantedAuthority; import
 * org.springframework.security.core.authority.SimpleGrantedAuthority; import
 * org.springframework.security.core.userdetails.UserDetails;
 * 
 * import com.hexaware.fastx.entities.User;
 * 
 * public class UserInfoUserDetails implements UserDetails {
 * 
 * private String username; private String password; private
 * List<GrantedAuthority> authorities;
 * 
 * public UserInfoUserDetails(User user) { this.username = user.getEmail(); //
 * using email for login this.password = user.getPassword(); this.authorities =
 * List.of(new SimpleGrantedAuthority("ROLE_USER")); }
 * 
 * @Override public List<GrantedAuthority> getAuthorities() { return
 * authorities; }
 * 
 * @Override public String getPassword() { return password; }
 * 
 * @Override public String getUsername() { return username; }
 * 
 * @Override public boolean isAccountNonExpired() { return true; }
 * 
 * @Override public boolean isAccountNonLocked() { return true; }
 * 
 * @Override public boolean isCredentialsNonExpired() { return true; }
 * 
 * @Override public boolean isEnabled() { return true; } }
 */

