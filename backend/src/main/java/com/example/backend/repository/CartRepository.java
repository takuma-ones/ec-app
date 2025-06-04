package com.example.backend.repository;

import com.example.backend.entity.Cart;
import com.example.backend.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends BaseRepository<Cart, Integer> {
}
