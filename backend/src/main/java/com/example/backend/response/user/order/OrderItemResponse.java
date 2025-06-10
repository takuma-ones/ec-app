package com.example.backend.response.user.order;

import com.example.backend.entity.OrderItemEntity;

public record OrderItemResponse(
        Integer id,
        Integer productId,
        String productName,
        Integer quantity,
        Integer price
) {
    public static OrderItemResponse fromEntity(OrderItemEntity entity) {
        return new OrderItemResponse(
                entity.getId(),
                entity.getProduct().getId(),
                entity.getProduct().getName(),
                entity.getQuantity(),
                entity.getPrice()
        );
    }
}