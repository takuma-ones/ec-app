package com.example.backend.controller.user;

import com.example.backend.entity.OrderEntity;
import com.example.backend.request.user.order.OrderCreateRequest;
import com.example.backend.response.user.order.OrderResponse;
import com.example.backend.security.CustomUserDetails;
import com.example.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController("UserOrderController")
@RequestMapping("/api/user/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // 一覧取得
    @GetMapping
    public List<OrderResponse> getMyOrders() {
        CustomUserDetails loginUser = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Integer userId = loginUser.getId();

        List<OrderEntity> orders = orderService.findOrdersByUserId(userId);

        return orders.stream()
                .map(OrderResponse::toResponse)
                .collect(Collectors.toList());
    }

    // 購入
    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(@RequestBody OrderCreateRequest request) {
        CustomUserDetails loginUser = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Integer userId = loginUser.getId();

        OrderResponse response = orderService.createOrderFromCart(userId, request);
        return ResponseEntity.ok(response);
    }
}
