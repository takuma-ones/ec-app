package com.example.backend.repository.base;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;

@NoRepositoryBean
public interface BaseRepository<T, ID extends Serializable> extends JpaRepository<T, ID> {

    void softDeleteById(ID id);

    Optional<T> findByIdAndIsDeletedFalse(ID id);

    List<T> findAllByIsDeletedFalse();

    boolean existsByIdAndIsDeletedFalse(ID id);
}
