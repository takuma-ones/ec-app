package com.example.backend.response.user.cart;

import com.example.backend.entity.CartItemEntity;
import com.example.backend.response.admin.product.ProductResponse;

public record CartItemResponse(
        Integer id,
        Integer quantity,
        ProductResponse product

) {
    public static CartItemResponse fromEntity(CartItemEntity entity) {
        return new CartItemResponse(
                entity.getId(),
                entity.getQuantity(),
                ProductResponse.fromEntity(entity.getProduct())
        );
    }
}

