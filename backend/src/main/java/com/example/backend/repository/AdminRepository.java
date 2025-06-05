package com.example.backend.repository;

import com.example.backend.entity.Admin;
import com.example.backend.repository.base.BaseRepository;

import java.util.Optional;

public interface AdminRepository extends BaseRepository<Admin, Integer> {

    Optional<Admin> findByEmail(String email);
    boolean existsByEmail(String email);

    boolean existsByEmailAndIsDeletedFalse(String email);
}
