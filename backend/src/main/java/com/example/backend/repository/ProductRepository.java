package com.example.backend.repository;

import com.example.backend.entity.ProductEntity;
import com.example.backend.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends BaseRepository<ProductEntity, Integer> {
}
