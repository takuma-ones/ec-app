package com.example.backend.response.user.order;

import com.example.backend.entity.OrderEntity;
import com.example.backend.entity.OrderItemEntity;

import java.util.List;
import java.util.stream.Collectors;

public record OrderResponse(
        Integer id,
        Integer totalAmount,
        String status,
        String shippingAddress,
        List<OrderItemResponse> items
) {
    public static OrderResponse fromEntity(OrderEntity order) {
        List<OrderItemResponse> items = order.getOrderItems().stream()
                .map(OrderItemResponse::fromEntity)
                .collect(Collectors.toList());

        return new OrderResponse(
                order.getId(),
                order.getTotalAmount(),
                order.getStatus().name(),
                order.getShippingAddress(),
                items
        );
    }
}
