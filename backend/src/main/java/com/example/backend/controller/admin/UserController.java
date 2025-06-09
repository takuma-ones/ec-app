package com.example.backend.controller.admin;

import com.example.backend.entity.ProductEntity;
import com.example.backend.entity.UserEntity;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
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
    public List<UserEntity> list() {
        return userService.findAll();
    }

    // 1件取得
}
