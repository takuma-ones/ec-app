package com.example.backend.entity;

import com.example.backend.entity.id.ProductCategoryId;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "product_categories")
@Getter
@Setter
public class ProductCategoryEntity {

    @EmbeddedId
    private ProductCategoryId id = new ProductCategoryId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    @JsonBackReference
    private ProductEntity product;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("categoryId")
    @JoinColumn(name = "category_id")
    @JsonBackReference
    private CategoryEntity category;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;
}
