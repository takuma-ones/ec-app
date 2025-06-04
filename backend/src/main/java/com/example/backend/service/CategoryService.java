package com.example.backend.service;

import com.example.backend.entity.Category;
import com.example.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // 全取得（isDeleted = false のみ）
    public List<Category> findAll() {
        return categoryRepository.findAllByIsDeletedFalse();
    }

    // ID取得（isDeleted = false のみ）
    public Category findById(Integer id) {
        return categoryRepository. findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    // 新規
    public Category save(Category category) {
        return categoryRepository.save(category);
    }

    // 更新
    public Category update(Integer id, Category category) {
        if (!categoryRepository.existsByIdAndIsDeletedFalse(id)) {
            throw new RuntimeException("Category not found with id: " + id);
        }
        category.setId(id);  // id をセットして更新対象を明示
        return categoryRepository.save(category);
    }

    // 論理削除
    public void deleteById(Integer id) {
        if (!categoryRepository.existsByIdAndIsDeletedFalse(id)) {
            throw new RuntimeException("Category not found with id: " + id);
        }
        categoryRepository.softDeleteById(id);
    }
}
