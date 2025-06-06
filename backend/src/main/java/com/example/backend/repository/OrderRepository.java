package com.example.backend.repository;

import com.example.backend.entity.OrderEntity;
import com.example.backend.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends BaseRepository<OrderEntity, Integer> {
}
