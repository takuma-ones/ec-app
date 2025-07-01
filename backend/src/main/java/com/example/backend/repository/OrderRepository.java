package com.example.backend.repository;

import com.example.backend.entity.OrderEntity;
import com.example.backend.entity.UserEntity;
import com.example.backend.enums.OrderStatus;
import com.example.backend.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends BaseRepository<OrderEntity, Integer> {
    List<OrderEntity> findByUserOrderByCreatedAtDesc(UserEntity user);

    Optional<OrderEntity> findByIdAndUser(Integer orderId, UserEntity user);

    int countByStatus(OrderStatus status);
}
