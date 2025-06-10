package com.example.backend.controller.admin;

import com.example.backend.entity.ProductEntity;
import com.example.backend.entity.UserEntity;
import com.example.backend.response.admin.user.UserResponse;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController("AdminUserController")
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 一覧取得
    @GetMapping
    public List<UserResponse> list() {
        return userService.findAll().stream()
                .map(UserResponse::fromEntity)
                .toList();
    }

    // 1件取得
     @GetMapping("/{id}")
     public UserResponse get(@PathVariable Integer id) {
            UserEntity user = userService.findById(id);
            return UserResponse.fromEntity(user);
     }

}
