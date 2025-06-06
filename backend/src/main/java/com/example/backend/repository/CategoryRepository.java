package com.example.backend.repository;

import com.example.backend.entity.CategoryEntity;
import com.example.backend.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends BaseRepository<CategoryEntity, Integer> {
}
