package com.example.backend.controller.admin;

import com.example.backend.entity.Category;
import com.example.backend.entity.Product;
import com.example.backend.service.CategoryService;
import com.example.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController("AdminCategoryController")
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public List<Category> list() {
        return categoryService.findAll();
    }
}
