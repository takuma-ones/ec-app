package com.example.backend.repository;

import com.example.backend.entity.ProductCategory;
import com.example.backend.entity.id.ProductCategoryId;
import com.example.backend.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductCategoryRepository extends BaseRepository<ProductCategory, ProductCategoryId> {

}
