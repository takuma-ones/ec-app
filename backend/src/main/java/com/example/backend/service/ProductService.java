package com.example.backend.service;

import com.example.backend.entity.ProductEntity;
import com.example.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    // 全取得（isDeleted = false のみ）
    public List<ProductEntity> findAll() {
        return productRepository.findAllByIsDeletedFalse();
    }

    // ID取得（isDeleted = false のみ）
    public ProductEntity findById(Integer id) {
        return productRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    // 新規
    public ProductEntity save(ProductEntity product) {
        return productRepository.save(product);
    }

    // 更新
    public ProductEntity update(Integer id, ProductEntity product) {
        if (!productRepository.existsByIdAndIsDeletedFalse(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        product.setId(id);  // id をセットして更新対象を明示
        return productRepository.save(product);
    }

    // 論理削除
    public void deleteById(Integer id) {
        if (!productRepository.existsByIdAndIsDeletedFalse(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.softDeleteById(id);
    }
}
