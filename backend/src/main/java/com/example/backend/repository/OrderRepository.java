package com.example.backend.repository;

import com.example.backend.entity.OrderEntity;
import com.example.backend.entity.UserEntity;
import com.example.backend.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends BaseRepository<OrderEntity, Integer> {
    List<OrderEntity> findByUserOrderByCreatedAtDesc(UserEntity user);
}
