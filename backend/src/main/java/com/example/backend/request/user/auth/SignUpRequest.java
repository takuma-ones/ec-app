package com.example.backend.request.user.auth;

public record SignUpRequest(
        String name,
        String email,
        String password,
        String phone,
        String address
) {
}
