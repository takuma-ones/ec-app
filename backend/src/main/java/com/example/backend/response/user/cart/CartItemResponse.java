package com.example.backend.response.user.cart;

import com.example.backend.entity.CartItemEntity;

public record CartItemResponse(
        Integer id,
        Integer productId,
        Integer quantity
) {
    public static CartItemResponse toResponse(CartItemEntity entity) {
        return new CartItemResponse(
                entity.getId(),
                entity.getProduct().getId(),
                entity.getQuantity()
        );
    }
}

