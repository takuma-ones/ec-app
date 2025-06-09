package com.example.backend.request.admin.auth;

public record SignUpRequest(
        String name,
        String email,
        String password
) {
}
