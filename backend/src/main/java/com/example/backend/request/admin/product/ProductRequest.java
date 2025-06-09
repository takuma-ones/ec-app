package com.example.backend.request.admin.product;

import com.example.backend.entity.CategoryEntity;
import com.example.backend.entity.ProductEntity;
import com.example.backend.entity.ProductCategoryEntity;
import com.example.backend.entity.ProductImageEntity;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public record ProductRequest(
        String sku,
        String name,
        String description,
        Integer price,
        Integer stock,
        boolean isPublished,
        List<Integer> categoryIds,
        List<ProductImageRequest> images
) {

    public ProductEntity toEntity() {
        ProductEntity product = new ProductEntity();
        product.setSku(sku);
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStock(stock);
        product.setPublished(isPublished);

        // カテゴリの関連づけ
        if (categoryIds != null) {
            Set<ProductCategoryEntity> productCategories = categoryIds.stream()
                    .map(categoryId -> {
                        CategoryEntity category = new CategoryEntity();
                        category.setId(categoryId);
                        ProductCategoryEntity productCategory = new ProductCategoryEntity();
                        productCategory.setProduct(product);
                        productCategory.setCategory(category);
                        return productCategory;
                    })
                    .collect(Collectors.toSet());
            product.setProductCategories(productCategories);
        }

        // 画像の関連づけ
        if (images != null) {
            Set<ProductImageEntity> productImages = images.stream()
                    .map(imageReq -> {
                        ProductImageEntity image = new ProductImageEntity();
                        image.setProduct(product);
                        image.setImageUrl(imageReq.url());
                        image.setSortOrder(imageReq.sortOrder());
                        return image;
                    })
                    .collect(Collectors.toSet());
            product.setProductImages(productImages);
        }

        return product;
    }
}
