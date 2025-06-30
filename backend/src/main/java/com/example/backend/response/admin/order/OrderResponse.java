package com.example.backend.response.admin.order;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import com.example.backend.entity.OrderEntity;
import com.example.backend.entity.OrderItemEntity;

public record OrderResponse(
        Integer id,
        Integer userId,
        String userName,
        Integer totalAmount,
        String status,
        String shippingAddress,
        String phone,
        LocalDateTime createdAt,
        List<OrderItemResponse> items) {
    public static OrderResponse fromEntity(OrderEntity order) {
        List<OrderItemResponse> items = order.getOrderItems().stream()
                .filter(image -> !image.getIsDeleted())
                .sorted(Comparator.comparing(OrderItemEntity::getId))
                .map(OrderItemResponse::fromEntity)
                .collect(Collectors.toList());

        return new OrderResponse(
                order.getId(),
                order.getUser().getId(),
                order.getUser().getName(),
                order.getTotalAmount(),
                order.getStatus().name(),
                order.getShippingAddress(),
                order.getUser().getPhone(),
                order.getCreatedAt(),
                items);
    }
}
