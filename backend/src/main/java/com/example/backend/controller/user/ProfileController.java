package com.example.backend.controller.user;

import com.example.backend.entity.UserEntity;
import com.example.backend.response.admin.user.UserResponse;
import com.example.backend.security.CustomUserDetails;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("UserProfileController")
@RequestMapping("/api/user/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserService userService;

    // User情報取得
    @GetMapping()
    public UserResponse getUser() {
        CustomUserDetails loginUser = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Integer userId = loginUser.getId();
        UserEntity user = userService.findById(userId);
        return UserResponse.fromEntity(user);
    }

    // 更新


}
