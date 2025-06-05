package com.example.backend.dto.auth;

import lombok.Data;

@Data
public class UserSignUpRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String address;
}
