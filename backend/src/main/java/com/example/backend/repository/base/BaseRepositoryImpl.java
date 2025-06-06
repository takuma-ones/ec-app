package com.example.backend.repository.base;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.springframework.core.annotation.Order;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
                Field field = getFieldFromHierarchy(domainClass, "isDeleted");
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

    private Field getFieldFromHierarchy(Class<?> clazz, String fieldName) throws NoSuchFieldException {
        while (clazz != null) {
            try {
                return clazz.getDeclaredField(fieldName);
            } catch (NoSuchFieldException e) {
                clazz = clazz.getSuperclass();
            }
        }
        throw new NoSuchFieldException("Field '" + fieldName + "' not found in class hierarchy.");
    }


    @Override
    public List<T> findAllByIsDeletedFalse() {
        String jpql = "SELECT e FROM " + domainClass.getName() + " e WHERE e.isDeleted = false";
        return em.createQuery(jpql, domainClass).getResultList();
    }

    @Override
    public List<T> findAllByIsDeletedFalse(Sort sort) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<T> cq = cb.createQuery(domainClass);
        Root<T> root = cq.from(domainClass);

        // WHERE isDeleted = false
        cq.where(cb.isFalse(root.get("isDeleted")));

        // ソートの適用
        List<jakarta.persistence.criteria.Order> orders = sort.stream()
                .map(order -> order.isAscending() ? cb.asc(root.get(order.getProperty())) : cb.desc(root.get(order.getProperty())))
                .collect(Collectors.toList());

        cq.orderBy(orders);

        return em.createQuery(cq).getResultList();
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
