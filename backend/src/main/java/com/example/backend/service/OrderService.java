package com.example.backend.service;

import com.example.backend.entity.Order;
import com.example.backend.repository.CartRepository;
import com.example.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    // 全取得（isDeleted = false のみ）
    public List<Order> findAll() {
        return orderRepository.findAllByIsDeletedFalse();
    }

    // ID取得（isDeleted = false のみ）
    public Order findById(Integer id) {
        return orderRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    // 新規
    public Order save(Order order) {
        return orderRepository.save(order);
    }

    // 更新
    public Order update(Integer id, Order order) {
        if (!orderRepository.existsByIdAndIsDeletedFalse(id)) {
            throw new RuntimeException("Order not found with id: " + id);
        }
        order.setId(id);  // id をセットして更新対象を明示
        return orderRepository.save(order);
    }

    // 論理削除
    public void deleteById(Integer id) {
        if (!orderRepository.existsByIdAndIsDeletedFalse(id)) {
            throw new RuntimeException("Order not found with id: " + id);
        }
        orderRepository.softDeleteById(id);
    }
}
