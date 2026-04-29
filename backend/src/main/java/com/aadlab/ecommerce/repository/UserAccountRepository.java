package com.aadlab.ecommerce.repository;

import com.aadlab.ecommerce.entity.UserAccount;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    boolean existsByUsername(String username);

    Optional<UserAccount> findByUsername(String username);
}
