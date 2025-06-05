package com.example.backend.type;

import com.example.backend.enums.AdminRole;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.type.SqlTypes;
import org.hibernate.usertype.UserType;

import java.io.Serializable;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Objects;

public class PostgreSQLEnumType implements UserType<AdminRole> {

    @Override
    public int getSqlType() {
        return SqlTypes.OTHER;  // PostgreSQL enumはOTHER型
    }

    @Override
    public Class<AdminRole> returnedClass() {
        return AdminRole.class;
    }

    @Override
    public boolean equals(AdminRole x, AdminRole y) {
        return Objects.equals(x, y);
    }

    @Override
    public int hashCode(AdminRole x) {
        return Objects.hashCode(x);
    }

    @Override
    public AdminRole nullSafeGet(ResultSet rs, int position, SharedSessionContractImplementor session, Object owner) throws SQLException {
        String value = rs.getString(position);
        if (value == null) {
            return null;
        }
        return AdminRole.valueOf(value);
    }

    @Override
    public void nullSafeSet(PreparedStatement st, AdminRole value, int index, SharedSessionContractImplementor session) throws SQLException {
        if (value == null) {
            st.setNull(index, SqlTypes.OTHER);
        } else {
            st.setObject(index, value.name(), SqlTypes.OTHER);
        }
    }

    @Override
    public AdminRole deepCopy(AdminRole value) {
        return value;
    }

    @Override
    public boolean isMutable() {
        return false;
    }

    @Override
    public Serializable disassemble(AdminRole value) {
        return value;
    }

    @Override
    public AdminRole assemble(Serializable cached, Object owner) {
        return (AdminRole) cached;
    }

    @Override
    public AdminRole replace(AdminRole original, AdminRole target, Object owner) {
        return original;
    }
}
