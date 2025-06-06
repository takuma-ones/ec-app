package com.example.backend.request.common.auth;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
