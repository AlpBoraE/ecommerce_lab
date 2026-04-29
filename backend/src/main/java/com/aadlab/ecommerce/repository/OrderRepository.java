package com.aadlab.ecommerce.repository;

import com.aadlab.ecommerce.entity.CustomerOrder;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<CustomerOrder, Long> {
    List<CustomerOrder> findByAccountUsernameOrderByCreatedAtDesc(String accountUsername);
}
