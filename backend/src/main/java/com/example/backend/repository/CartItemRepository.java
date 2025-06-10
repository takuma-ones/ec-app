package com.example.backend.repository;

import com.example.backend.entity.CartItemEntity;
import com.example.backend.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends BaseRepository<CartItemEntity, Integer> {
    Optional<CartItemEntity> findByCartIdAndProductId(Integer cartId, Integer productId);

    List<CartItemEntity> findByCartId(Integer id);

}
