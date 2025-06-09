package com.example.backend.request.common.auth;

import lombok.Data;

public record LoginRequest(
        String email,
        String password
) {
}
