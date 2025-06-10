// CustomUserDetailsService.java
package com.example.backend.security;

import com.example.backend.repository.AdminRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;

    public CustomUserDetailsService(UserRepository userRepository, AdminRepository adminRepository) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // AdminかUserのどちらかに存在するかを確認
        return adminRepository.findByEmail(username)
                .map(admin -> new org.springframework.security.core.userdetails.User(
                        admin.getEmail(), admin.getPassword(),
                        List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))))
                .orElseGet(() ->
                        userRepository.findByEmail(username)
                                .map(user -> new org.springframework.security.core.userdetails.User(
                                        user.getEmail(), user.getPassword(),
                                        List.of(new SimpleGrantedAuthority("ROLE_USER"))))
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"))
                );
    }
}
