package com.example.backend.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.example.backend.request.user.order.OrderCreateRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.entity.CartEntity;
import com.example.backend.entity.CartItemEntity;
import com.example.backend.entity.CategoryEntity;
import com.example.backend.entity.OrderEntity;
import com.example.backend.entity.OrderItemEntity;
import com.example.backend.entity.UserEntity;
import com.example.backend.enums.OrderStatus;
import com.example.backend.repository.CartItemRepository;
import com.example.backend.repository.CartRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.request.admin.order.OrderRequest;
import com.example.backend.response.user.order.OrderResponse;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    // 全件取得
    public List<OrderEntity> findAll() {
        return orderRepository.findAll(Sort.by("createdAt").descending());
    }

    // ユーザーごと注文一覧
    public List<OrderEntity> findOrdersByUserId(Integer userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    // 注文詳細（User用）
    public OrderEntity findOrderByIdAndUserId(Integer orderId, Integer userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        return orderRepository.findByIdAndUser(orderId, user)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Order not found with id: " + orderId + " for user: " + userId));
    }

    // 注文詳細（Admin用）
    public OrderEntity findOrderById(Integer orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + orderId));
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
        order.setStatus(OrderStatus.PAID); // 決済なしなので即PAIDでOK

        // 6. OrderItem作成 + 在庫チェック
        Set<OrderItemEntity> orderItems = new HashSet<>();
        for (CartItemEntity cartItem : cartItems) {
            int requestedQuantity = cartItem.getQuantity();
            int availableStock = cartItem.getProduct().getStock();

            // 在庫不足チェック
            if (requestedQuantity > availableStock) {
                throw new RuntimeException("在庫が不足しています。商品: " + cartItem.getProduct().getName()
                        + "（在庫: " + availableStock + ", リクエスト: " + requestedQuantity + "）");
            }

            // OrderItem作成
            OrderItemEntity orderItem = new OrderItemEntity();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(requestedQuantity);
            orderItem.setPrice(cartItem.getProduct().getPrice());
            orderItems.add(orderItem);
        }
        order.setOrderItems(orderItems);

        // 7. Order保存（cascadeでOrderItemも保存される）
        orderRepository.save(order);

        // 8. カート内アイテム削除（物理削除）
        cartItemRepository.deleteAll(cartItems);

        // 9. OrderResponse作成して返す
        return OrderResponse.fromEntity(order);
    }

    // 注文ステータス変更
    public OrderEntity updateOrderStatus(Integer id, OrderRequest request) {
        OrderEntity order = orderRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        order.setStatus(OrderStatus.valueOf(request.status()));

        return orderRepository.save(order);
    }

    // 各ステータスの件数を取得
    public int countByStatus(OrderStatus status) {
        return orderRepository.countByStatus(status);
    }

}
