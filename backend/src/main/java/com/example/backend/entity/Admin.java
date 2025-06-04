package com.example.backend.entity;

import com.example.backend.entity.base.BaseEntity;
import com.example.backend.enums.AdminRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "admins")
@Getter
@Setter
public class Admin extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, columnDefinition = "admin_role")
    private AdminRole role;

    @PrePersist
    public void prePersist() {
        if (role == null) {
            role = AdminRole.ADMIN;
        }
    }
}
