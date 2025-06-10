package com.example.backend.service;

import com.example.backend.entity.*;
import com.example.backend.enums.OrderStatus;
import com.example.backend.repository.CartItemRepository;
import com.example.backend.repository.CartRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.request.user.order.OrderCreateRequest;
import com.example.backend.response.user.order.OrderResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    // 全取得
    public List<OrderEntity> findOrdersByUserId(Integer userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }


    // 決済
    public OrderResponse createOrderFromCart(Integer userId, OrderCreateRequest request) {
        // 1. カート取得
        CartEntity cart = cartRepository.findByUserIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        // 2. カートアイテム取得
        List<CartItemEntity> cartItems = cartItemRepository.findByCartId(cart.getId());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("カートが空です");
        }

        // 3. 合計金額計算
        int totalAmount = cartItems.stream()
                .mapToInt(item -> item.getQuantity() * item.getProduct().getPrice())
                .sum();

        // 4. User取得
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 5. Order作成
        OrderEntity order = new OrderEntity();
        order.setUser(user);
        order.setTotalAmount(totalAmount);
        order.setShippingAddress(request.shippingAddress());
        order.setStatus(OrderStatus.PAID);  // 決済なしなので即PAIDでOK

        // 6. OrderItem作成
        Set<OrderItemEntity> orderItems = new HashSet<>();
        for (CartItemEntity cartItem : cartItems) {
            OrderItemEntity orderItem = new OrderItemEntity();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getPrice());
            orderItems.add(orderItem);
        }
        order.setOrderItems(orderItems);

        // 7. Order保存（cascadeでOrderItemも保存される）
        orderRepository.save(order);

        // 8. カート内アイテム削除（物理削除）
        cartItemRepository.deleteAll(cartItems);

        // 9. OrderResponse作成して返す（実装例）
        return OrderResponse.toResponse(order);
    }


}
