package com.aadlab.ecommerce.repository;

import com.aadlab.ecommerce.entity.Product;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByNameContainingIgnoreCase(String search);

    List<Product> findByCategoryIdAndNameContainingIgnoreCase(Long categoryId, String search);
}
