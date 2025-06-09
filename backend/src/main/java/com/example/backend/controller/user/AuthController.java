package com.example.backend.controller.user;

import com.example.backend.entity.CartEntity;
import com.example.backend.repository.CartRepository;
import com.example.backend.request.common.auth.LoginRequest;
import com.example.backend.request.user.auth.SignUpRequest;
import com.example.backend.entity.UserEntity;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtUtil;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController("UserAuthController")
@RequestMapping("/api/user/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody @Validated SignUpRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        UserEntity user = new UserEntity();
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setName(request.name());
        user.setAddress(request.address());
        user.setPhone(request.phone());

        // ユーザーを保存
        userRepository.save(user);

        // ここでCartを作成して保存
        CartEntity cart = new CartEntity();
        cart.setUser(user);
        cartRepository.save(cart);

        // サインアップ後に認証してJWTトークン生成
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(), "",
                java.util.List.of(() -> "ROLE_USER")
        );

        String token = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "user_id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail()
        ));
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Validated LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        UserEntity user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(), "",
                java.util.List.of(() -> "ROLE_USER")
        );

        String token = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "user_id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail()
        ));
    }
}
