package com.example.backend.repository;

import com.example.backend.entity.CartItemEntity;
import com.example.backend.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends BaseRepository<CartItemEntity, Integer> {
}
