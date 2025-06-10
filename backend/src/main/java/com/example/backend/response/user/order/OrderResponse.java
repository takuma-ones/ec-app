package com.example.backend.response.user.order;

import com.example.backend.entity.OrderEntity;
import com.example.backend.entity.OrderItemEntity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public record OrderResponse(
        Integer id,
        Integer userId,
        Integer totalAmount,
        String status,
        String shippingAddress,
        LocalDateTime createdAt,
        List<OrderItemResponse> items
) {
    public static OrderResponse toResponse(OrderEntity order) {
        List<OrderItemResponse> items = order.getOrderItems().stream()
                .map(OrderItemResponse::fromEntity)
                .collect(Collectors.toList());

        return new OrderResponse(
                order.getId(),
                order.getUser().getId(),
                order.getTotalAmount(),
                order.getStatus().name(),
                order.getShippingAddress(),
                order.getCreatedAt(),
                items
        );
    }
}
