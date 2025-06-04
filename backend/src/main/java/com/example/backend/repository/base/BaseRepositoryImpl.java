package com.example.backend.repository.base;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;

public class BaseRepositoryImpl<T, ID extends Serializable>
        extends SimpleJpaRepository<T, ID>
        implements BaseRepository<T, ID> {

    private final EntityManager em;
    private final Class<T> domainClass;

    public BaseRepositoryImpl(Class<T> domainClass, EntityManager em) {
        super(domainClass, em);
        this.domainClass = domainClass;
        this.em = em;
    }

    // 論理削除（isDeleted を true に更新）
    @Override
    @Transactional
    public void softDeleteById(ID id) {
        T entity = em.find(domainClass, id);
        if (entity != null) {
            try {
                var field = domainClass.getDeclaredField("isDeleted");
                field.setAccessible(true);
                field.set(entity, true);
                em.merge(entity);
            } catch (Exception e) {
                throw new RuntimeException("論理削除失敗: " + domainClass.getSimpleName(), e);
            }
        }
    }

    // 論理削除されていない全てのエンティティを取得
    @Override
    public List<T> findAllByIsDeletedFalse() {
        String jpql = "SELECT e FROM " + domainClass.getSimpleName() + " e WHERE e.isDeleted = false";
        return em.createQuery(jpql, domainClass).getResultList();
    }

    // 論理削除されていないエンティティをIDで取得
    @Override
    public Optional<T> findByIdAndIsDeletedFalse(ID id) {
        String jpql = "SELECT e FROM " + domainClass.getSimpleName() + " e WHERE e.id = :id AND e.isDeleted = false";
        T result = em.createQuery(jpql, domainClass)
                .setParameter("id", id)
                .getResultStream()
                .findFirst()
                .orElse(null);
        return Optional.ofNullable(result);
    }

    // 論理削除されていないエンティティが存在するか確認
    @Override
    public boolean existsByIdAndIsDeletedFalse(ID id) {
        String jpql = "SELECT COUNT(e) FROM " + domainClass.getSimpleName() + " e WHERE e.id = :id AND e.isDeleted = false";
        Long count = em.createQuery(jpql, Long.class)
                .setParameter("id", id)
                .getSingleResult();
        return count > 0;
    }
}
