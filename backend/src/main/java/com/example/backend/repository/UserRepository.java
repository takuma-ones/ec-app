package com.example.backend.repository;

import com.example.backend.entity.User;
import com.example.backend.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends BaseRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    boolean existsByEmailAndIsDeletedFalse(String email);
}
