package com.example.backend.repository;

import com.example.backend.entity.ProductCategory;
import com.example.backend.entity.id.ProductCategoryId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, ProductCategoryId> {

}
