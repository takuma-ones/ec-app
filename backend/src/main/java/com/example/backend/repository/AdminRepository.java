package com.example.backend.repository;

import com.example.backend.entity.AdminEntity;
import com.example.backend.repository.base.BaseRepository;

import java.util.Optional;

public interface AdminRepository extends BaseRepository<AdminEntity, Integer> {

    Optional<AdminEntity> findByEmail(String email);
    boolean existsByEmail(String email);

    boolean existsByEmailAndIsDeletedFalse(String email);
}
