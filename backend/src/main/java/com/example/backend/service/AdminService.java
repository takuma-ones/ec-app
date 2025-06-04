package com.example.backend.service;

import com.example.backend.entity.Admin;
import com.example.backend.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;

    // 全取得（isDeleted = false のみ）
    public List<Admin> findAll() {
        return adminRepository.findAllByIsDeletedFalse();
    }

    // ID取得（isDeleted = false のみ）
    public Admin findById(Integer id) {
        return adminRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));
    }

    // 新規作成
    public Admin save(Admin admin) {
        return adminRepository.save(admin);
    }

    // 更新
    public Admin update(Integer id, Admin admin) {
        if (!adminRepository.existsByIdAndIsDeletedFalse(id)) {
            throw new RuntimeException("Admin not found with id: " + id);
        }
        admin.setId(id); // IDセットして上書き
        return adminRepository.save(admin);
    }

    // 論理削除
    public void deleteById(Integer id) {
        if (!adminRepository.existsByIdAndIsDeletedFalse(id)) {
            throw new RuntimeException("Admin not found with id: " + id);
        }
        adminRepository.softDeleteById(id);
    }
}
