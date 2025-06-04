package com.example.backend.service;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // 全取得（isDeleted = false のみ）
    public List<User> findAll() {
        return userRepository.findAllByIsDeletedFalse();
    }

    // ID取得（isDeleted = false のみ）
    public User findById(Integer id) {
        return userRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    // 新規
    public User save(User user) {
        return userRepository.save(user);
    }

    // 更新
    public User update(Integer id, User user) {
        if (!userRepository.existsByIdAndIsDeletedFalse(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        user.setId(id);  // id をセットして更新対象を明示
        return userRepository.save(user);
    }

    // 論理削除
    public void deleteById(Integer id) {
        if (!userRepository.existsByIdAndIsDeletedFalse(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.softDeleteById(id);
    }
}
