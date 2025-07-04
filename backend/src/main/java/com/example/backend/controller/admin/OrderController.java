package com.example.backend.controller.admin;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.example.backend.enums.OrderStatus;
import com.example.backend.request.admin.order.OrderRequest;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.example.backend.entity.OrderEntity;
import com.example.backend.response.admin.order.OrderResponse;
import com.example.backend.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController("AdminOrderController")
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    // 一覧取得
    @GetMapping
    public List<OrderResponse> getOrders() {

        List<OrderEntity> orders = orderService.findAll();

        return orders.stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 1件取得
    @GetMapping("/{id}")
    public OrderResponse getOrderById(@PathVariable Integer id) {
        OrderEntity order = orderService.findOrderById(id);
        return OrderResponse.fromEntity(order);
    }

    // ステータスごとの件数取得
    @GetMapping("/count/{status}")
    public int countOrderByStatus(@PathVariable OrderStatus status) {
        return orderService.countByStatus(status);
    }

    // ステータス更新
    @PutMapping("/{id}")
    public OrderResponse update(@PathVariable Integer id, @RequestBody @Validated OrderRequest request) {
        OrderEntity order = orderService.updateOrderStatus(id, request);
        return OrderResponse.fromEntity(order);
    }

}
