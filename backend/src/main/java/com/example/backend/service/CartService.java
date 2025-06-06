package com.example.backend.service;

import com.example.backend.entity.CartEntity;
import com.example.backend.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;

    // 全取得（isDeleted = false のみ）
    public List<CartEntity> findAll() {
        return cartRepository.findAllByIsDeletedFalse();
    }

    // ID取得（isDeleted = false のみ）
    public CartEntity findById(Integer id) {
        return cartRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + id));
    }

    // 新規
    public CartEntity save(CartEntity cart) {
        return cartRepository.save(cart);
    }

    // 更新
    public CartEntity update(Integer id, CartEntity cart) {
        if (!cartRepository.existsByIdAndIsDeletedFalse(id)) {
            throw new RuntimeException("Cart not found with id: " + id);
        }
        cart.setId(id);  // id をセットして更新対象を明示
        return cartRepository.save(cart);
    }

    // 論理削除
    public void deleteById(Integer id) {
        if (!cartRepository.existsByIdAndIsDeletedFalse(id)) {
            throw new RuntimeException("Cart not found with id: " + id);
        }
        cartRepository.softDeleteById(id);
    }

}
