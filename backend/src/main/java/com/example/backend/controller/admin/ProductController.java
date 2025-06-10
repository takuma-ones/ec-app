package com.example.backend.controller.admin;

import com.example.backend.entity.ProductEntity;
import com.example.backend.request.admin.product.ProductRequest;
import com.example.backend.response.admin.product.ProductDetailResponse;
import com.example.backend.response.admin.product.ProductResponse;
import com.example.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("AdminProductController")
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // 一覧取得
    @GetMapping
    public List<ProductResponse> list() {
        return productService.findAll()
                .stream()
                .map(ProductResponse::fromEntity)
                .toList();
    }

    // 1件取得
    @GetMapping("/{id}")
    public ProductDetailResponse get(@PathVariable Integer id) {
        return ProductDetailResponse.fromEntity(productService.findById(id));
    }

    // 登録（作成）
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void create(@RequestBody @Validated ProductRequest request) {
        productService.save(request);
    }


    // 更新
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@PathVariable Integer id, @RequestBody @Validated ProductRequest request) {
        productService.update(id, request);
    }


    // 削除（論理削除）
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        productService.delete(id);
    }

}