package com.example.backend.service;

import com.example.backend.entity.CartEntity;
import com.example.backend.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;

    // ID取得（isDeleted = false のみ）
    public CartEntity findByUserId(Integer userId) {
        return cartRepository.findByUserIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found with userId: " + userId));
    }

    // 物理削除(cart_item)


}
