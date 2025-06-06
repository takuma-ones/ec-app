package com.example.backend.service;

import com.example.backend.entity.AdminEntity;
import com.example.backend.entity.UserEntity;
import com.example.backend.repository.AdminRepository;
import com.example.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;

    // 全取得（isDeleted = false のみ）
    public List<AdminEntity> findAll() {
        return adminRepository.findAllByIsDeletedFalse(Sort.by("id"));
    }

    // ID取得（isDeleted = false のみ）
    public AdminEntity findById(Integer id) {
        return adminRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));
    }

    // メールアドレスで取得
    public AdminEntity findByEmail(String email) {
        return adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    // 論理削除
    public void deleteById(Integer id) {
        if (!adminRepository.existsByIdAndIsDeletedFalse(id)) {
            throw new RuntimeException("Admin not found with id: " + id);
        }
        adminRepository.softDeleteById(id);
    }
}
