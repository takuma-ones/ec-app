package com.example.backend.controller.user;

import com.example.backend.entity.OrderEntity;
import com.example.backend.response.user.order.OrderResponse;
import com.example.backend.security.CustomUserDetails;
import com.example.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 1件取得


    // 登録（作成）


    // 更新


    // 削除（論理削除）
}
