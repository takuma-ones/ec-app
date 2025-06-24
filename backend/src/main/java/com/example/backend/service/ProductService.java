package com.example.backend.service;

import com.example.backend.entity.CategoryEntity;
import com.example.backend.entity.ProductCategoryEntity;
import com.example.backend.entity.ProductEntity;
import com.example.backend.entity.ProductImageEntity;
import com.example.backend.repository.ProductRepository;
import com.example.backend.request.admin.product.ProductImageRequest;
import com.example.backend.request.admin.product.ProductRequest;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileOutputStream;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final EntityManager entityManager;

    private final String uploadDir = "src/main/resources/static/uploads/images/products";

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
    public ProductEntity save(ProductRequest request) {
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
        try {
            File uploadFolder = new File(uploadDir);
            if (!uploadFolder.exists()) {
                uploadFolder.mkdirs();
            }

            Set<ProductImageEntity> productImages = new HashSet<>();
            int index = 0;

            for (ProductImageRequest imageData : request.images()) {
                String base64Data = imageData.base64();
                String[] parts = base64Data.split(",");
                String base64Image = parts.length > 1 ? parts[1] : parts[0];

                byte[] imageBytes = Base64.decodeBase64(base64Image);
                String extension = getExtensionFromBase64(parts[0]);
                String fileName = System.currentTimeMillis() + "_" + (index + 1) + extension;

                File file = new File(uploadFolder, fileName);
                try (FileOutputStream fos = new FileOutputStream(file)) {
                    fos.write(imageBytes);
                }

                String imageUrl = "/uploads/images/products/" + fileName;

                ProductImageEntity pi = new ProductImageEntity();
                pi.setProduct(product);
                pi.setImageUrl(imageUrl);
                pi.setSortOrder(imageData.sortOrder());
                productImages.add(pi);

                index++;
            }

            product.setProductImages(productImages);

            return productRepository.save(product);

        } catch (Exception e) {
            throw new RuntimeException("画像保存中にエラーが発生しました", e);
        }

    }

    // 更新
    public ProductEntity update(Integer id, ProductRequest request) {
        ProductEntity product = productRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        product.setSku(request.sku());
        product.setName(request.name());
        product.setPrice(request.price());
        product.setDescription(request.description());
        product.setStock(request.stock());
        product.setPublished(request.isPublished());

        // --- 1. 古い画像ファイルを削除 ---
        for (ProductImageEntity image : product.getProductImages()) {
            String imageUrl = image.getImageUrl();
            if (imageUrl != null && !imageUrl.isBlank()) {
                String relativePath = imageUrl.startsWith("/") ? imageUrl.substring(1) : imageUrl;
                File file = new File(relativePath);
                if (file.exists()) {
                    file.delete();
                }
            }
        }

        // --- 2. 古い関連データの削除と即時flush ---
        product.getProductCategories().clear();
        product.getProductImages().clear();
        entityManager.flush();

        // --- 3. カテゴリ再設定 ---
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

        // --- 4. 新しい画像を保存 ---
        File uploadFolder = new File(uploadDir);
        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
        }

        Set<ProductImageEntity> productImages = request.images().stream()
                .filter(image -> image.base64() != null && !image.base64().isBlank())
                .map(image -> {
                    ProductImageEntity pi = new ProductImageEntity();
                    pi.setProduct(product);
                    pi.setSortOrder(image.sortOrder());

                    try {
                        String[] parts = image.base64().split(",");
                        String base64Image = parts.length > 1 ? parts[1] : parts[0];
                        byte[] imageBytes = Base64.decodeBase64(base64Image);

                        String extension = getExtensionFromBase64(parts[0]);
                        String fileName = System.currentTimeMillis() + "_" + image.sortOrder() + extension;
                        File file = new File(uploadFolder, fileName);
                        try (FileOutputStream fos = new FileOutputStream(file)) {
                            fos.write(imageBytes);
                        }
                        String imageUrl = "/" + uploadDir + "/" + fileName;
                        pi.setImageUrl(imageUrl);
                    } catch (Exception e) {
                        throw new RuntimeException("画像の保存に失敗しました", e);
                    }

                    return pi;
                })
                .collect(Collectors.toSet());

        product.getProductImages().addAll(productImages);

        return productRepository.save(product);
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

    // Base64から拡張子を取得するヘルパーメソッド
    private String getExtensionFromBase64(String header) {
        if (header == null)
            return ".png"; // デフォルト

        if (header.contains("image/jpeg"))
            return ".jpg";
        else if (header.contains("image/png"))
            return ".png";
        else if (header.contains("image/gif"))
            return ".gif";
        else if (header.contains("image/webp"))
            return ".webp";
        else
            return ".png"; // その他はpngにするなど適宜対応
    }

}
