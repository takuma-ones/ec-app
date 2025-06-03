package com.example.backend.entity.id;

import jakarta.persistence.Embeddable;
import lombok.Data;
import java.io.Serializable;

@Embeddable
@Data
public class ProductCategoryId implements Serializable {
    private Integer productId;
    private Integer categoryId;
}
