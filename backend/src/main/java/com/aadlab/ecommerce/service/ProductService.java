package com.aadlab.ecommerce.service;

import com.aadlab.ecommerce.dto.ProductRequest;
import com.aadlab.ecommerce.entity.Category;
import com.aadlab.ecommerce.entity.Product;
import com.aadlab.ecommerce.exception.ApiException;
import com.aadlab.ecommerce.repository.CategoryRepository;
import com.aadlab.ecommerce.repository.ProductRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Product> findProducts(Long categoryId, String search) {
        boolean hasCategory = categoryId != null;
        boolean hasSearch = search != null && !search.isBlank();

        if (hasCategory && hasSearch) {
            return productRepository.findByCategoryIdAndNameContainingIgnoreCase(categoryId, search.trim());
        }
        if (hasCategory) {
            return productRepository.findByCategoryId(categoryId);
        }
        if (hasSearch) {
            return productRepository.findByNameContainingIgnoreCase(search.trim());
        }
        return productRepository.findAll();
    }

    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    public Product create(ProductRequest request) {
        Product product = new Product();
        fillProduct(product, request);
        return productRepository.save(product);
    }

    public Product update(Long id, ProductRequest request) {
        Product product = findById(id);
        fillProduct(product, request);
        return productRepository.save(product);
    }

    public void delete(Long id) {
        Product product = findById(id);
        productRepository.delete(product);
    }

    private void fillProduct(Product product, ProductRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Category not found"));

        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setCategory(category);
        product.setStock(request.stock());
        product.setImageUrl(request.imageUrl());
    }
}
