package com.example.backend.controller.admin;

import com.example.backend.entity.CategoryEntity;
import com.example.backend.request.admin.category.CategoryRequest;
import com.example.backend.response.admin.category.CategoryResponse;
import com.example.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("AdminCategoryController")
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // 一覧取得
    @GetMapping
    public List<CategoryResponse> list() {
        return categoryService.findAll()
                .stream()
                .map(CategoryResponse::toResponse)
                .toList();
    }

    // 1件取得
    @GetMapping("/{id}")
    public CategoryResponse get(@PathVariable Integer id) {
        CategoryEntity category = categoryService.findById(id);
        return CategoryResponse.toResponse(category);
    }

    // 登録（作成）
    @PostMapping
    public CategoryResponse create(@RequestBody @Validated CategoryRequest request) {
        CategoryEntity created = categoryService.save(request.toEntity());
        return CategoryResponse.toResponse(created);
    }

    // 更新
    @PutMapping("/{id}")
    public CategoryResponse update(@PathVariable Integer id, @RequestBody @Validated CategoryRequest request) {
        CategoryEntity updated = categoryService.update(id, request.toEntity());
        return CategoryResponse.toResponse(updated);
    }

    // 削除（論理削除）
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        categoryService.delete(id);
    }
}
