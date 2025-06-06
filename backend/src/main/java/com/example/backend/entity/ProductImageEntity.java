package com.example.backend.entity;

import com.example.backend.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "product_images")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class ProductImageEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // productsテーブルの外部キー
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private ProductEntity product;

    @Column(name = "image_url", nullable = false, length = 255)
    private String imageUrl;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;
}
