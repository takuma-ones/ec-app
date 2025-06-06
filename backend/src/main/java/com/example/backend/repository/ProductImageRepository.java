package com.example.backend.repository;

import com.example.backend.entity.ProductImageEntity;
import com.example.backend.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductImageRepository extends BaseRepository<ProductImageEntity, Integer> {
}
