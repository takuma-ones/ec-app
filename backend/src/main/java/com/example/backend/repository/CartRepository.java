package com.example.backend.repository;

import com.example.backend.entity.CartEntity;
import com.example.backend.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends BaseRepository<CartEntity, Integer> {
}
