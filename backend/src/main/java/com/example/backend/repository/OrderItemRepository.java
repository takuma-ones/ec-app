package com.example.backend.repository;

import com.example.backend.entity.OrderItemEntity;
import com.example.backend.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends BaseRepository<OrderItemEntity, Integer> {
}
