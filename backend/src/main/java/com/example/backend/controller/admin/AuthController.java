package com.example.backend.controller.admin;

import com.example.backend.request.admin.auth.SignUpRequest;
import com.example.backend.request.common.auth.LoginRequest;
import com.example.backend.entity.AdminEntity;
import com.example.backend.repository.AdminRepository;
import com.example.backend.security.JwtUtil;
import com.example.backend.security.CustomUserDetails;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController("AdminAuthController")
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody @Validated SignUpRequest request) {
        if (adminRepository.existsByEmail(request.email())) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        AdminEntity admin = new AdminEntity();
        admin.setName(request.name());
        admin.setEmail(request.email());
        admin.setPassword(passwordEncoder.encode(request.password()));

        adminRepository.save(admin);

        // サインアップ後に認証
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        // CustomUserDetailsに合わせて生成
        CustomUserDetails userDetails = new CustomUserDetails(
                admin.getId(),
                admin.getEmail(),
                "", // パスワードはJWTトークン生成には不要
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );

        String token = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "admin_id", admin.getId(),
                "name", admin.getName(),
                "email", admin.getEmail()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Validated LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        AdminEntity admin = adminRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        CustomUserDetails userDetails = new CustomUserDetails(
                admin.getId(),
                admin.getEmail(),
                "", // パスワードはトークン生成に不要
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );

        String token = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "admin_id", admin.getId(),
                "name", admin.getName(),
                "email", admin.getEmail()
        ));
    }
}
