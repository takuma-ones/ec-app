package com.example.backend.dto.common.auth;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
