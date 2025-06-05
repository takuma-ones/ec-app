package com.example.backend.dto.auth;

import lombok.Data;

@Data
public class AdminSignUpRequest {
    private String name;
    private String email;
    private String password;
}
