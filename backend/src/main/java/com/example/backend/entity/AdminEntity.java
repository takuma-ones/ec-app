package com.example.backend.entity;

import com.example.backend.entity.base.BaseEntity;
import com.example.backend.enums.AdminRole;
import com.example.backend.type.PostgreSQLEnumType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

@Entity
@Table(name = "admins")
@Getter
@Setter
public class AdminEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Type(PostgreSQLEnumType.class)
    @Column(name = "role", nullable = false, columnDefinition = "admin_role")
    private AdminRole role;

    @PrePersist
    public void prePersist() {
        if (role == null) {
            role = AdminRole.ADMIN;
        }
    }
}
