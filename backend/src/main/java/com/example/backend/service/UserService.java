package com.example.backend.service;

import com.example.backend.entity.Admin;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // 全取得（isDeleted = false のみ）
    public List<User> findAllByIsDeletedFalse() {
        return userRepository.findAllByIsDeletedFalse();
    }

    // ID取得（isDeleted = false のみ）
    public User findByIdAndIsDeletedFalse(Integer id) {
        return userRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    // メールアドレスで取得
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    // 論理削除
    public void deleteById(Integer id) {
        if (!userRepository.existsByIdAndIsDeletedFalse(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.softDeleteById(id);
    }
}
