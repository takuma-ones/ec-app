package com.example.backend.response.user.order;

import com.example.backend.entity.OrderEntity;
import com.example.backend.entity.OrderItemEntity;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public record OrderResponse(
        Integer id,
        Integer userId,
        Integer totalAmount,
        String status,
        String shippingAddress,
        LocalDateTime createdAt,
        List<OrderItemResponse> items) {
    public static OrderResponse fromEntity(OrderEntity order) {
        List<OrderItemResponse> items = order.getOrderItems().stream()
                .sorted(Comparator.comparing(OrderItemEntity::getId))
                .map(OrderItemResponse::fromEntity)
                .collect(Collectors.toList());

        return new OrderResponse(
                order.getId(),
                order.getUser().getId(),
                order.getTotalAmount(),
                order.getStatus().name(),
                order.getShippingAddress(),
                order.getCreatedAt(),
                items);
    }
}
