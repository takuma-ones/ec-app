package com.example.backend.repository.base;

import jakarta.persistence.EntityManager;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.util.List;
import java.util.Optional;

public class BaseRepositoryImpl<T, ID extends Serializable>
        extends SimpleJpaRepository<T, ID>
        implements BaseRepository<T, ID> {

    private final EntityManager em;
    private final Class<T> domainClass;

    // ✅ Spring Data JPA が使うコンストラクタ
    public BaseRepositoryImpl(JpaEntityInformation<T, ?> entityInformation, EntityManager em) {
        super(entityInformation, em);
        this.em = em;
        this.domainClass = entityInformation.getJavaType();
    }

    @Override
    @Transactional
    public void softDeleteById(ID id) {
        T entity = em.find(domainClass, id);
        if (entity != null) {
            try {
                Field field = domainClass.getDeclaredField("isDeleted");
                field.setAccessible(true);
                field.set(entity, true);
                em.merge(entity);
                em.flush();
            } catch (NoSuchFieldException e) {
                throw new RuntimeException("エンティティに 'isDeleted' フィールドが存在しません", e);
            } catch (Exception e) {
                throw new RuntimeException("論理削除失敗: " + domainClass.getSimpleName(), e);
            }
        }
    }

    @Override
    public List<T> findAllByIsDeletedFalse() {
        String jpql = "SELECT e FROM " + domainClass.getName() + " e WHERE e.isDeleted = false";
        return em.createQuery(jpql, domainClass).getResultList();
    }

    @Override
    public Optional<T> findByIdAndIsDeletedFalse(ID id) {
        String jpql = "SELECT e FROM " + domainClass.getName() + " e WHERE e.id = :id AND e.isDeleted = false";
        T result = em.createQuery(jpql, domainClass)
                .setParameter("id", id)
                .getResultStream()
                .findFirst()
                .orElse(null);
        return Optional.ofNullable(result);
    }

    @Override
    public boolean existsByIdAndIsDeletedFalse(ID id) {
        String jpql = "SELECT COUNT(e) FROM " + domainClass.getName() + " e WHERE e.id = :id AND e.isDeleted = false";
        Long count = em.createQuery(jpql, Long.class)
                .setParameter("id", id)
                .getSingleResult();
        return count > 0;
    }
}
