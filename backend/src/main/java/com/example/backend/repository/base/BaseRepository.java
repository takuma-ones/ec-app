package com.example.backend.repository.base;

import org.springframework.data.jpa.repository.JpaRepository;
import java.io.Serializable;
import java.util.Optional;

public interface BaseRepository<T, ID extends Serializable> extends JpaRepository<T, ID> {

    // 論理削除（isDeleted を true に更新）
    void softDeleteById(ID id);

    // 論理削除されていないもののみ取得
    Optional<T> findByIdAndIsDeletedFalse(ID id);

    // 論理削除されていない全てのエンティティを取得
    java.util.List<T> findAllByIsDeletedFalse();

    // 論理削除されていないIDの存在チェック
    boolean existsByIdAndIsDeletedFalse(ID id);

}