package com.aadlab.ecommerce.controller;

import com.aadlab.ecommerce.entity.Product;
import com.aadlab.ecommerce.service.ProductService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> list(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search
    ) {
        return productService.findProducts(categoryId, search);
    }

    @GetMapping("/{id}")
    public Product detail(@PathVariable Long id) {
        return productService.findById(id);
    }
}
