package com.example.backend.entity;

    import com.example.backend.entity.base.BaseEntity;
    import com.example.backend.enums.OrderStatus;
    import jakarta.persistence.*;
    import lombok.Getter;
    import lombok.Setter;
    import org.springframework.data.jpa.domain.support.AuditingEntityListener;

    import java.util.HashSet;
    import java.util.Set;

    @Entity
    @Table(name = "orders")
    @EntityListeners(AuditingEntityListener.class)
    @Getter
    @Setter
    public class OrderEntity extends BaseEntity {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id")
        private Integer id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "user_id", nullable = false)
        private UserEntity user;

        @Column(name = "total_amount", nullable = false)
        private Integer totalAmount;

        @Enumerated(EnumType.STRING)
        @Column(name = "status", nullable = false)
        private OrderStatus status;

        @Column(name = "shipping_address", nullable = false, columnDefinition = "TEXT")
        private String shippingAddress;

        @OneToMany(mappedBy = "order", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        private Set<OrderItemEntity> orderItems = new HashSet<>();
    }