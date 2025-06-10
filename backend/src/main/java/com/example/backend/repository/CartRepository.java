package com.example.backend.repository;

import com.example.backend.entity.CartEntity;
import com.example.backend.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends BaseRepository<CartEntity, Integer> {
    Optional<CartEntity> findByUserIdAndIsDeletedFalse(Integer userId);

    Optional<CartEntity> findByUserId(Integer userId);

}
