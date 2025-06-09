package com.example.backend.service;

import com.example.backend.entity.CategoryEntity;
import com.example.backend.entity.ProductCategoryEntity;
import com.example.backend.entity.ProductEntity;
import com.example.backend.entity.ProductImageEntity;
import com.example.backend.repository.ProductRepository;
import com.example.backend.request.admin.product.ProductRequest;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final EntityManager entityManager;

    // 全取得（isDeleted = false のみ）
    public List<ProductEntity> findAll() {
        return productRepository.findAllByIsDeletedFalse(Sort.by("id"));
    }

    // ID取得（isDeleted = false のみ）
    public ProductEntity findById(Integer id) {
        return productRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    // 新規
    public void save(ProductRequest request) {
        ProductEntity product = new ProductEntity();
        product.setSku(request.sku());
        product.setName(request.name());
        product.setPrice(request.price());
        product.setDescription(request.description());
        product.setStock(request.stock());
        product.setPublished(request.isPublished());

        // カテゴリとの中間テーブルの設定
        Set<ProductCategoryEntity> productCategories = request.categoryIds().stream()
                .map(categoryId -> {
                    CategoryEntity category = entityManager.getReference(CategoryEntity.class, categoryId);
                    ProductCategoryEntity pc = new ProductCategoryEntity();
                    pc.setProduct(product);
                    pc.setCategory(category);
                    return pc;
                })
                .collect(Collectors.toSet());
        product.setProductCategories(productCategories);

        // 画像の設定
        Set<ProductImageEntity> productImages = request.images().stream()
                .map(image -> {
                    ProductImageEntity pi = new ProductImageEntity();
                    pi.setProduct(product);
                    pi.setImageUrl(image.url());
                    pi.setSortOrder(image.sortOrder());
                    return pi;
                })
                .collect(Collectors.toSet());
        product.setProductImages(productImages);

        productRepository.save(product);
    }

    // 更新
    public void update(Integer id, ProductRequest request) {
        ProductEntity product = productRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        product.setSku(request.sku());
        product.setName(request.name());
        product.setPrice(request.price());
        product.setDescription(request.description());
        product.setStock(request.stock());
        product.setPublished(request.isPublished());

        // --- 1. 古い関連データの削除と即時flush ---
        product.getProductCategories().clear();
        product.getProductImages().clear();
        entityManager.flush();

        // --- 2. 再設定 ---
        Set<ProductCategoryEntity> productCategories = request.categoryIds().stream()
                .map(categoryId -> {
                    CategoryEntity category = entityManager.getReference(CategoryEntity.class, categoryId);
                    ProductCategoryEntity pc = new ProductCategoryEntity();
                    pc.setProduct(product);
                    pc.setCategory(category);
                    return pc;
                })
                .collect(Collectors.toSet());
        product.getProductCategories().addAll(productCategories);

        Set<ProductImageEntity> productImages = request.images().stream()
                .filter(image -> image.url() != null && !image.url().isBlank())
                .map(image -> {
                    ProductImageEntity pi = new ProductImageEntity();
                    pi.setProduct(product);
                    pi.setImageUrl(image.url());
                    pi.setSortOrder(image.sortOrder());
                    return pi;
                })
                .collect(Collectors.toSet());
        product.getProductImages().addAll(productImages);

        productRepository.save(product);
    }


    // 論理削除
    public void delete(Integer id) {
        ProductEntity product = productRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // Product自体の論理削除
        product.setIsDeleted(true);

        // ProductCategoryも論理削除（関連エンティティのdeletedフィールドがある前提）
        product.getProductCategories().forEach(pc -> pc.setDeleted(true));

        // 必要ならProductImageも論理削除（isDeletedフィールドがある場合）
        product.getProductImages().forEach(pi -> pi.setIsDeleted(true));

        // 変更内容をDBに保存（トランザクション内なので必須ではないが明示的に）
        productRepository.save(product);
    }

}
