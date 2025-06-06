package com.example.backend.repository;

import com.example.backend.entity.UserEntity;
import com.example.backend.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends BaseRepository<UserEntity, Integer> {

    Optional<UserEntity> findByEmail(String email);
    boolean existsByEmail(String email);

    boolean existsByEmailAndIsDeletedFalse(String email);
}
