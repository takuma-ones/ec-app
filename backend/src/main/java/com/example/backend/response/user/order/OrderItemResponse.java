package com.example.backend.response.user.order;

import com.example.backend.entity.OrderItemEntity;
import com.example.backend.response.admin.product.ProductResponse;

public record OrderItemResponse(
        Integer id,
        Integer quantity,
        Integer price,
        ProductResponse product
) {
    public static OrderItemResponse fromEntity(OrderItemEntity entity) {
        return new OrderItemResponse(
                entity.getId(),
                entity.getQuantity(),
                entity.getPrice(),
                ProductResponse.fromEntity(entity.getProduct())
        );
    }
}