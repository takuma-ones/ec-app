// ProductCategory.java
package com.example.backend.entity;

import com.example.backend.entity.base.BaseEntity;
import com.example.backend.entity.id.ProductCategoryId;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "product_categories")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class ProductCategory extends BaseEntity {

    @EmbeddedId
    private ProductCategoryId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("categoryId")
    @JoinColumn(name = "category_id")
    private Category category;
}
