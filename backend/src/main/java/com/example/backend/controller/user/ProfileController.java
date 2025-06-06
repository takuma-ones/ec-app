package com.example.backend.controller.user;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("UserProfileController")
@RequestMapping("/api/user/profile")
@RequiredArgsConstructor
public class ProfileController {
}
