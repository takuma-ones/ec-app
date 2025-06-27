package com.example.backend.repository;

import com.example.backend.entity.ProductEntity;
import com.example.backend.repository.base.BaseRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends BaseRepository<ProductEntity, Integer> {
    List<ProductEntity> findAllByIsDeletedFalse(Sort sort);

    Optional<ProductEntity> findByIdAndIsDeletedFalse(Integer id);

    List<ProductEntity> findAllByIsDeletedFalseAndIsPublishedTrue(Sort sort);

    Optional<ProductEntity> findByIdAndIsDeletedFalseAndIsPublishedTrue(Integer id);

}
